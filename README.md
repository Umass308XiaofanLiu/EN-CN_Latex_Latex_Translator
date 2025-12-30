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
  - OpenAI API (GPT-5 系列)
  - Anthropic Claude API (Claude 4.5 系列)
  - DeepSeek API (V3.2 系列)
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
2. 点击设置按钮，选择 AI 服务提供商：
   - **Gemini**: 输入 Google Gemini API Key
   - **OpenAI**: 输入 OpenAI API Key
   - **Claude**: 输入 Claude API Key 和代理 URL
   - **DeepSeek**: 输入 DeepSeek API Key
3. 粘贴需要翻译的学术文本
4. 点击 "TRANSLATE" 开始翻译

### 方法二：使用本地 LLM

1. 安装并运行 [LM Studio](https://lmstudio.ai/)
2. 在设置中选择 "Local LLM" 并配置服务器地址
3. 无需 API Key，完全本地运行

### 方法三：使用 Claude API

由于浏览器 CORS 限制，Claude API 需要通过代理访问：

1. 部署 Cloudflare Worker 代理（参考 Anthropic 文档）
2. 在设置中输入 Claude API Key 和代理 URL
3. 选择 Claude 模型开始使用

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
| Auto Segmentation | 自动分段开关：开启时逐句分段对照显示，关闭时整体翻译保持原排版 |
| Gemini API Key | Google Gemini 服务密钥 |
| OpenAI API Key | OpenAI 服务密钥 |
| Claude API Key | Anthropic Claude 服务密钥 |
| Claude Proxy URL | Cloudflare Worker 代理地址（用于绕过 CORS） |
| DeepSeek API Key | DeepSeek 服务密钥 |
| 本地服务器地址 | LM Studio 或其他兼容服务的 URL |
| 模型可见性 | 控制模型选择器中显示哪些模型 |
| 自动保存间隔 | 1-10 分钟 |
| 历史记录数量 | 5-20 条会话 |
| 自定义提示词 | 语法检查和简化的自定义指令 |

## 📋 支持的 AI 模型

### Google Gemini (云端)
- **Gemini 2.5 Flash Lite** - 快速且经济
- **Gemini 3 Flash Preview** - 速度与智能兼顾
- **Gemini 3 Pro Preview** - 最佳翻译质量

### OpenAI (云端)
- **GPT-5 Nano** - 轻量快速
- **GPT-5 Mini** - 性价比之选
- **GPT-5.2** - 完整能力
- **o1 / o3 系列** - 高级推理模型

### Anthropic Claude (云端)
- **Claude Haiku 4.5** - 快速响应
- **Claude Sonnet 4.5** - 平衡性能
- **Claude Opus 4.5** - 最强翻译能力

> 注意：Claude API 需要通过代理访问以绕过 CORS 限制

### DeepSeek (云端)
- **DeepSeek V3.2** - 非思考模式，快速响应
- **DeepSeek V3.2 Reasoner** - 思考模式，适合复杂推理翻译

> 获取 API Key：[DeepSeek Platform](https://platform.deepseek.com/api_keys)

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

## 📝 更新日志

### v1.3.0 (最新)
- 新增自动分段开关功能 (Auto Segmentation)
  - 开启：逐句分段对照显示（默认）
  - 关闭：整体翻译，保持原始段落排版
- 新增按钮反馈动画效果
  - 保存 API Key 时按钮显示 "Saved!" 成功提示
  - 复制文本时按钮显示绿色勾选动画
  - 连接本地服务器成功时显示 "Connected!" 提示
- 修复设置弹窗点击按钮后滚动位置重置问题

### v1.2.0
- 新增 DeepSeek API 支持 (V3.2 系列)
- 支持 DeepSeek V3.2 非思考模式 (deepseek-chat)
- 支持 DeepSeek V3.2 Reasoner 思考模式 (deepseek-reasoner)
- 新增 DeepSeek API Key 设置界面

### v1.1.0
- 新增 Anthropic Claude 模型支持 (Haiku 4.5, Sonnet 4.5, Opus 4.5)
- 新增 OpenAI 模型支持 (GPT-5 Nano, Mini, 5.2, o1/o3 系列)
- 新增 Claude API 代理支持解决 CORS 限制
- 新增模型可见性设置功能
- 新增独立设置按钮和设置弹窗
- 修复滚动位置跳动问题
- 修复语法检查按钮文本替换问题
- 优化编辑模式交互体验

### v1.0.0
- 初始版本发布
- 支持 Gemini API 和本地 LLM
- LaTeX 公式和学术引用保护
- 分段编辑和历史记录功能

---

**提示**: 为获得最佳翻译效果，建议使用 Gemini 3 Pro Preview、Claude Opus 4.5 或 DeepSeek V3.2 Reasoner 模型。
