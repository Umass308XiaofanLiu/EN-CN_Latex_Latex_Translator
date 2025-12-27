// ========================================
// translate.js - 翻译核心逻辑
// ========================================

// ============= 翻译相关函数 =============

// 执行翻译
async function handleTranslate() {
    // 停止功能
    if (AppState.isLoading && AppState.mainAbortController) {
        AppState.mainAbortController.abort();
        setState({ isLoading: false });
        return;
    }

    if (!AppState.inputText.trim()) return;

    // 检查输入是否变化：如果已有翻译结果且输入未改变，则不执行翻译
    // 用户应使用重新生成按钮来重新翻译
    if (AppState.translationPairs.length > 0 && AppState.inputText === AppState.lastTranslatedText) {
        return;
    }

    // 保存原始输入内容（首次翻译时）
    if (!AppState.originalInputText || AppState.translationPairs.length === 0) {
        AppState.originalInputText = AppState.inputText;
    }

    // 同步基线以防止重复自动翻译
    AppState.lastTranslatedText = AppState.inputText;

    let srcLang, tgtLang;
    if (AppState.isAutoDetect) {
        const detected = detectLanguage(AppState.inputText);
        srcLang = detected.src;
        tgtLang = detected.tgt;
        setState({ sourceLang: srcLang, targetLang: tgtLang }, true);
    } else {
        srcLang = AppState.sourceLang;
        tgtLang = AppState.targetLang;
    }

    setState({ isLoading: true, error: null, aiInsight: null });

    // 初始化AbortController
    const controller = new AbortController();
    AppState.mainAbortController = controller;

    try {
        const config = getApiConfig();
        const result = await translateBulk(AppState.inputText, srcLang, tgtLang, config, controller.signal);

        if (result?.translations) {
            const pairs = result.translations.map(t => ({
                src: t.src,
                tgt: t.tgt,
                history: [{ src: t.src, tgt: t.tgt }],
                historyIndex: 0,
                isUpdating: false,
                isRegenerating: false
            }));
            setState({ translationPairs: pairs, isEditingMode: false, viewMode: 'preview', isLoading: false });
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            setState({ error: err.message || "AI Translation failed. Please try again." });
            console.error(err);
        }
    } finally {
        // 确保 isLoading 状态被正确设置并触发重新渲染
        AppState.mainAbortController = null;
        if (AppState.isLoading) {
            setState({ isLoading: false });
        }
    }
}

// 保存行更新
async function saveRowUpdate(index, manualValues = null) {
    const original = AppState.translationPairs[index];
    const currentSrc = manualValues ? manualValues.src : AppState.editValues.src;
    const currentTgt = manualValues ? manualValues.tgt : AppState.editValues.tgt;

    // 检查是否需要取消现有更新
    if (original.isUpdating) {
        const controller = AppState.rowAbortControllers.get(index);
        if (controller) {
            controller.abort();
            AppState.rowAbortControllers.delete(index);
            updateTranslationPair(index, { isUpdating: false });
            return;
        }
    }

    // 严格检查：如果完全没有变化，立即退出
    if (currentSrc === original.src && currentTgt === original.tgt) {
        return;
    }

    const srcChanged = currentSrc !== original.src;
    const tgtChanged = currentTgt !== original.tgt;
    const needsAiUpdate = (srcChanged && !tgtChanged) || (tgtChanged && !srcChanged);

    updateTranslationPair(index, {
        src: currentSrc,
        tgt: currentTgt,
        isUpdating: needsAiUpdate
    });

    let prompt = "";
    let updateField = null;

    if (srcChanged && !tgtChanged) {
        prompt = `You are updating a translation. Original Source: "${original.src}". Current Translation: "${original.tgt}". New Source: "${currentSrc}". Task: Translate the "New Source" to ${AppState.targetLang === 'zh' ? 'Chinese' : 'English'}. Constraint: Keep the style and vocabulary of the "Current Translation" where possible. Return JSON: {"text": "..."}`;
        updateField = "tgt";
    } else if (tgtChanged && !srcChanged) {
        prompt = `You are aligning a source text to match a modified translation. Original Source: "${original.src}". Original Translation: "${original.tgt}". New Translation: "${currentTgt}". Task: Update the "Original Source" in ${AppState.sourceLang === 'zh' ? 'Chinese' : 'English'} so that it matches the meaning AND TONE of the "New Translation". Return JSON: {"text": "..."}`;
        updateField = "src";
    }

    if (!updateField) {
        addHistory(index, currentSrc, currentTgt);
        return;
    }

    // AI更新（支持中止）
    const controller = new AbortController();
    AppState.rowAbortControllers.set(index, controller);

    try {
        const config = getApiConfig();
        const resultText = await getSmartUpdate(prompt, config, controller.signal);
        const finalSrc = updateField === 'src' ? resultText : currentSrc;
        const finalTgt = updateField === 'tgt' ? resultText : currentTgt;
        addHistory(index, finalSrc, finalTgt);
        // editValues 已在 addHistory 中同步更新
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.error("Smart update failed", e);
            addHistory(index, currentSrc, currentTgt);
            setState({ error: e.message || "Smart update failed" });
        }
    } finally {
        AppState.rowAbortControllers.delete(index);
    }
}

