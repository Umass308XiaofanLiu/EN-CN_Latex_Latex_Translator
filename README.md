# AI Academic Translator Pro

一个基于浏览器的智能学术翻译工具，专为中英文学术文档翻译设计，完美保留 LaTeX 数学公式、学术引用和专业术语。

## ✨ 功能特点

### 核心翻译功能
- **智能中英互译** - 自动检测语言，支持中英双向翻译
- **LaTeX 公式保留** - 自动识别并保留 `$...$`、`$$...$$`、`\[...\]`、`\(...\)` 等数学公式
- **学术引用保护** - 保持 `[1]`、`[Smith2020]` 等引用格式不变
- **Markdown 支持** - 完整渲染 Markdown 格式内容

### AI 增强功能
- **语法检查与优化** - 自定义提示词进行文本润色
- **文本简化** - 使内容更加简洁直接
- **智能同义词** - 基于上下文的词汇替换建议
- **学术摘要** - 自动生成翻译内容的学术总结

### 编辑功能
- **分段编辑** - 可单独编辑每个翻译段落
- **智能同步** - 修改源文本时自动更新译文
- **历史记录** - 每个段落支持撤销/重做操作
- **会话管理** - 保存和恢复多个翻译会话

## 🛠 技术栈

- **前端框架**: 原生 JavaScript + Tailwind CSS
- **数学渲染**: KaTeX v0.16.9
- **Markdown 解析**: Marked.js
- **AI 服务**:
  - Google Gemini API (推荐)
  - 本地 LLM (OpenAI 兼容接口)

## 📦 项目结构

```
ai-translator/
├── build.py                  # Python 构建脚本
├── src/                      # 源代码目录
│   ├── index.html           # HTML 模板
│   ├── css/
│   │   └── style.css        # 自定义样式
│   └── js/
│       ├── state.js         # 全局状态管理
│       ├── api.js           # API 服务层
│       ├── translate.js     # 翻译核心逻辑
│       └── ui.js            # UI 渲染组件
└── dist/
    └── AI-Translator.html   # 构建后的单文件应用
```

## 🚀 快速开始

### 方法一：直接使用（推荐）

1. 双击打开 `dist/AI-Translator.html` 文件
2. 点击设置按钮，输入你的 Google Gemini API Key
3. 粘贴需要翻译的学术文本
4. 点击 "TRANSLATE" 开始翻译

### 方法二：使用本地 LLM

1. 安装并运行 [LM Studio](https://lmstudio.ai/)
2. 在设置中选择 "Local LLM" 并配置服务器地址
3. 无需 API Key，完全本地运行

## 🔧 构建项目

如果你修改了源代码，需要重新构建：

```bash
python build.py
```

这将把所有模块合并为 `dist/AI-Translator.html` 单文件应用。

## ⚙️ 配置选项

在设置面板中可配置：

| 选项 | 说明 |
|------|------|
| Gemini API Key | Google Gemini 服务密钥 |
| 本地服务器地址 | LM Studio 或其他兼容服务的 URL |
| 模型选择 | Gemini 2.5 Flash Lite / 3 Flash / 3 Pro |
| 自动保存间隔 | 1-10 分钟 |
| 历史记录数量 | 5-20 条会话 |
| 自定义提示词 | 语法检查和简化的自定义指令 |

## 📋 支持的 AI 模型

### Google Gemini (云端)
- **Gemini 2.5 Flash Lite** - 快速且经济
- **Gemini 3 Flash Preview** - 速度与智能兼顾
- **Gemini 3 Pro Preview** - 最佳翻译质量

### 本地 LLM (离线)
- 支持任何 OpenAI 兼容接口
- 如 Llama、Mistral、Qwen 等本地模型
- 自动发现可用模型

## 🎯 使用场景

- 学术论文翻译
- 科技文档本地化
- 数学/物理/计算机等含公式文档翻译
- 双语对照文档制作

## 📄 许可证

本项目采用 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**提示**: 为获得最佳翻译效果，建议使用 Gemini 3 Pro Preview 模型。
