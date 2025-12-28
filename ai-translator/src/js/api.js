// ========================================
// api.js - API服务（Gemini、OpenAI、Claude和本地LLM）
// ========================================

// Gemini API端点
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// OpenAI API端点
const OPENAI_API_BASE = "https://api.openai.com/v1/chat/completions";

// Claude API端点
const CLAUDE_API_BASE = "https://api.anthropic.com/v1/messages";

// DeepSeek API端点
const DEEPSEEK_API_BASE = "https://api.deepseek.com/chat/completions";

// ============= 本地LLM调用（OpenAI兼容）=============
async function callLocalLLM(baseUrl, model, messages, jsonMode = false, signal = null) {
    const body = {
        model: model || "local-model",
        messages: messages,
        temperature: 0.3,
        max_tokens: 4096
    };

    // LM Studio的JSON模式
    if (jsonMode) {
        body.response_format = { type: "json_object" };
    }

    // 构建endpoint - 直接使用/v1/chat/completions
    const endpoint = `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw error;
    }
}

// 获取本地模型列表
async function fetchLocalModels(baseUrl) {
    // 直接使用/v1/models端点，不设置Content-Type（GET请求不需要）
    const endpoint = `${baseUrl.replace(/\/$/, "")}/v1/models`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Fetch models error:", error);
        throw new Error(`无法连接到 ${baseUrl}。请确保 LM Studio 服务器正在运行。`);
    }
}

// 解析JSON响应（处理可能的markdown包裹）
function parseJsonResponse(text) {
    // 检查空响应
    if (!text || text.trim() === '') {
        console.error('parseJsonResponse: Empty response received');
        throw new Error('无法解析 JSON 响应: 收到空响应');
    }

    let clean = text.trim();

    // 移除 markdown 代码块
    if (clean.startsWith('```json')) clean = clean.slice(7);
    else if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
        return JSON.parse(clean);
    } catch (e) {
        // 尝试提取JSON对象
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
            try { return JSON.parse(match[0]); } catch (e2) {}
        }
        // 尝试提取JSON数组
        const arrayMatch = clean.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            try {
                const arr = JSON.parse(arrayMatch[0]);
                return { translations: arr };
            } catch (e3) {}
        }
        console.error('parseJsonResponse failed. Raw response:', text.substring(0, 500));
        throw new Error('无法解析 JSON 响应');
    }
}

