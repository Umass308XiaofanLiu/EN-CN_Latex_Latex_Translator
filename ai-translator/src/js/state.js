// ========================================
// state.js - 全局状态管理
// ========================================

const AppState = {
    // 输入输出状态
    inputText: "",
    originalInputText: "",  // 保存原始粘贴的内容
    translationPairs: [],
    sourceLang: "zh",
    targetLang: "en",

    // 功能开关
    isAutoDetect: true,
    isAutoTranslate: true,
    isAutoSegment: true,  // 自动分段开关：true=逐句分段显示，false=整体翻译
    isLoading: false,
    isEditingMode: true,
    viewMode: 'edit',  // 'edit' | 'preview' | 'original'
    error: null,

    // API配置
    apiProvider: 'gemini', // 'gemini' | 'openai' | 'claude' | 'deepseek' | 'local'
    selectedModel: "gemini-2.5-flash-lite",
    geminiApiKey: "", // Gemini API Key
    openaiApiKey: "", // OpenAI API Key
    claudeApiKey: "", // Claude API Key
    claudeProxyUrl: "", // Claude Proxy URL (Cloudflare Worker)
    deepseekApiKey: "", // DeepSeek API Key
    localBaseUrl: "http://localhost:1234",
    localModels: [],

    // 编辑状态
    activeIndex: null,
    editValues: { src: "", tgt: "" },
    refinePrompt: "",
    isRefining: false,
    customPrompts: { grammar: "", simplify: "" },

    // Toast 提示
    toast: null, // { message: string, type: 'info' | 'success' | 'warning' }

    // AI Insight
    aiInsight: null,
    isInsightLoading: false,

    // 同义词状态
    synonymState: {
        show: false,
        loading: false,
        originalText: "",
        history: [],
        pageIndex: 0,
        position: { x: 0, y: 0 },
        selectionRange: { start: 0, end: 0 },
        field: null,
        contextSentence: ""
    },

    // 历史记录
    globalHistory: [],
    sessionId: Date.now().toString(),
    autoSaveInterval: 5 * 60 * 1000,
    historyLimit: 5,

    // UI菜单状态
    showModelMenu: false,
    showHistoryMenu: false,
    showSaveMenu: false,
    showLocalSettings: false,
    showSettings: false, // 新增：设置弹窗状态
    isConnectingLocal: false,

    // 模型可见性设置
    modelVisibility: {
        'gemini-2.5-flash-lite': true,
        'gemini-3-flash-preview': true,
        'gemini-3-pro-preview': true,
        'gpt-5-nano': true,
        'gpt-5-mini': true,
        'gpt-5.2': true,
        'claude-haiku-4-5-20251001': true,
        'claude-sonnet-4-5-20250929': true,
        'claude-opus-4-5-20251101': true,
        'deepseek-chat': true,
        'deepseek-reasoner': true
    },
    
    // AI Toolbar 设置弹窗状态
    activeSettingsPopup: null, // 'grammar' | 'simplify' | null
    activeSettingsIndex: null,
    activeSettingsSide: null,

    // 控制标志
    isRestoringHistory: false,
    lastTranslatedText: "",

    // Abort Controllers
    mainAbortController: null,
    rowAbortControllers: new Map(),
    regenerateAbortControllers: new Map(),
    regenerateAllAbortController: null,

    // 重新生成状态
    isRegeneratingAll: false,

    // Timers
    debounceTimer: null,
    autoSaveTimer: null
};

// 获取API配置对象
function getApiConfig() {
    return {
        provider: AppState.apiProvider,
        model: AppState.selectedModel,
        localBaseUrl: AppState.localBaseUrl,
        geminiApiKey: AppState.geminiApiKey,
        openaiApiKey: AppState.openaiApiKey,
        claudeApiKey: AppState.claudeApiKey,
        claudeProxyUrl: AppState.claudeProxyUrl,
        deepseekApiKey: AppState.deepseekApiKey
    };
}

