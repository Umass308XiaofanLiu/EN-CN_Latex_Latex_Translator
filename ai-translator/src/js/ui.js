// ========================================
// ui.js - UI渲染和事件处理
// ========================================

// ============= SVG图标 (使用Lucide图标的SVG) =============
const Icons = {
    Languages: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
    ArrowRightLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`,
    Copy: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    Trash2: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    Loader2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    Sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    Lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    Cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    Zap: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    ZapFilled: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    ZapBig: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    PenLine: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>`,
    PenLineSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>`,
    Eye: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    RefreshCw: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
    CheckCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>`,
    Feather: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/></svg>`,
    MessageSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    Wand2: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>`,
    Undo2: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`,
    Redo2: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>`,
    ChevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    ChevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    ChevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    Rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    History: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
    Clock: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    Save: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>`,
    StopCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><rect width="6" height="6" x="9" y="9"/></svg>`,
    Octagon: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/></svg>`,
    Timer: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`,
    Settings2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`,
    MoreVertical: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
    Server: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
    Globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    AlertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    Plug: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>`,
    SparklesSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    XSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    ArrowRightLeftSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`,
    LoaderSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    LoaderLarge: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    LoaderMedium: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
};

// ============= 辅助函数 =============
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

// ============= 主渲染函数 =============
function renderApp() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="min-h-screen bg-slate-50 flex flex-col p-4 md:p-6 max-w-[1600px] mx-auto w-full">
            ${renderErrorBanner()}
            ${renderLocalSettingsModal()}
            ${renderSynonymPopup()}
            ${renderHeader()}
            ${renderMainWorkspace()}
            ${renderFooter()}
        </div>
    `;
    attachEventListeners();
    
    // 同义词弹窗独立渲染到 body（避免被 root 内容替换影响）
    renderSynonymPopupOnly();
}

// ============= 错误横幅 =============
function renderErrorBanner() {
    if (!AppState.error) return '';
    return `
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 max-w-lg">
            ${Icons.AlertCircle}
            <span class="text-xs font-medium">${escapeHtml(AppState.error)}</span>
            <button onclick="setState({error:null})" class="ml-2 hover:bg-rose-100 p-1 rounded-full">${Icons.XSmall}</button>
        </div>
    `;
}