// 添加历史记录
function addHistory(index, s, t) {
    const pairs = [...AppState.translationPairs];
    const newHistory = [...pairs[index].history, { src: s, tgt: t }];
    pairs[index] = {
        ...pairs[index],
        src: s,
        tgt: t,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isUpdating: false
    };
    
    // 同时更新 editValues 以保持同步，避免状态不一致
    if (AppState.activeIndex === index) {
        AppState.editValues = { src: s, tgt: t };
    }
    
    setState({ translationPairs: pairs });
}

// 历史导航
function handleHistoryNav(index, delta) {
    const item = AppState.translationPairs[index];
    const newIdx = item.historyIndex + delta;
    if (newIdx >= 0 && newIdx < item.history.length) {
        const historic = item.history[newIdx];
        const pairs = [...AppState.translationPairs];
        pairs[index] = { ...item, src: historic.src, tgt: historic.tgt, historyIndex: newIdx };
        
        // 同时更新 editValues 以保持同步
        if (AppState.activeIndex === index) {
            AppState.editValues = { src: historic.src, tgt: historic.tgt };
        }
        
        setState({ translationPairs: pairs });
    }
}

// AI精炼
async function handleAiRefine(index, field, type) {
    if (AppState.isRefining) return;
    setState({ isRefining: true });

    const text = field === 'src' ? AppState.editValues.src : AppState.editValues.tgt;
    const lang = field === 'src' ? AppState.sourceLang : AppState.targetLang;

    let instruction = undefined;
    if (type === 'grammar') instruction = AppState.customPrompts.grammar;
    if (type === 'simplify') instruction = AppState.customPrompts.simplify;

    try {
        const config = getApiConfig();
        const customInst = type === 'custom' ? AppState.refinePrompt : instruction;
        const refined = await refineSentence(text, lang, type, config, customInst);
        
        if (refined) {
            const newVals = { ...AppState.editValues, [field]: refined };
            setState({ editValues: newVals }, true);
            await saveRowUpdate(index, newVals);
        }
    } catch (e) {
        setState({ error: e.message || "Refinement failed" });
    } finally {
        setState({ isRefining: false });
        if (type === 'custom') setState({ refinePrompt: "" }, true);
    }
}

// 处理文本选择（同义词）
async function handleTextSelect(event, field, index) {
    const target = event.target;
    let start = target.selectionStart;
    let end = target.selectionEnd;

    if (start === end) return;

    const text = target.value;
    let selectedText = text.substring(start, end);

    // 去除尾随空格（浏览器双击选词常常会包含尾随空格）
    const trimmedEnd = selectedText.replace(/\s+$/, '');
    if (trimmedEnd.length < selectedText.length) {
        end = start + trimmedEnd.length;
        selectedText = trimmedEnd;
        // 更新浏览器的选中范围
        target.setSelectionRange(start, end);
    }
    
    // 去除前导空格
    const trimmedStart = selectedText.replace(/^\s+/, '');
    if (trimmedStart.length < selectedText.length) {
        start = end - trimmedStart.length;
        selectedText = trimmedStart;
        target.setSelectionRange(start, end);
    }

    if (!selectedText || selectedText.length < 1 || /^\s*$/.test(selectedText)) return;

    updateSynonymState({
        show: true,
        loading: true,
        originalText: selectedText,
        history: [],
        pageIndex: 0,
        position: { x: event.clientX, y: event.clientY },
        selectionRange: { start, end },
        field,
        contextSentence: text
    });

    try {
        const lang = field === 'src' ? AppState.sourceLang : AppState.targetLang;
        const config = getApiConfig();
        const alternatives = await getSynonyms(text, selectedText, lang, config, []);

        updateSynonymState({
            loading: false,
            history: [alternatives]
        });
    } catch (err) {
        console.error(err);
        updateSynonymState({ show: false });
    }
}