// 状态更新并触发UI重渲染
// options: { skipRender: bool, preserveScroll: bool (default true) }
function setState(updates, options = {}) {
    // 兼容旧的 skipRender 布尔参数
    if (typeof options === 'boolean') {
        options = { skipRender: options };
    }
    const { skipRender = false, preserveScroll = true } = options;

    Object.assign(AppState, updates);
    if (!skipRender && typeof renderApp === 'function') {
        // renderApp 现在内置滚动保护，传递 preserveScroll 参数
        renderApp(preserveScroll);
    }
}

// 更新翻译对
function updateTranslationPair(index, updates) {
    const pairs = [...AppState.translationPairs];
    pairs[index] = { ...pairs[index], ...updates };
    setState({ translationPairs: pairs });
}

// 更新同义词状态
function updateSynonymState(updates) {
    Object.assign(AppState.synonymState, updates);
    // 只更新同义词弹窗，不重新渲染整个页面
    renderSynonymPopupOnly();
}

// 只渲染同义词弹窗（不影响其他 DOM）
function renderSynonymPopupOnly() {
    // 移除旧的弹窗
    const oldPopup = document.getElementById('synonymPopup');
    if (oldPopup) oldPopup.remove();
    
    // 如果不需要显示，直接返回
    if (!AppState.synonymState.show) return;
    
    // 创建新的弹窗元素
    const s = AppState.synonymState;
    const currentSynonyms = s.history[s.pageIndex] || [];
    
    const popupHtml = `
        <div id="synonymPopup" style="position:fixed;left:${s.position.x}px;top:${s.position.y + 20}px;transform:translateX(-10%);" class="z-[100] bg-white border border-slate-200 rounded-xl shadow-2xl p-3 min-w-[240px] flex flex-col gap-2">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    ${Icons.SparklesSmall} Options for "${escapeHtml(s.originalText)}"
                </div>
                <button onclick="updateSynonymState({show:false})" class="text-slate-300 hover:text-slate-500">${Icons.XSmall}</button>
            </div>
            <div class="min-h-[60px] flex flex-col justify-center">
                ${s.loading ? `
                    <div class="flex items-center gap-2 text-xs text-slate-400 py-2 justify-center">
                        <span class="text-indigo-500">${Icons.LoaderSmall}</span> ${s.history.length > 0 ? 'Finding new options...' : 'Finding context matches...'}
                    </div>
                ` : currentSynonyms.length > 0 ? `
                    <div class="flex flex-col gap-1">
                        ${currentSynonyms.map((syn, i) => `
                            <button onclick="applySynonym('${escapeHtml(syn).replace(/'/g, "\\'")}')" class="text-left px-2 py-1.5 rounded hover:bg-indigo-50 text-slate-700 text-xs font-medium hover:text-indigo-700 transition-colors flex items-center gap-2 group">
                                <span class="opacity-0 group-hover:opacity-50 text-indigo-400">${Icons.ArrowRightLeftSmall}</span> ${escapeHtml(syn)}
                            </button>
                        `).join('')}
                    </div>
                ` : `<div class="text-xs text-slate-400 text-center py-2 italic">No context-aware alternatives found.</div>`}
            </div>
            ${(currentSynonyms.length > 0 || s.history.length > 0) ? `
                <div class="flex items-center justify-between border-t border-slate-100 mt-2 pt-2">
                    <button onclick="handleSynonymPageChange(-1)" ${s.pageIndex === 0 || s.loading ? 'disabled' : ''} class="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 transition-all">${Icons.ChevronLeft}</button>
                    <span class="text-[9px] font-mono text-slate-300 select-none">Page ${s.pageIndex + 1}</span>
                    <button onclick="handleSynonymPageChange(1)" ${s.loading ? 'disabled' : ''} class="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 transition-all">${Icons.ChevronRight}</button>
                </div>
            ` : ''}
        </div>
    `;
    
    // 插入到 body
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

// 默认Prompt常量
const DEFAULT_GRAMMAR_PROMPT = "Check the grammar of the following text and correct it if necessary. Keep the academic tone.";
const DEFAULT_SIMPLIFY_PROMPT = "Rewrite the following sentence to be MORE DIRECT, CONCISE, and SIMPLE to read. Keep the original meaning. STRICTLY PRESERVE all LaTeX math and citations.";

// 语言检测
function detectLanguage(text) {
    const zhMatch = text.match(/[\u4e00-\u9fa5]/g);
    const enMatch = text.match(/[a-zA-Z]/g);
    return (zhMatch?.length || 0) >= (enMatch?.length || 0)
        ? { src: 'zh', tgt: 'en' }
        : { src: 'en', tgt: 'zh' };
}

// LaTeX清理辅助函数
function stripCommand(str, cmd) {
    let result = str;
    while (true) {
        const pattern = new RegExp(`\\\\${cmd}(?:\\*)?\\s*\\{`);
        const match = pattern.exec(result);
        if (!match) break;
        const startIndex = match.index;
        const openBraceIndex = startIndex + match[0].length - 1;
        let depth = 1;
        let endIndex = -1;
        for (let i = openBraceIndex + 1; i < result.length; i++) {
            if (result[i] === '{') depth++;
            else if (result[i] === '}') depth--;
            if (depth === 0) { endIndex = i; break; }
        }
        if (endIndex !== -1) {
            result = result.substring(0, startIndex) + result.substring(endIndex + 1);
        } else { break; }
    }
    return result;
}

function cleanLatex(formula) {
    let clean = formula;
    clean = clean.replace(/(^|[^\\])%.*$/gm, '$1');
    clean = clean.replace(/\\\[\s*(\d+(?:\.\d+)?(?:pt|em|ex|cm|mm|in|pc|px))\s*\]/g, '\\\\[$1]');
    return clean;
}

// 渲染格式化文本（支持Markdown和LaTeX）
function renderFormattedText(text) {
    if (!text || !window.marked || !window.katex) return text || '';
    
    let content = text.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ');
    const placeholders = [];
    
    const pushPlaceholder = (regex, type, getFormula) => {
        content = content.replace(regex, (...args) => {
            const match = args[0];
            const id = `%%LATEX_${placeholders.length}%%`;
            let formula = getFormula(...args);
            formula = cleanLatex(formula);
            formula = stripCommand(formula, 'label');
            formula = stripCommand(formula, 'tag');
            try {
                const rendered = window.katex.renderToString(formula, {
                    displayMode: type === 'display',
                    throwOnError: false,
                    trust: true,
                    strict: false,
                    fleqn: false
                });
                placeholders.push({ id, html: rendered });
            } catch (e) {
                placeholders.push({ id, html: match });
            }
            return id;
        });
    };
    
    pushPlaceholder(/\\begin\{([\w\*]+)\}([\s\S]*?)\\end\{\1\}/g, 'display', (match, env, body) => {
        // 将带编号的环境转换为不带编号的版本
        const envMap = {
            'equation': 'equation*',
            'align': 'align*',
            'gather': 'gather*',
            'multline': 'multline*',
            'eqnarray': 'eqnarray*'
        };
        const noNumberEnv = envMap[env] || env;
        return `\\begin{${noNumberEnv}}${body}\\end{${noNumberEnv}}`;
    });
    pushPlaceholder(/\\\[([\s\S]*?)\\\]/g, 'display', (match, p1) => p1);
    pushPlaceholder(/\$\$([\s\S]*?)\$\$/g, 'display', (match, p1) => p1);
    pushPlaceholder(/\\\(([\s\S]*?)\\\)/g, 'inline', (match, p1) => p1);
    pushPlaceholder(/\$([^\$]+?)\$/g, 'inline', (match, p1) => p1);
    
    let html = window.marked.parse(content);
    placeholders.forEach(p => { html = html.replace(p.id, p.html); });
    return html;
}
