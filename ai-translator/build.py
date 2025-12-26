#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Academic Translator Pro - 构建脚本
将多个模块化文件合并为单个可运行的HTML文件
"""

import os
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).parent
SRC_DIR = PROJECT_ROOT / "src"
DIST_DIR = PROJECT_ROOT / "dist"

def read_file(filepath):
    """读取文件内容"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def build():
    """构建单文件HTML"""
    print("🚀 开始构建 AI Academic Translator...")
    
    # 确保输出目录存在
    DIST_DIR.mkdir(exist_ok=True)
    
    # 读取各个模块
    html_template = read_file(SRC_DIR / "index.html")
    css_content = read_file(SRC_DIR / "css" / "style.css")
    js_state = read_file(SRC_DIR / "js" / "state.js")
    js_api = read_file(SRC_DIR / "js" / "api.js")
    js_translate = read_file(SRC_DIR / "js" / "translate.js")
    js_ui = read_file(SRC_DIR / "js" / "ui.js")
    
    print("  ✅ 读取所有模块文件")
    
    # 构建内联CSS
    css_block = f"""<style>
{css_content}
</style>"""
    
    # 构建内联JavaScript（按正确顺序）
    js_block = f"""<script>
// ==================== STATE.JS ====================
{js_state}

// ==================== API.JS ====================
{js_api}

// ==================== TRANSLATE.JS ====================
{js_translate}

// ==================== UI.JS ====================
{js_ui}
</script>"""
    
    # 替换占位符
    final_html = html_template
    final_html = final_html.replace("<!-- CUSTOM_CSS_PLACEHOLDER -->", css_block)
    final_html = final_html.replace("<!-- JS_PLACEHOLDER -->", js_block)
    
    print("  ✅ 合并所有模块")
    
    # 写入输出文件
    output_file = DIST_DIR / "AI-Translator.html"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    # 计算文件大小
    file_size = output_file.stat().st_size
    if file_size < 1024:
        size_str = f"{file_size} B"
    elif file_size < 1024 * 1024:
        size_str = f"{file_size / 1024:.1f} KB"
    else:
        size_str = f"{file_size / (1024*1024):.2f} MB"
    
    print(f"  ✅ 输出文件: {output_file}")
    print(f"  📦 文件大小: {size_str}")
    print("")
    print("🎉 构建完成！")
    print("   双击 dist/AI-Translator.html 即可在浏览器中运行")
    print("")
    print("⚠️  注意: 请在 api.js 中设置你的 GEMINI_API_KEY")
    
    return output_file

if __name__ == "__main__":
    build()