// 同义词翻页
async function handleSynonymPageChange(direction) {
    const { pageIndex, history, contextSentence, originalText, field } = AppState.synonymState;

    if (direction === -1) {
        if (pageIndex > 0) {
            updateSynonymState({ pageIndex: pageIndex - 1 });
        }
    } else {
        if (pageIndex < history.length - 1) {
            updateSynonymState({ pageIndex: pageIndex + 1 });
        } else {
            if (!field) return;
            const lang = field === 'src' ? AppState.sourceLang : AppState.targetLang;

            updateSynonymState({ loading: true });

            try {
                const avoidList = history.flat();
                const config = getApiConfig();
                const newAlternatives = await getSynonyms(contextSentence, originalText, lang, config, avoidList);

                updateSynonymState({
                    loading: false,
                    history: [...history, newAlternatives],
                    pageIndex: pageIndex + 1
                });
            } catch (e) {
                updateSynonymState({ loading: false });
            }
        }
    }
}

// 应用同义词
function applySynonym(synonym) {
    if (!AppState.synonymState.field || AppState.activeIndex === null) return;

    const field = AppState.synonymState.field;
    const currentText = AppState.editValues[field];
    const { start, end } = AppState.synonymState.selectionRange;

    const newText = currentText.substring(0, start) + synonym + currentText.substring(end);

    // 更新状态
    AppState.editValues[field] = newText;
    
    // 直接更新 textarea 的值（避免重新渲染）
    const textarea = document.getElementById(`editTextarea_${field}_${AppState.activeIndex}`);
    if (textarea) {
        textarea.value = newText;
        // 设置光标位置到替换文本末尾
        const newCursorPos = start + synonym.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
    }
    
    // 关闭弹窗
    updateSynonymState({ show: false });
}

// 处理摘要
async function handleSummary() {
    if (AppState.translationPairs.length === 0) return;
    
    setState({ isInsightLoading: true, aiInsight: { type: 'summary', title: 'Loading...', content: '' } });
    
    try {
        const fullText = AppState.translationPairs.map(p => p.src).join('\n');
        const config = getApiConfig();
        const summary = await summarizeText(fullText, config);
        setState({ aiInsight: { type: 'summary', title: '学术摘要', content: summary } });
    } catch (e) {
        setState({ aiInsight: null, error: e.message || "Failed to generate summary" });
    } finally {
        setState({ isInsightLoading: false });
    }
}

// 连接本地服务器
async function handleConnectLocal() {
    setState({ isConnectingLocal: true, error: null });
    
    try {
        const models = await fetchLocalModels(AppState.localBaseUrl);
        setState({ localModels: models });
        
        let selectedModelId;
        if (models.length > 0) {
            selectedModelId = models[0].id;
            setState({ apiProvider: 'local', selectedModel: selectedModelId });
        } else {
            selectedModelId = 'local-model';
            setState({ apiProvider: 'local', selectedModel: selectedModelId });
        }
        
        // 保存到 localStorage
        try {
            localStorage.setItem('apiProvider', 'local');
            localStorage.setItem('selectedModel', selectedModelId);
            localStorage.setItem('localBaseUrl', AppState.localBaseUrl);
        } catch (e) {}
        
        setState({ showLocalSettings: false });
    } catch (e) {
        setState({ error: e.message });
    } finally {
        setState({ isConnectingLocal: false });
    }
}

// ============= 全局历史管理 =============

function addToGlobalHistory(pairs, sid) {
    if (pairs.length === 0) return;

    let history = [...AppState.globalHistory];
    const existingIndex = history.findIndex(item => item.id === sid);
    const updatedPairs = JSON.parse(JSON.stringify(pairs));

    if (existingIndex !== -1) {
        history[existingIndex] = {
            ...history[existingIndex],
            timestamp: Date.now(),
            pairs: updatedPairs
        };
        const item = history.splice(existingIndex, 1)[0];
        history.unshift(item);
    } else {
        const newItem = {
            id: sid,
            timestamp: Date.now(),
            pairs: updatedPairs
        };
        history = [newItem, ...history];
    }

    setState({ globalHistory: history.slice(0, AppState.historyLimit) });
}

function restoreGlobalHistory(item) {
    if (AppState.translationPairs.length > 0) {
        addToGlobalHistory(AppState.translationPairs, AppState.sessionId);
    }

    AppState.isRestoringHistory = true;

    setState({
        sessionId: item.id,
        translationPairs: item.pairs,
        inputText: item.pairs.map(p => p.src).join('\n'),
        isEditingMode: false,
        showHistoryMenu: false
    });

    setTimeout(() => {
        AppState.isRestoringHistory = false;
    }, 500);
}

