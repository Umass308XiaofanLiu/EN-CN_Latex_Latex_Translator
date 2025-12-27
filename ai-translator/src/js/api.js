// ========================================
// api.js - API服务（Gemini、OpenAI和本地LLM）
// ========================================

// Gemini API端点
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// OpenAI API端点
const OPENAI_API_BASE = "https://api.openai.com/v1/chat/completions";

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
    let clean = text.trim();
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
async function callOpenAIAPI(model, messages, config = {}, apiKey = null, signal = null) {
    if (!apiKey) {
        throw new Error("OpenAI API Key not configured. Please add your API key in Settings.");
    }

    const body = {
        model: model,
        messages: messages,
        temperature: config.temperature || 0.3,
        max_tokens: config.max_tokens || 4096
    };

    // 如果需要JSON响应
    if (config.jsonMode) {
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
        prompt = `${baseInst} Return ONLY the corrected sentence, nothing else.\n\nText: "${text}"`;
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

    // Gemini Path
    const response = await callGeminiAPI(config.model, prompt, {}, config.geminiApiKey);
    return response || "";
}