// ============= Gemini API调用 =============
async function callGeminiAPI(model, contents, config = {}, apiKey = null, signal = null) {
    if (!apiKey) {
        throw new Error("Gemini API Key not configured. Please add your API key in Settings.");
    }

    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

    const body = {
        contents: [{ parts: [{ text: contents }] }],
        generationConfig: {
            temperature: config.temperature || 0.3
        }
    };

    if (config.systemInstruction) {
        body.systemInstruction = { parts: [{ text: config.systemInstruction }] };
    }

    if (config.responseMimeType) {
        body.generationConfig.responseMimeType = config.responseMimeType;
    }

    if (config.responseSchema) {
        body.generationConfig.responseSchema = config.responseSchema;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ============= OpenAI API调用 =============
// 需要特殊参数处理的新模型（不支持 temperature 和 max_tokens）
const OPENAI_NEW_MODELS = ['gpt-5-nano', 'gpt-5-mini', 'gpt-5.2', 'o1', 'o1-mini', 'o1-preview', 'o3', 'o3-mini'];

function isNewOpenAIModel(model) {
    return OPENAI_NEW_MODELS.some(m => model.startsWith(m));
}

// 根据模型获取合适的 max tokens 限制
function getMaxTokensForModel(model, configMax) {
    if (configMax) return configMax;
    // Nano 模型使用较小的 token 限制
    if (model.includes('nano')) return 2048;
    // Mini 模型使用中等限制
    if (model.includes('mini')) return 4096;
    // 其他模型使用默认值
    return 4096;
}

async function callOpenAIAPI(model, messages, config = {}, apiKey = null, signal = null) {
    if (!apiKey) {
        throw new Error("OpenAI API Key not configured. Please add your API key in Settings.");
    }

    const body = {
        model: model,
        messages: messages
    };

    // 新模型不支持自定义 temperature，只支持默认值 1
    if (!isNewOpenAIModel(model)) {
        body.temperature = config.temperature || 0.3;
    }

    // 新模型使用 max_completion_tokens，旧模型使用 max_tokens
    const maxTokens = getMaxTokensForModel(model, config.max_tokens);
    if (isNewOpenAIModel(model)) {
        body.max_completion_tokens = maxTokens;
    } else {
        body.max_tokens = maxTokens;
    }

    // 如果需要JSON响应（新模型不支持 response_format，通过 prompt 指示返回 JSON）
    if (config.jsonMode && !isNewOpenAIModel(model)) {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch(OPENAI_API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

// ============= Claude API调用 =============
// Claude 模型 token 限制
function getMaxTokensForClaudeModel(model, configMax) {
    if (configMax) return configMax;
    // Haiku 模型使用较小的 token 限制
    if (model.includes('haiku')) return 4096;
    // Sonnet 和 Opus 使用较大限制
    return 8192;
}

async function callClaudeAPI(model, messages, config = {}, apiKey = null, signal = null, proxyUrl = null) {
    if (!apiKey) {
        throw new Error("Claude API Key not configured. Please add your API key in Settings.");
    }

    if (!proxyUrl) {
        throw new Error("Claude Proxy URL not configured. Please add your Cloudflare Worker proxy URL in Settings.");
    }

    // 提取 system message（Claude 使用单独的 system 参数）
    let systemPrompt = null;
    const userMessages = [];

    for (const msg of messages) {
        if (msg.role === 'system') {
            systemPrompt = msg.content;
        } else {
            userMessages.push({
                role: msg.role,
                content: msg.content
            });
        }
    }

    const body = {
        model: model,
        max_tokens: getMaxTokensForClaudeModel(model, config.max_tokens),
        messages: userMessages
    };

    // 添加 system prompt（如果有）
    if (systemPrompt) {
        body.system = systemPrompt;
    }

    // Claude 支持 temperature 参数
    if (config.temperature !== undefined) {
        body.temperature = config.temperature;
    } else {
        body.temperature = 0.3;
    }

    // 使用代理 URL 而不是直接调用 Claude API
    const endpoint = proxyUrl.replace(/\/$/, "");

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    // Claude 返回格式: { content: [{ type: "text", text: "..." }] }
    return data.content?.[0]?.text || "";
}

// ============= DeepSeek API调用 =============
// DeepSeek-V3.2 模型：deepseek-chat (非思考模式), deepseek-reasoner (思考模式)
const DEEPSEEK_THINKING_MODELS = ['deepseek-reasoner'];

function isDeepSeekThinkingModel(model) {
    return DEEPSEEK_THINKING_MODELS.some(m => model.startsWith(m));
}

async function callDeepSeekAPI(model, messages, config = {}, apiKey = null, signal = null) {
    if (!apiKey) {
        throw new Error("DeepSeek API Key not configured. Please add your API key in Settings.");
    }

    const body = {
        model: model,
        messages: messages
    };

    // 思考模式模型 (deepseek-reasoner) 不支持自定义 temperature
    if (!isDeepSeekThinkingModel(model)) {
        body.temperature = config.temperature || 0.3;
    }

    // 设置 max_tokens
    body.max_tokens = config.max_tokens || 4096;

    // 如果需要JSON响应
    if (config.jsonMode && !isDeepSeekThinkingModel(model)) {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch(DEEPSEEK_API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`DeepSeek API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

// ============= 批量翻译 =============
async function translateBulk(text, srcLang, tgtLang, config, signal = null) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const srcName = srcLang === 'zh' ? 'Chinese' : 'English';
    const tgtName = tgtLang === 'zh' ? 'Chinese' : 'English';

    const systemPrompt = `You are a professional academic translator. 
1. Split input into logical sentences/segments.
2. Translate ${srcName} to ${tgtName}.
3. Keep LaTeX math/citations intact.
4. You MUST return ONLY valid JSON: {"translations": [{"src": "Original 1", "tgt": "Translated 1"}]}
5. Do NOT include any text before or after the JSON.`;

    if (config.provider === 'local') {
        const response = await callLocalLLM(
            config.localBaseUrl,
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            false, // 不使用json_mode，让模型自由返回
            signal
        );
        return parseJsonResponse(response);
    }

    // OpenAI Path
    if (config.provider === 'openai') {
        const response = await callOpenAIAPI(
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            { jsonMode: true },
            config.openaiApiKey,
            signal
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        return parseJsonResponse(response);
    }

    // Claude Path
    if (config.provider === 'claude') {
        const response = await callClaudeAPI(
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            { temperature: 0.3 },
            config.claudeApiKey,
            signal,
            config.claudeProxyUrl
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        return parseJsonResponse(response);
    }

    // DeepSeek Path
    if (config.provider === 'deepseek') {
        const response = await callDeepSeekAPI(
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            { jsonMode: true },
            config.deepseekApiKey,
            signal
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        return parseJsonResponse(response);
    }

    // Gemini Path
    const responseSchema = {
        type: "OBJECT",
        properties: {
            translations: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        src: { type: "STRING" },
                        tgt: { type: "STRING" }
                    },
                    required: ["src", "tgt"]
                }
            }
        },
        required: ["translations"]
    };

    const response = await callGeminiAPI(config.model, text, {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema
    }, config.geminiApiKey, signal);

    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return JSON.parse(response || "{}");
}

// ============= 句子精炼 =============
async function refineSentence(text, lang, type, config, instruction = null, signal = null) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    let prompt = "";

    if (type === "grammar") {
        const baseInst = instruction || `${DEFAULT_GRAMMAR_PROMPT} (Language: ${lang === 'zh' ? 'Chinese' : 'English'})`;
        prompt = `${baseInst}

IMPORTANT RULES:
1. If there are grammar errors, return ONLY the corrected sentence.
2. If the text is already grammatically correct, return exactly: [NO_CHANGES]
3. Do NOT explain or describe what you did. Return ONLY the corrected text or [NO_CHANGES].

Text: "${text}"`;
    } else if (type === "simplify") {
        const baseInst = instruction || `${DEFAULT_SIMPLIFY_PROMPT} (Language: ${lang === 'zh' ? 'Chinese' : 'English'})
CRITICAL RULES:
1. Use common vocabulary.
2. STRICTLY PRESERVE all LaTeX math (e.g., $x_i$, \\xi_k), citations (e.g., [1]), and serial numbers (e.g., 1., (a)) exactly as they are.`;
        prompt = `${baseInst}\n3. Return ONLY the rewritten sentence.\nOriginal Text: "${text}"`;
    } else if (type === "custom") {
        prompt = `Rewrite the following ${lang === 'zh' ? 'Chinese' : 'English'} sentence based on this instruction: "${instruction}". Return ONLY the rewritten sentence.\n\nText: "${text}"`;
    }

    if (config.provider === 'local') {
        return await callLocalLLM(
            config.localBaseUrl,
            config.model,
            [{ role: "user", content: prompt }],
            false,
            signal
        );
    }

    // OpenAI Path
    if (config.provider === 'openai') {
        const response = await callOpenAIAPI(
            config.model,
            [{ role: "user", content: prompt }],
            { temperature: 0.3 },
            config.openaiApiKey,
            signal
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        return response?.trim() || text;
    }

    // Claude Path
    if (config.provider === 'claude') {
        const response = await callClaudeAPI(
            config.model,
            [{ role: "user", content: prompt }],
            { temperature: 0.3 },
            config.claudeApiKey,
            signal,
            config.claudeProxyUrl
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        return response?.trim() || text;
    }

    // DeepSeek Path
    if (config.provider === 'deepseek') {
        const response = await callDeepSeekAPI(
            config.model,
            [{ role: "user", content: prompt }],
            { temperature: 0.3 },
            config.deepseekApiKey,
            signal
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        return response?.trim() || text;
    }

    // Gemini Path
    const response = await callGeminiAPI(config.model, prompt, { temperature: 0.3 }, config.geminiApiKey, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return response?.trim() || text;
}

// ============= 智能更新 =============
async function getSmartUpdate(prompt, config, signal = null) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const systemPrompt = "You update translations intelligently. Return valid JSON only.";

    if (config.provider === 'local') {
        const response = await callLocalLLM(
            config.localBaseUrl,
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt + "\n\nRETURN JSON: {\"text\": \"...\"}" }
            ],
            false, // 不使用json_mode
            signal
        );
        try {
            const data = parseJsonResponse(response);
            return data.text || "";
        } catch (e) { return ""; }
    }

    // OpenAI Path
    if (config.provider === 'openai') {
        const response = await callOpenAIAPI(
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt + "\n\nRETURN JSON: {\"text\": \"...\"}" }
            ],
            { jsonMode: true },
            config.openaiApiKey,
            signal
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        try {
            const data = parseJsonResponse(response);
            return data.text || "";
        } catch (e) { return ""; }
    }

    // Claude Path
    if (config.provider === 'claude') {
        const response = await callClaudeAPI(
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt + "\n\nRETURN JSON: {\"text\": \"...\"}" }
            ],
            { temperature: 0.3 },
            config.claudeApiKey,
            signal,
            config.claudeProxyUrl
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        try {
            const data = parseJsonResponse(response);
            return data.text || "";
        } catch (e) { return ""; }
    }

    // DeepSeek Path
    if (config.provider === 'deepseek') {
        const response = await callDeepSeekAPI(
            config.model,
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt + "\n\nRETURN JSON: {\"text\": \"...\"}" }
            ],
            { jsonMode: true },
            config.deepseekApiKey,
            signal
        );
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        try {
            const data = parseJsonResponse(response);
            return data.text || "";
        } catch (e) { return ""; }
    }

    // Gemini Path
    const responseSchema = {
        type: "OBJECT",
        properties: {
            text: { type: "STRING" }
        },
        required: ["text"]
    };

    const response = await callGeminiAPI(config.model, prompt, {
        responseMimeType: "application/json",
        responseSchema: responseSchema
    }, config.geminiApiKey, signal);

    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const data = JSON.parse(response || "{}");
    return data.text || "";
}

// ============= 获取同义词 =============
async function getSynonyms(sentence, selectedText, lang, config, avoidList = []) {
    const avoidInstruction = avoidList.length > 0
        ? `IMPORTANT: Do NOT include any of the following words/phrases in your output: ${JSON.stringify(avoidList)}. Find DIFFERENT alternatives.`
        : "";

    const prompt = `Context Sentence: "${sentence}"
Selected Text: "${selectedText}"
Language: ${lang === 'zh' ? 'Chinese' : 'English'}

Task: Provide 4-5 distinct, academic-style alternatives for the "Selected Text".
1. If "Selected Text" is a single word, provide synonyms.
2. If "Selected Text" is a phrase or clause, provide rephrased versions that convey the SAME meaning and function within the context.
3. The alternatives must fit grammatically into the "Context Sentence" if substituted.
4. SORT your result list by Semantic Proximity (closest meaning first, then slightly more varied).
5. ${avoidInstruction}

Return JSON: { "alternatives": ["option1", "option2", "option3", "option4"] }`;

    if (config.provider === 'local') {
        const response = await callLocalLLM(
            config.localBaseUrl,
            config.model,
            [{ role: "user", content: prompt }],
            false // 不使用json_mode
        );
        try {
            const data = parseJsonResponse(response);
            return data.alternatives || [];
        } catch (e) { return []; }
    }

    // OpenAI Path
    if (config.provider === 'openai') {
        const response = await callOpenAIAPI(
            config.model,
            [{ role: "user", content: prompt }],
            { jsonMode: true },
            config.openaiApiKey
        );
        try {
            const data = parseJsonResponse(response);
            return data.alternatives || [];
        } catch (e) { return []; }
    }

    // Claude Path
    if (config.provider === 'claude') {
        const response = await callClaudeAPI(
            config.model,
            [{ role: "user", content: prompt }],
            { temperature: 0.3 },
            config.claudeApiKey,
            null,
            config.claudeProxyUrl
        );
        try {
            const data = parseJsonResponse(response);
            return data.alternatives || [];
        } catch (e) { return []; }
    }

    // DeepSeek Path
    if (config.provider === 'deepseek') {
        const response = await callDeepSeekAPI(
            config.model,
            [{ role: "user", content: prompt }],
            { jsonMode: true },
            config.deepseekApiKey
        );
        try {
            const data = parseJsonResponse(response);
            return data.alternatives || [];
        } catch (e) { return []; }
    }

    // Gemini Path
    const responseSchema = {
        type: "OBJECT",
        properties: {
            alternatives: {
                type: "ARRAY",
                items: { type: "STRING" }
            }
        },
        required: ["alternatives"]
    };

    const response = await callGeminiAPI(config.model, prompt, {
        responseMimeType: "application/json",
        responseSchema: responseSchema
    }, config.geminiApiKey);

    const data = JSON.parse(response || "{}");
    return data.alternatives || [];
}

// ============= 文本摘要 =============
async function summarizeText(text, config) {
    const prompt = `总结:\n${text}`;

    if (config.provider === 'local') {
        return await callLocalLLM(
            config.localBaseUrl,
            config.model,
            [{ role: "user", content: prompt }]
        );
    }

    // OpenAI Path
    if (config.provider === 'openai') {
        const response = await callOpenAIAPI(
            config.model,
            [{ role: "user", content: prompt }],
            {},
            config.openaiApiKey
        );
        return response || "";
    }

    // Claude Path
    if (config.provider === 'claude') {
        const response = await callClaudeAPI(
            config.model,
            [{ role: "user", content: prompt }],
            {},
            config.claudeApiKey,
            null,
            config.claudeProxyUrl
        );
        return response || "";
    }

    // DeepSeek Path
    if (config.provider === 'deepseek') {
        const response = await callDeepSeekAPI(
            config.model,
            [{ role: "user", content: prompt }],
            {},
            config.deepseekApiKey
        );
        return response || "";
    }

    // Gemini Path
    const response = await callGeminiAPI(config.model, prompt, {}, config.geminiApiKey);
    return response || "";
}