// ============= 事件处理 =============

function handleInputChange(value) {
    // 如果正在恢复历史，跳过
    if (AppState.isRestoringHistory) {
        return;
    }

    // 如果从空变为有内容，创建新会话
    if (AppState.inputText === "" && value !== "") {
        if (AppState.translationPairs.length === 0) {
            AppState.sessionId = Date.now().toString();
        }
    }

    AppState.inputText = value;
    AppState.isEditingMode = true;
    AppState.isRestoringHistory = false;

    // 如果输入为空，清空状态并重新渲染（需要隐藏翻译结果）
    if (!value.trim()) {
        AppState.translationPairs = [];
        renderApp();
        return;
    }

    // 自动翻译防抖
    if (AppState.isAutoTranslate) {
        if (AppState.debounceTimer) {
            clearTimeout(AppState.debounceTimer);
        }
        AppState.debounceTimer = setTimeout(() => {
            if (AppState.isEditingMode && AppState.inputText !== AppState.lastTranslatedText) {
                handleTranslate();
            }
        }, 1500);
    }

    // 不再调用 renderApp()，避免焦点丢失
    // 输入时 textarea 的值已经被浏览器更新，无需重新渲染
}

function handleRowClick(index, clickedSide = null) {
    if (AppState.activeIndex !== null && AppState.activeIndex !== index) {
        saveRowUpdate(AppState.activeIndex);
    }
    setState({
        activeIndex: index,
        editValues: {
            src: AppState.translationPairs[index].src,
            tgt: AppState.translationPairs[index].tgt
        },
        isEditingMode: false
    });

    // 滚动同步：将另一侧对应的句子滚动到相同位置
    requestAnimationFrame(() => {
        syncScrollToRow(index, clickedSide);
    });
}

// 滚动同步函数
function syncScrollToRow(index, clickedSide) {
    // 获取源面板和目标面板的滚动容器
    const sourceContainer = document.querySelector('section:first-of-type .overflow-y-auto');
    const targetContainer = document.querySelector('section:last-of-type .overflow-y-auto');

    if (!sourceContainer || !targetContainer) return;

    // 获取两侧对应索引的行元素
    const sourceRow = sourceContainer.querySelector(`[data-idx="${index}"]`);
    const targetRow = targetContainer.querySelector(`[data-idx="${index}"]`);

    if (!sourceRow || !targetRow) return;

    // 计算点击侧的行相对于容器的位置
    if (clickedSide === 'src') {
        // 点击了源面板，同步目标面板
        const sourceRowRect = sourceRow.getBoundingClientRect();
        const sourceContainerRect = sourceContainer.getBoundingClientRect();
        const relativeTop = sourceRowRect.top - sourceContainerRect.top;

        // 将目标面板滚动到相同相对位置
        const targetRowOffsetTop = targetRow.offsetTop;
        targetContainer.scrollTop = targetRowOffsetTop - relativeTop;
    } else if (clickedSide === 'tgt') {
        // 点击了目标面板，同步源面板
        const targetRowRect = targetRow.getBoundingClientRect();
        const targetContainerRect = targetContainer.getBoundingClientRect();
        const relativeTop = targetRowRect.top - targetContainerRect.top;

        // 将源面板滚动到相同相对位置
        const sourceRowOffsetTop = sourceRow.offsetTop;
        sourceContainer.scrollTop = sourceRowOffsetTop - relativeTop;
    }
}

// 全局点击处理 - 点击空白区域退出编辑模式
function handleGlobalClick(event) {
    // 如果没有正在编辑的句子，直接返回
    if (AppState.activeIndex === null) return;

    // 检查点击的目标是否在句子行内
    const clickedRow = event.target.closest('[data-idx]');
    if (clickedRow) return;

    // 检查是否点击了模态框、菜单、按钮等交互元素
    const clickedModal = event.target.closest('.fixed.inset-0'); // 模态框
    const clickedButton = event.target.closest('button');
    const clickedInput = event.target.closest('input, textarea, select');
    const clickedDropdown = event.target.closest('[onclick*="toggle"], [onclick*="Menu"], [onclick*="Settings"]');

    // 如果点击了这些元素，不退出编辑模式
    if (clickedModal || clickedButton || clickedInput || clickedDropdown) return;

    // 点击了空白区域，保存当前编辑并退出编辑模式
    saveRowUpdate(AppState.activeIndex);
    setState({
        activeIndex: null,
        editValues: { src: '', tgt: '' }
    });
}

// 向后兼容的局部处理函数
function handleBlankAreaClick(event) {
    handleGlobalClick(event);
}