// ============= 本地设置模态框 =============
function renderLocalSettingsModal() {
    if (!AppState.showLocalSettings) return '';
    return `
        <div class="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 class="text-sm font-bold text-slate-700 flex items-center gap-2">
                        ${Icons.Settings2} API Settings
                    </h3>
                    <button onclick="setState({showLocalSettings:false})" class="text-slate-400 hover:text-slate-600">${Icons.X}</button>
                </div>
                <div class="p-6 space-y-5">
                    <!-- Gemini API Key Section -->
                    <div class="pb-4 border-b border-slate-100">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <span class="text-xs font-bold text-slate-600 uppercase tracking-wide">Google Gemini API</span>
                        </div>
                        <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                            <input type="password" id="geminiApiKeyInput" class="flex-grow bg-transparent border-none text-xs focus:ring-0 p-0 ml-2 text-slate-700 outline-none font-mono" value="${escapeHtml(AppState.geminiApiKey)}" placeholder="AIzaSy...">
                            <button onclick="toggleApiKeyVisibility()" class="text-slate-400 hover:text-slate-600 ml-2" title="Toggle visibility">
                                ${Icons.Eye}
                            </button>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-2 px-1">
                            Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" class="text-indigo-500 hover:underline">Google AI Studio</a>
                        </p>
                        <button onclick="saveGeminiApiKey()" class="w-full mt-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                            ${Icons.Save} Save API Key
                        </button>
                    </div>
                    
                    <!-- Local Server Section -->
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                                ${Icons.Server}
                            </div>
                            <span class="text-xs font-bold text-slate-600 uppercase tracking-wide">Local LM Studio</span>
                        </div>
                        <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            ${Icons.Globe}
                            <input type="text" id="localUrlInput" class="flex-grow bg-transparent border-none text-xs focus:ring-0 p-0 ml-2 text-slate-700 outline-none" value="${escapeHtml(AppState.localBaseUrl)}" placeholder="http://localhost:1234">
                        </div>
                        <p class="text-[10px] text-slate-400 mt-2 px-1">Ensure your local server (e.g., LM Studio) is running and CORS is enabled.</p>
                        <button onclick="handleConnectLocalClick()" ${AppState.isConnectingLocal ? 'disabled' : ''} class="w-full mt-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            ${AppState.isConnectingLocal ? Icons.Loader2 : Icons.Plug}
                            ${AppState.isConnectingLocal ? 'Connecting...' : 'Connect & Fetch Models'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============= 同义词弹窗（现在由 renderSynonymPopupOnly 独立管理）=============
function renderSynonymPopup() {
    // 弹窗现在直接插入到 body，不在 root 内渲染
    return '';
}

// ============= 头部 =============
function renderHeader() {
    return `
        <header class="bg-white rounded-3xl shadow-sm border border-slate-200 mb-4 px-8 py-5 flex flex-wrap items-center justify-between gap-6 relative z-50">
            <div class="flex items-center gap-4">
                <div class="bg-gradient-to-br from-indigo-600 to-violet-700 p-3 rounded-2xl text-white shadow-xl shadow-indigo-100">
                    ${Icons.Languages}
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Academic AI</h1>
                    <p class="text-[11px] text-indigo-500 font-bold tracking-widest uppercase mt-1">LaTeX & Terminology Optimized</p>
                </div>
            </div>

            <div class="flex items-center gap-4">
                ${renderSaveButtonGroup()}
                ${renderHistoryMenu()}
                <div class="h-6 w-px bg-slate-200 mx-2"></div>
                ${renderModelSelector()}
                ${renderControlButtons()}
            </div>

            <div class="flex items-center gap-3">
                <button onclick="handleSummary()" ${AppState.translationPairs.length === 0 ? 'disabled' : ''} class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all font-semibold flex items-center gap-2 group disabled:opacity-50">
                    <span class="text-indigo-500 group-hover:animate-pulse">${Icons.Sparkles}</span> Insight
                </button>
                <div class="flex items-center">
                    <button onclick="handleTranslate()" ${!AppState.inputText && !AppState.isLoading ? 'disabled' : ''} class="px-10 py-2.5 rounded-l-2xl font-black text-sm tracking-wider transition-all shadow-xl active:scale-95 flex items-center gap-2 ${!AppState.inputText && !AppState.isLoading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : AppState.isLoading ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}">
                        ${AppState.isLoading ? `<span class="animate-pulse">${Icons.StopCircle}</span> STOP` : 'TRANSLATE'}
                    </button>
                    <button onclick="handleRegenerateAll()" ${AppState.translationPairs.length === 0 ? 'disabled' : ''} class="px-3 py-2.5 rounded-r-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center border-l ${AppState.translationPairs.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300' : AppState.isRegeneratingAll ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200 border-rose-400' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-200 border-indigo-400'}" title="重新生成所有翻译">
                        <span class="${AppState.isRegeneratingAll ? 'animate-spin' : ''}">${Icons.RefreshCw}</span>
                    </button>
                </div>
            </div>
        </header>
    `;
}

// ============= 保存按钮组 =============
function renderSaveButtonGroup() {
    return `
        <div class="relative flex items-center bg-slate-100 rounded-full border border-slate-200">
            <button onclick="handleManualSave()" ${AppState.translationPairs.length === 0 ? 'disabled' : ''} class="pl-3 pr-2 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-l-full transition-all disabled:opacity-30 flex items-center gap-1 border-r border-slate-200" title="Manual Save Session">
                ${Icons.Save}
            </button>
            <button onclick="toggleSaveMenu()" class="pl-1 pr-2 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-full transition-all" title="Auto-Save Settings">
                ${Icons.Timer}
            </button>
            ${AppState.showSaveMenu ? `
                <div class="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl p-3 z-[60]">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Auto-Save Interval</div>
                    <div class="space-y-1">
                        ${[1, 3, 5, 10].map(min => `
                            <button onclick="setAutoSaveInterval(${min * 60 * 1000})" class="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${AppState.autoSaveInterval === min * 60 * 1000 ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}">
                                ${min} Minutes
                            </button>
                        `).join('')}
                    </div>
                    <div class="border-t border-slate-100 mt-2 pt-2 px-1">
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-slate-500">Custom (min):</span>
                            <input type="number" id="customAutoSaveInput" min="1" class="w-12 text-xs p-1 border border-slate-200 rounded text-center bg-slate-50" placeholder="${Math.floor(AppState.autoSaveInterval / 60000)}">
                            <button onclick="applyCustomAutoSave()" class="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded transition-colors">OK</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ============= 历史菜单 =============
function renderHistoryMenu() {
    return `
        <div class="relative">
            <button onclick="toggleHistoryMenu()" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Global Session History">
                ${Icons.History}
            </button>
            ${AppState.showHistoryMenu ? `
                <div class="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-[70]">
                    <!-- History Settings Header -->
                    <div class="mb-4 pb-3 border-b border-slate-100">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            ${Icons.Settings2} History Settings
                        </div>
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-xs text-slate-600 font-medium">Keep Last:</span>
                            <div class="flex items-center bg-slate-100 rounded-lg p-0.5">
                                ${[5, 10, 20].map(limit => `
                                    <button onclick="setHistoryLimit(${limit})" class="px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${AppState.historyLimit === limit ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}">
                                        ${limit}
                                    </button>
                                `).join('')}
                                <div class="w-px h-3 bg-slate-200 mx-1"></div>
                                <input type="number" id="customHistoryLimitInput" min="1" value="${AppState.historyLimit}" class="w-8 bg-transparent text-[10px] font-bold text-center outline-none text-slate-600 border-none" onchange="setHistoryLimitCustom(this.value)">
                            </div>
                        </div>
                    </div>
                    
                    <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        ${Icons.Clock} Recent Sessions
                    </h4>
                    ${AppState.globalHistory.length === 0 ? `
                        <div class="text-center py-4 text-slate-300 text-xs italic">No history available yet.</div>
                    ` : `
                        <div class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                            ${AppState.globalHistory.map((item, idx) => `
                                <button onclick="restoreHistoryItem(${idx})" class="w-full text-left p-3 rounded-xl border transition-all group ${item.id === AppState.sessionId ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-100'}">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-[10px] font-bold ${item.id === AppState.sessionId ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}">
                                            ${new Date(item.timestamp).toLocaleTimeString()}${item.id === AppState.sessionId ? ' (Current)' : ''}
                                        </span>
                                        <span class="text-[9px] bg-slate-200 text-slate-500 px-1.5 rounded group-hover:bg-indigo-200 group-hover:text-indigo-700">
                                            ${item.pairs.length} segs
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        ${escapeHtml(item.pairs[0]?.src || 'Empty content')}
                                    </p>
                                </button>
                            `).join('')}
                        </div>
                    `}
                </div>
            ` : ''}
        </div>
    `;
}

// ============= 模型选择器 =============
function renderModelSelector() {
    const geminiModels = [
        { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', sub: 'Fast & Cheap', iconClass: 'text-emerald-500', icon: Icons.Rocket },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', sub: 'Speed + Intelligence', iconClass: 'text-orange-500', icon: Icons.Zap },
        { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', sub: 'Best Quality', iconClass: 'text-indigo-600', icon: Icons.Cpu }
    ];

    let currentIcon, currentIconClass, currentLabel;
    if (AppState.apiProvider === 'local') {
        currentIcon = Icons.Server;
        currentIconClass = 'text-indigo-600';
        currentLabel = AppState.selectedModel === 'local-model' ? 'Local LLM' : (AppState.selectedModel.length > 15 ? AppState.selectedModel.slice(0, 15) + '...' : AppState.selectedModel);
    } else if (AppState.selectedModel === 'gemini-2.5-flash-lite') {
        currentIcon = Icons.Rocket;
        currentIconClass = 'text-emerald-500';
        currentLabel = '2.5 Lite';
    } else if (AppState.selectedModel === 'gemini-3-flash-preview') {
        currentIcon = Icons.Zap;
        currentIconClass = 'text-orange-500';
        currentLabel = '3 Flash';
    } else {
        currentIcon = Icons.Cpu;
        currentIconClass = 'text-indigo-600';
        currentLabel = '3 Pro';
    }

    return `
        <div class="relative">
            <button onclick="toggleModelMenu()" class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-2xl border border-slate-200 transition-all text-xs font-bold text-slate-700 active:scale-95">
                <span class="${currentIconClass}">${currentIcon}</span>
                <span class="uppercase tracking-wider">${currentLabel}</span>
                <span class="transition-transform duration-200 ${AppState.showModelMenu ? 'rotate-180' : ''}">${Icons.ChevronDown}</span>
            </button>
            ${AppState.showModelMenu ? `
                <div class="absolute top-full mt-2 left-0 w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-[60]">
                    <div class="p-2 space-y-1 bg-slate-50/50 border-b border-slate-100">
                        <div class="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">Google Cloud (Gemini)</div>
                        ${geminiModels.map(m => `
                            <button onclick="selectModel('gemini','${m.id}')" class="w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${AppState.apiProvider === 'gemini' && AppState.selectedModel === m.id ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'hover:bg-white hover:shadow-sm text-slate-600'}">
                                <div class="flex flex-col items-start">
                                    <span class="text-xs font-bold uppercase tracking-wide">${m.name}</span>
                                    <span class="text-[9px] opacity-70">${m.sub}</span>
                                </div>
                                <span class="${m.iconClass}">${m.icon}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="p-2 bg-white">
                        <div class="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase flex items-center justify-between">
                            <span>Local / OpenAI</span>
                            ${Icons.Server}
                        </div>
                        ${AppState.localModels.length > 0 ? `
                            <div class="max-h-40 overflow-y-auto custom-scrollbar my-1">
                                ${AppState.localModels.map(lm => `
                                    <button onclick="selectModel('local','${escapeHtml(lm.id)}')" class="w-full flex items-center justify-between p-2 rounded-xl transition-all mb-1 ${AppState.apiProvider === 'local' && AppState.selectedModel === lm.id ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'hover:bg-slate-50 text-slate-600'}">
                                        <div class="flex flex-col items-start w-full overflow-hidden">
                                            <span class="text-xs font-bold truncate w-full text-left">${escapeHtml(lm.id)}</span>
                                        </div>
                                        ${AppState.apiProvider === 'local' && AppState.selectedModel === lm.id ? '<div class="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-2 shrink-0"></div>' : ''}
                                    </button>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="text-[10px] text-slate-400 italic text-center py-2 bg-slate-50 rounded-lg mb-2">No models fetched yet.</div>
                        `}
                        <button onclick="openLocalSettings()" class="w-full flex items-center justify-center gap-2 p-2 mt-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all border border-transparent hover:border-indigo-100">
                            ${Icons.Settings2} Configure Server
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ============= 控制按钮 =============
function renderControlButtons() {
    return `
        <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
            <button onclick="toggleAutoTranslate()" class="px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 transition-all ${AppState.isAutoTranslate ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}">
                ${AppState.isAutoTranslate ? Icons.ZapFilled : Icons.Zap} AUTO SYNC
            </button>
            <button onclick="toggleAutoDetect()" class="px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${AppState.isAutoDetect ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}">DETECT</button>
            <div class="h-4 w-px bg-slate-300 mx-1"></div>
            <button onclick="setLanguage('zh','en')" class="px-5 py-2 rounded-full text-xs font-bold transition-all ${AppState.sourceLang === 'zh' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-indigo-600'}">ZH</button>
            <button onclick="swapLanguages()" class="p-2 text-slate-400 hover:bg-white rounded-full transition-colors">${Icons.ArrowRightLeft}</button>
            <button onclick="setLanguage('en','zh')" class="px-5 py-2 rounded-full text-xs font-bold transition-all ${AppState.sourceLang === 'en' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-indigo-600'}">EN</button>
        </div>
    `;
}

// ============= 主工作区 =============
function renderMainWorkspace() {
    return `
        <main class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow relative overflow-hidden" style="height: calc(100vh - 220px);">
            ${renderSourcePanel()}
            ${renderTargetPanel()}
        </main>
    `;
}

// ============= 源面板 =============
function renderSourcePanel() {
    return `
        <section class="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative group">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    Source Panel
                    ${AppState.activeIndex !== null ? `<span class="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1.5 animate-pulse">${Icons.PenLineSmall} Editing</span>` : ''}
                </h3>
                <div class="flex items-center gap-3">
                    ${AppState.translationPairs.length > 0 ? `
                        <button onclick="copySourceText()" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Copy Source Text">
                            ${Icons.Copy}
                        </button>
                        <button onclick="toggleEditMode()" class="px-3 py-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all text-xs font-bold flex items-center gap-2">
                            ${AppState.isEditingMode ? `${Icons.Eye} Preview Mode` : `${Icons.PenLine} Text Edit`}
                        </button>
                    ` : ''}
                    <button onclick="handleClear()" class="text-slate-400 hover:text-rose-500 p-2 transition-colors">${Icons.Trash2}</button>
                </div>
            </div>
            <div class="flex-grow flex flex-col overflow-hidden bg-slate-50/20">
                ${AppState.translationPairs.length > 0 && !AppState.isEditingMode ? `
                    <div class="overflow-y-auto h-full custom-scrollbar p-4 space-y-2">
                        ${AppState.translationPairs.map((pair, idx) => renderPairRow('src', pair, idx)).join('')}
                    </div>
                ` : `
                    <textarea id="mainInput" class="w-full h-full p-10 text-xl border-none focus:ring-0 placeholder-slate-300 resize-none leading-relaxed custom-scrollbar bg-transparent focus:outline-none font-medium text-slate-700 selection:bg-indigo-100" placeholder="Paste or type academic text here...">${escapeHtml(AppState.inputText)}</textarea>
                `}
            </div>
        </section>
    `;
}

// ============= 目标面板 =============
function renderTargetPanel() {
    return `
        <section class="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative group">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Target Panel</h3>
                <button onclick="copyTargetText()" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors">${Icons.Copy}</button>
            </div>
            <div class="flex-grow p-4 overflow-y-auto custom-scrollbar bg-slate-50/20">
                ${AppState.isLoading && AppState.translationPairs.length === 0 ? `
                    <div class="h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                        <span class="text-indigo-300 mb-6">${Icons.LoaderLarge}</span>
                        <p class="font-black text-lg tracking-widest uppercase">Initializing Translation...</p>
                    </div>
                ` : AppState.translationPairs.length === 0 ? `
                    <div class="h-full flex flex-col items-center justify-center text-slate-300/40">
                        <div class="p-8 bg-slate-100 rounded-full mb-6">${Icons.ZapBig}</div>
                        <p class="text-xl font-black uppercase tracking-widest">Awaiting Input</p>
                    </div>
                ` : `
                    <div class="space-y-2 pb-24">
                        ${AppState.translationPairs.map((pair, idx) => renderPairRow('tgt', pair, idx)).join('')}
                    </div>
                `}
            </div>
            ${renderAiInsightDrawer()}
        </section>
    `;
}

// ============= AI Insight抽屉 =============
function renderAiInsightDrawer() {
    if (!AppState.aiInsight) return '';
    return `
        <div class="absolute inset-y-0 right-0 w-full md:w-[450px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
                <div class="flex items-center gap-3 text-indigo-800 font-black text-sm uppercase tracking-widest">
                    <span class="text-amber-500">${Icons.Lightbulb}</span>
                    ${escapeHtml(AppState.aiInsight.title)}
                </div>
                <button onclick="setState({aiInsight:null})" class="p-2 text-slate-400 hover:text-slate-900 transition-colors">${Icons.X}</button>
            </div>
            <div class="flex-grow p-8 overflow-y-auto custom-scrollbar bg-white">
                ${AppState.isInsightLoading ? `
                    <div class="flex flex-col items-center justify-center mt-20 gap-4">
                        <span class="text-indigo-500">${Icons.LoaderMedium}</span>
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Analysing semantic structure...</p>
                    </div>
                ` : `
                    <div class="prose prose-indigo prose-sm max-w-none text-slate-600 leading-relaxed">${renderFormattedText(AppState.aiInsight.content)}</div>
                `}
            </div>
        </div>
    `;
}

// ============= 翻译对行渲染 =============
function renderPairRow(side, pair, idx) {
    const isEditing = AppState.activeIndex === idx;
    const textValue = side === 'src' ? pair.src : pair.tgt;
    const editValue = side === 'src' ? AppState.editValues.src : AppState.editValues.tgt;

    if (isEditing) {
        return `
            <div class="group relative p-4 rounded-xl transition-all border cursor-pointer mb-2 bg-white border-indigo-300 shadow-xl ring-4 ring-indigo-50 z-20 scale-[1.01] my-4" data-idx="${idx}" data-side="${side}">
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                    ${renderHistoryControls(pair, idx)}
                </div>
                <div class="relative flex flex-col gap-3">
                    <div class="absolute -top-10 right-0 z-40 flex items-center gap-2">
                        <button onclick="event.stopPropagation();triggerSaveRowUpdate(${idx});" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-lg transition-all ${pair.isUpdating ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}" title="${pair.isUpdating ? '停止 AI 更新' : '保存并更新'}">
                            ${pair.isUpdating ? `<span class="animate-pulse">${Icons.Octagon}</span> Stop` : `${Icons.PenLineSmall} Update`}
                        </button>
                        <button onclick="event.stopPropagation();handleRegenerateTranslation(${idx});" class="flex items-center justify-center p-1.5 rounded-lg text-white shadow-lg transition-all ${pair.isRegenerating ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'}" title="${pair.isRegenerating ? '停止重新生成' : '重新生成此翻译'}">
                            <span class="${pair.isRegenerating ? 'animate-spin' : ''}">${Icons.RefreshCw}</span>
                        </button>
                    </div>
                    <textarea id="editTextarea_${side}_${idx}" class="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 leading-relaxed resize-none overflow-hidden min-h-[40px]" placeholder="Edit ${side === 'src' ? 'source' : 'target'}..." onclick="event.stopPropagation();">${escapeHtml(editValue)}</textarea>
                    ${renderAiToolbar(side, idx)}
                </div>
            </div>
        `;
    } else {
        return `
            <div class="group relative p-4 rounded-xl transition-all border cursor-pointer mb-2 border-transparent hover:bg-white/80 hover:shadow-md" onclick="handleRowClick(${idx})" data-idx="${idx}" data-side="${side}">
                <div class="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed transition-all ${pair.isUpdating ? 'opacity-30 blur-[2px]' : ''}">${renderFormattedText(textValue)}</div>
            </div>
        `;
    }
}

// ============= 历史控制按钮 =============
function renderHistoryControls(pair, idx) {
    return `
        <div class="flex gap-1 bg-white shadow-sm border border-slate-200 rounded-full p-0.5 z-20 transition-all">
            <button onclick="event.stopPropagation();handleHistoryNav(${idx},-1);" ${pair.historyIndex <= 0 ? 'disabled' : ''} class="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 text-slate-600 transition-colors" title="Undo Change">
                ${Icons.Undo2}
            </button>
            <span class="text-[9px] px-1 text-slate-400 font-mono flex items-center select-none">
                ${pair.historyIndex + 1}/${pair.history.length}
            </span>
            <button onclick="event.stopPropagation();handleHistoryNav(${idx},1);" ${pair.historyIndex >= pair.history.length - 1 ? 'disabled' : ''} class="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 text-slate-600 transition-colors" title="Redo Change">
                ${Icons.Redo2}
            </button>
        </div>
    `;
}

// ============= AI工具栏 =============
function renderAiToolbar(side, idx) {
    const isGrammarSettingsOpen = AppState.activeSettingsPopup === 'grammar' && AppState.activeSettingsIndex === idx && AppState.activeSettingsSide === side;
    const isSimplifySettingsOpen = AppState.activeSettingsPopup === 'simplify' && AppState.activeSettingsIndex === idx && AppState.activeSettingsSide === side;

    return `
        <div class="mt-2 pt-2 border-t border-indigo-50 flex flex-wrap items-center gap-2 relative" onclick="event.stopPropagation();">
            <div class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mr-1 flex items-center gap-1 select-none">
                ${Icons.SparklesSmall} ${side === 'src' ? 'Source AI' : 'Target AI'}
            </div>

            <!-- Grammar Button Group -->
            <div class="flex items-stretch rounded-lg bg-indigo-50 border border-indigo-100 relative">
                <button onclick="handleAiRefine(${idx},'${side}','grammar')" ${AppState.isRefining ? 'disabled' : ''} class="flex items-center gap-1.5 px-2 py-1 hover:bg-indigo-100 text-indigo-700 rounded-l-lg text-xs transition-colors disabled:opacity-50">
                    ${Icons.CheckCheck} Grammar
                </button>
                <div class="w-px bg-indigo-200 my-1"></div>
                <button onclick="toggleSettingsPopup('grammar',${idx},'${side}')" class="px-1 hover:bg-indigo-200 text-indigo-400 hover:text-indigo-700 rounded-r-lg transition-colors">
                    ${Icons.MoreVertical}
                </button>
                ${isGrammarSettingsOpen ? renderSettingsPopover('grammar') : ''}
            </div>

            <!-- Simplify Button Group -->
            <div class="flex items-stretch rounded-lg bg-emerald-50 border border-emerald-100 relative">
                <button onclick="handleAiRefine(${idx},'${side}','simplify')" ${AppState.isRefining ? 'disabled' : ''} class="flex items-center gap-1.5 px-2 py-1 hover:bg-emerald-100 text-emerald-700 rounded-l-lg text-xs transition-colors disabled:opacity-50">
                    ${Icons.Feather} Simplify
                </button>
                <div class="w-px bg-emerald-200 my-1"></div>
                <button onclick="toggleSettingsPopup('simplify',${idx},'${side}')" class="px-1 hover:bg-emerald-200 text-emerald-400 hover:text-emerald-700 rounded-r-lg transition-colors">
                    ${Icons.MoreVertical}
                </button>
                ${isSimplifySettingsOpen ? renderSettingsPopover('simplify') : ''}
            </div>

            <!-- Custom Rewrite Input -->
            <div class="flex-grow flex items-center gap-2 bg-indigo-50/50 rounded border border-indigo-100 px-2 py-0.5 focus-within:ring-1 focus-within:ring-indigo-200 transition-all">
                <span class="text-indigo-300">${Icons.MessageSquare}</span>
                <input type="text" id="refineInput_${side}_${idx}" class="bg-transparent border-none text-xs w-full focus:ring-0 p-0 text-slate-700 placeholder-indigo-200" placeholder="${side === 'src' ? 'e.g. Make it formal...' : 'e.g. More concise...'}" value="${escapeHtml(AppState.refinePrompt)}">
                <button onclick="triggerCustomRefine(${idx},'${side}')" ${AppState.isRefining || !AppState.refinePrompt.trim() ? 'disabled' : ''} class="text-indigo-600 hover:text-indigo-800 disabled:opacity-30 transition-colors">
                    ${AppState.isRefining ? Icons.LoaderSmall : Icons.Wand2}
                </button>
            </div>
        </div>
    `;
}

// ============= 设置弹窗渲染 =============
function renderSettingsPopover(type) {
    const currentPrompt = AppState.customPrompts[type] || '';
    const defaultPrompt = type === 'grammar' ? DEFAULT_GRAMMAR_PROMPT : DEFAULT_SIMPLIFY_PROMPT;
    const isUsingCustom = currentPrompt.trim().length > 0;
    const colorClass = type === 'grammar' ? 'indigo' : 'emerald';
    
    return `
        <div class="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-50" onclick="event.stopPropagation();">
            <div class="flex items-center justify-between gap-2 text-xs font-bold text-slate-700 mb-2 border-b border-slate-100 pb-2">
                <span class="flex items-center gap-2">
                    ${Icons.Settings2} Customize ${type === 'grammar' ? 'Grammar' : 'Simplify'} Prompt
                </span>
                <button onclick="closeSettingsPopup()" class="text-slate-400 hover:text-slate-600">${Icons.XSmall}</button>
            </div>
            <div>
                <textarea 
                    id="customPromptTextarea_${type}"
                    class="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-${colorClass}-500 outline-none resize-none"
                    rows="4"
                    placeholder="${escapeHtml(defaultPrompt)}"
                    onclick="event.stopPropagation();"
                >${escapeHtml(currentPrompt)}</textarea>
                <div class="mt-2 flex items-center justify-between">
                    <span class="text-[9px] text-slate-400 italic">
                        ${isUsingCustom ? 'Using custom prompt' : 'Using default prompt'}
                    </span>
                    <div class="flex items-center gap-2">
                        <button onclick="resetPromptToDefault('${type}')" class="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                            Reset
                        </button>
                        <button onclick="saveCustomPrompt('${type}')" class="px-2 py-1 text-[10px] font-bold text-white bg-${colorClass}-600 hover:bg-${colorClass}-700 rounded transition-colors">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============= 页脚 =============
function renderFooter() {
    let statusText, statusDotClass;
    if (AppState.apiProvider === 'local') {
        statusText = 'LOCAL SERVER CONNECTED';
        statusDotClass = 'bg-indigo-600 shadow-indigo-200';
    } else if (AppState.selectedModel === 'gemini-flash-lite-latest') {
        statusText = 'ULTRA FAST LITE MODE';
        statusDotClass = 'bg-emerald-500 shadow-emerald-200';
    } else if (AppState.selectedModel === 'gemini-3-flash-preview') {
        statusText = 'FAST MODE ENABLED';
        statusDotClass = 'bg-emerald-500 shadow-emerald-200';
    } else {
        statusText = 'PRO QUALITY ACTIVE';
        statusDotClass = 'bg-emerald-500 shadow-emerald-200';
    }

    return `
        <footer class="mt-4 flex items-center justify-between px-4 text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] border-t border-slate-200 pt-4">
            <div class="flex gap-6 items-center">
                <span class="flex items-center gap-2 text-indigo-500 font-black">
                    ${AppState.apiProvider === 'local' ? Icons.Server : Icons.Cpu}
                    ENGINE: <span class="text-slate-600 truncate max-w-[150px]">${AppState.apiProvider === 'local' ? escapeHtml(AppState.selectedModel) : AppState.selectedModel.toUpperCase()}</span>
                </span>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full animate-pulse shadow-lg ${statusDotClass}"></span>
                    ${statusText}
                </div>
            </div>
            <div class="hidden sm:block">Select text to find academic synonyms • Incremental AI Refine enabled</div>
        </footer>
    `;
}

// ============= 事件绑定 =============
function attachEventListeners() {
    // 主输入框
    const mainInput = document.getElementById('mainInput');
    if (mainInput) {
        mainInput.addEventListener('input', (e) => handleInputChange(e.target.value));
    }

    // 编辑文本框
    AppState.translationPairs.forEach((pair, idx) => {
        ['src', 'tgt'].forEach(side => {
            const textarea = document.getElementById(`editTextarea_${side}_${idx}`);
            if (textarea) {
                textarea.addEventListener('input', (e) => {
                    // 只更新状态值，不触发重新渲染
                    AppState.editValues[side] = e.target.value;
                    
                    // 关闭同义词弹窗但不重新渲染整个页面
                    if (AppState.synonymState.show) {
                        AppState.synonymState.show = false;
                        const popup = document.getElementById('synonymPopup');
                        if (popup) popup.remove();
                    }
                    
                    autoResizeTextarea(textarea);
                });
                textarea.addEventListener('mouseup', (e) => handleTextSelect(e, side, idx));
                autoResizeTextarea(textarea);
            }

            const refineInput = document.getElementById(`refineInput_${side}_${idx}`);
            if (refineInput) {
                refineInput.addEventListener('input', (e) => {
                    // 只更新状态，不触发渲染
                    AppState.refinePrompt = e.target.value;
                });
                refineInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        triggerCustomRefine(idx, side);
                    }
                });
            }
        });
    });

    // 全局点击（关闭菜单）
    document.removeEventListener('mousedown', globalClickHandler);
    document.addEventListener('mousedown', globalClickHandler);
}

function globalClickHandler(event) {
    const target = event.target;
    
    // 关闭同义词弹窗
    const synonymPopup = document.getElementById('synonymPopup');
    if (synonymPopup && !synonymPopup.contains(target)) {
        updateSynonymState({ show: false });
    }
    
    // 关闭设置弹窗（如果点击在弹窗外部）
    if (AppState.activeSettingsPopup !== null) {
        const popover = target.closest('.absolute.top-full');
        const settingsButton = target.closest('[onclick*="toggleSettingsPopup"]');
        if (!popover && !settingsButton) {
            closeSettingsPopup();
        }
    }
    
    // 关闭各种菜单
    if (AppState.showModelMenu && !target.closest('[onclick*="toggleModelMenu"]') && !target.closest('.absolute')) {
        AppState.showModelMenu = false;
        renderApp();
    }
    if (AppState.showHistoryMenu && !target.closest('[onclick*="toggleHistoryMenu"]') && !target.closest('.absolute')) {
        AppState.showHistoryMenu = false;
        renderApp();
    }
    if (AppState.showSaveMenu && !target.closest('[onclick*="toggleSaveMenu"]') && !target.closest('.absolute')) {
        AppState.showSaveMenu = false;
        renderApp();
    }
}

function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// ============= 辅助UI函数 =============
function copySourceText() {
    const text = AppState.translationPairs.map(p => p.src).join('\n');
    copyToClipboard(text);
}

function copyTargetText() {
    const text = AppState.translationPairs.map(p => p.tgt).join('\n');
    copyToClipboard(text);
}

function saveGeminiApiKey() {
    const input = document.getElementById('geminiApiKeyInput');
    if (input) {
        AppState.geminiApiKey = input.value.trim();
        // 保存到localStorage
        try {
            localStorage.setItem('geminiApiKey', AppState.geminiApiKey);
        } catch (e) {}
        setState({ showLocalSettings: false });
    }
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('geminiApiKeyInput');
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function toggleSaveMenu() {
    AppState.showSaveMenu = !AppState.showSaveMenu;
    AppState.showModelMenu = false;
    AppState.showHistoryMenu = false;
    renderApp();
}

function toggleHistoryMenu() {
    AppState.showHistoryMenu = !AppState.showHistoryMenu;
    AppState.showModelMenu = false;
    AppState.showSaveMenu = false;
    renderApp();
}

function toggleModelMenu() {
    AppState.showModelMenu = !AppState.showModelMenu;
    AppState.showHistoryMenu = false;
    AppState.showSaveMenu = false;
    renderApp();
}

function toggleAutoTranslate() {
    AppState.isAutoTranslate = !AppState.isAutoTranslate;
    renderApp();
}

function toggleAutoDetect() {
    AppState.isAutoDetect = !AppState.isAutoDetect;
    renderApp();
}

function setAutoSaveInterval(ms) {
    AppState.autoSaveInterval = ms;
    AppState.showSaveMenu = false;
    // 保存到 localStorage
    try {
        localStorage.setItem('autoSaveInterval', ms.toString());
    } catch (e) {}
    renderApp();
}

function restoreHistoryItem(idx) {
    restoreGlobalHistory(AppState.globalHistory[idx]);
}

function selectModel(provider, modelId) {
    AppState.apiProvider = provider;
    AppState.selectedModel = modelId;
    AppState.showModelMenu = false;
    
    // 保存到 localStorage
    try {
        localStorage.setItem('apiProvider', provider);
        localStorage.setItem('selectedModel', modelId);
    } catch (e) {}
    
    renderApp();
}

function openLocalSettings() {
    AppState.showLocalSettings = true;
    AppState.showModelMenu = false;
    renderApp();
}

function handleConnectLocalClick() {
    const input = document.getElementById('localUrlInput');
    if (input) {
        AppState.localBaseUrl = input.value;
        // 保存到 localStorage
        try {
            localStorage.setItem('localBaseUrl', AppState.localBaseUrl);
        } catch (e) {}
    }
    handleConnectLocal();
}

function setLanguage(src, tgt) {
    AppState.sourceLang = src;
    AppState.targetLang = tgt;
    AppState.isAutoDetect = false;
    renderApp();
}

function swapLanguages() {
    const temp = AppState.sourceLang;
    AppState.sourceLang = AppState.targetLang;
    AppState.targetLang = temp;
    AppState.isAutoDetect = false;
    renderApp();
}

function triggerCustomRefine(idx, side) {
    if (AppState.refinePrompt.trim()) {
        handleAiRefine(idx, side, 'custom');
    }
}

function triggerSaveRowUpdate(idx) {
    saveRowUpdate(idx, AppState.editValues);
}

// ============= 设置弹窗控制 =============
function toggleSettingsPopup(type, idx, side) {
    if (AppState.activeSettingsPopup === type && AppState.activeSettingsIndex === idx && AppState.activeSettingsSide === side) {
        closeSettingsPopup();
    } else {
        AppState.activeSettingsPopup = type;
        AppState.activeSettingsIndex = idx;
        AppState.activeSettingsSide = side;
        renderApp();
    }
}

function closeSettingsPopup() {
    AppState.activeSettingsPopup = null;
    AppState.activeSettingsIndex = null;
    AppState.activeSettingsSide = null;
    renderApp();
}

function saveCustomPrompt(type) {
    const textarea = document.getElementById(`customPromptTextarea_${type}`);
    if (textarea) {
        AppState.customPrompts[type] = textarea.value.trim();
        // 保存到 localStorage
        try {
            localStorage.setItem('customPrompts', JSON.stringify(AppState.customPrompts));
        } catch (e) {}
    }
    closeSettingsPopup();
}

function resetPromptToDefault(type) {
    AppState.customPrompts[type] = '';
    // 更新 localStorage
    try {
        localStorage.setItem('customPrompts', JSON.stringify(AppState.customPrompts));
    } catch (e) {}
    renderApp();
}

// ============= History Limit 设置 =============
function setHistoryLimit(limit) {
    AppState.historyLimit = limit;
    // 裁剪历史记录
    if (AppState.globalHistory.length > limit) {
        AppState.globalHistory = AppState.globalHistory.slice(0, limit);
    }
    // 保存到 localStorage
    try {
        localStorage.setItem('historyLimit', limit.toString());
    } catch (e) {}
    renderApp();
}

function setHistoryLimitCustom(value) {
    const limit = Math.max(1, parseInt(value) || 5);
    setHistoryLimit(limit);
}

// ============= Auto-Save 自定义设置 =============
function applyCustomAutoSave() {
    const input = document.getElementById('customAutoSaveInput');
    if (input) {
        const val = parseInt(input.value);
        if (val > 0) {
            setAutoSaveInterval(val * 60 * 1000);
        }
    }
}

// ============= 初始化 =============
document.addEventListener('DOMContentLoaded', function() {
    // 加载保存的设置
    loadSavedSettings();
    
    renderApp();

    // 自动保存定时器
    setInterval(function() {
        if (AppState.autoSaveInterval > 0 && AppState.translationPairs.length > 0) {
            addToGlobalHistory(AppState.translationPairs, AppState.sessionId);
        }
    }, AppState.autoSaveInterval);

    // 自动翻译防抖（在handleInputChange中处理）
});

// 加载所有保存的设置
function loadSavedSettings() {
    try {
        // 加载 Gemini API Key
        const savedKey = localStorage.getItem('geminiApiKey');
        if (savedKey) {
            AppState.geminiApiKey = savedKey;
        }
        
        // 加载 Local Base URL
        const savedLocalUrl = localStorage.getItem('localBaseUrl');
        if (savedLocalUrl) {
            AppState.localBaseUrl = savedLocalUrl;
        }
        
        // 加载 History Limit
        const savedHistoryLimit = localStorage.getItem('historyLimit');
        if (savedHistoryLimit) {
            AppState.historyLimit = parseInt(savedHistoryLimit) || 5;
        }
        
        // 加载 Auto-Save Interval
        const savedAutoSaveInterval = localStorage.getItem('autoSaveInterval');
        if (savedAutoSaveInterval) {
            AppState.autoSaveInterval = parseInt(savedAutoSaveInterval) || 5 * 60 * 1000;
        }
        
        // 加载 Custom Prompts
        const savedCustomPrompts = localStorage.getItem('customPrompts');
        if (savedCustomPrompts) {
            try {
                const parsed = JSON.parse(savedCustomPrompts);
                AppState.customPrompts = { ...AppState.customPrompts, ...parsed };
            } catch (e) {}
        }
        
        // 加载上次使用的 API Provider 和模型
        const savedApiProvider = localStorage.getItem('apiProvider');
        const savedSelectedModel = localStorage.getItem('selectedModel');
        if (savedApiProvider) {
            AppState.apiProvider = savedApiProvider;
        }
        if (savedSelectedModel) {
            AppState.selectedModel = savedSelectedModel;
        }
        
        // 只要有保存的本地地址，就自动尝试连接（获取模型列表）
        if (savedLocalUrl) {
            autoConnectLocal();
        }
    } catch (e) {
        console.warn('Failed to load saved settings:', e);
    }
}

// 自动连接本地 LM Studio（获取模型列表，失败时显示错误提示）
async function autoConnectLocal() {
    try {
        const models = await fetchLocalModels(AppState.localBaseUrl);
        AppState.localModels = models;
        
        // 如果上次使用的是本地模型，检查是否仍然可用
        if (AppState.apiProvider === 'local') {
            const savedModel = localStorage.getItem('selectedModel');
            if (savedModel && models.some(m => m.id === savedModel)) {
                AppState.selectedModel = savedModel;
            } else if (models.length > 0) {
                AppState.selectedModel = models[0].id;
            }
        }
        
        console.log('Auto-connected to local LM Studio:', AppState.localBaseUrl, 'Models:', models.length);
        renderApp();
    } catch (e) {
        // 显示错误提示
        console.warn('Auto-connect to local LM Studio failed:', e.message);
        AppState.localModels = [];
        
        // 如果上次使用的是本地模型但现在连接失败，回退到 Gemini
        if (AppState.apiProvider === 'local') {
            AppState.apiProvider = 'gemini';
            AppState.selectedModel = 'gemini-2.5-flash-lite';
        }
        
        // 显示顶部错误提示
        setState({ error: `无法连接到本地服务器 ${AppState.localBaseUrl}。请确保 LM Studio 正在运行。` });
    }
}