function handleManualSave() {
    if (AppState.translationPairs.length > 0) {
        addToGlobalHistory(AppState.translationPairs, AppState.sessionId);
    }
}

function handleClear() {
    if (AppState.mainAbortController) {
        AppState.mainAbortController.abort();
    }

    if (AppState.translationPairs.length > 0) {
        addToGlobalHistory(AppState.translationPairs, AppState.sessionId);
    }

    AppState.isRestoringHistory = true;

    setState({
        inputText: "",
        originalInputText: "",
        translationPairs: [],
        activeIndex: null,
        isEditingMode: true,
        viewMode: 'edit',
        isLoading: false,
        sessionId: Date.now().toString(),
        error: null
    });

    updateSynonymState({ show: false });

    setTimeout(() => {
        AppState.isRestoringHistory = false;
    }, 100);

    AppState.lastTranslatedText = "";
}

function toggleEditMode() {
    if (AppState.isEditingMode) {
        setState({ isEditingMode: false });
    } else {
        const reconstructed = AppState.translationPairs.map(p => p.src).join('\n');
        setState({ inputText: reconstructed, isEditingMode: true });
        AppState.lastTranslatedText = reconstructed;
    }
}

// ============= 重新生成所有翻译 =============
async function handleRegenerateAll() {
    // 如果没有翻译对，直接返回
    if (AppState.translationPairs.length === 0) return;

    // 如果正在重新生成，则取消
    if (AppState.isRegeneratingAll) {
        if (AppState.regenerateAllAbortController) {
            AppState.regenerateAllAbortController.abort();
            AppState.regenerateAllAbortController = null;
        }
        setState({ isRegeneratingAll: false });
        return;
    }

    // 初始化 AbortController
    const controller = new AbortController();
    AppState.regenerateAllAbortController = controller;

    setState({ isRegeneratingAll: true, error: null });

    try {
        const config = getApiConfig();
        // 使用原始输入内容重新翻译（不是按句拼接的）
        const originalText = AppState.originalInputText || AppState.inputText;

        // 重新翻译所有内容
        const result = await translateBulk(originalText, AppState.sourceLang, AppState.targetLang, config, controller.signal);

        if (result?.translations) {
            // 重新生成时，每个翻译对重置历史记录（不累加每句的历史）
            const pairs = result.translations.map((t) => ({
                src: t.src,
                tgt: t.tgt,
                history: [{ src: t.src, tgt: t.tgt }],
                historyIndex: 0,
                isUpdating: false,
                isRegenerating: false
            }));
            setState({ translationPairs: pairs, viewMode: 'preview', activeIndex: null });
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            setState({ error: err.message || "重新生成翻译失败，请重试。" });
            console.error(err);
        }
    } finally {
        AppState.regenerateAllAbortController = null;
        setState({ isRegeneratingAll: false });
    }
}

// ============= 重新生成单条翻译 =============
async function handleRegenerateTranslation(index) {
    const pair = AppState.translationPairs[index];
    if (!pair) return;

    // 如果正在重新生成，则取消
    if (pair.isRegenerating) {
        const controller = AppState.regenerateAbortControllers?.get(index);
        if (controller) {
            controller.abort();
            AppState.regenerateAbortControllers.delete(index);
            updateTranslationPair(index, { isRegenerating: false });
        }
        return;
    }

    // 初始化 AbortController Map (如果不存在)
    if (!AppState.regenerateAbortControllers) {
        AppState.regenerateAbortControllers = new Map();
    }

    const controller = new AbortController();
    AppState.regenerateAbortControllers.set(index, controller);

    // 标记正在重新生成
    updateTranslationPair(index, { isRegenerating: true });

    try {
        const config = getApiConfig();
        const srcText = pair.src;
        const oldTgt = pair.tgt;

        // 使用当前语言设置重新翻译
        const result = await translateBulk(srcText, AppState.sourceLang, AppState.targetLang, config, controller.signal);

        if (result?.translations && result.translations.length > 0) {
            const newTgt = result.translations[0].tgt;

            // 只有当新翻译与旧翻译不同时，才添加到历史记录
            if (newTgt !== oldTgt) {
                addHistory(index, srcText, newTgt);

                // 如果当前正在编辑这一行，同时更新 editValues
                if (AppState.activeIndex === index) {
                    AppState.editValues.tgt = newTgt;
                }
            }
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            setState({ error: err.message || "重新生成翻译失败，请重试。" });
            console.error(err);
        }
    } finally {
        AppState.regenerateAbortControllers?.delete(index);
        updateTranslationPair(index, { isRegenerating: false });
    }
}
