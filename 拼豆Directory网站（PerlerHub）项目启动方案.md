# 拼豆Directory网站（PerlerHub）项目启动方案

## 一、 技术架构选型
- **前端框架**：Next.js 14 (App Router) + React + Tailwind CSS
- **后端服务**：Next.js API Routes (Serverless)
- **数据库 & Auth**：Supabase (PostgreSQL + Auth + Storage)
- **AI 引擎**：Google Vertex AI (Gemini Pro 用于生成图纸描述、SEO内容，Imagen 用于生成拼豆图纸素材)
- **部署平台**：Vercel
- **支付网关**：Stripe (后续接入)
- **开发工具**：Cursor AI IDE

## 二、 核心数据模型 (Supabase Schema)
1. **Users (用户表)**：由 Supabase Auth 自动管理
2. **Patterns (图纸表)**：存储图纸信息、所需颜色、难度等
3. **Suppliers (供应商表)**：存储国内工厂、设备商信息
4. **Creators (博主表)**：存储国内外优质博主信息
5. **Categories (分类表)**：管理图纸和供应商的分类

## 三、 Vertex AI 集成场景
1. **图纸描述生成**：上传一张图片，Vertex AI 自动生成 SEO 友好的标题、描述、标签和难度评级。
2. **图纸像素化 (可选)**：利用 Vertex AI 处理图片，生成对应的拼豆像素网格（可通过调用 Python 脚本或第三方 API 实现）。
3. **内容翻译与本地化**：将国内博主的内容自动翻译并改写为适合欧美受众的英语内容。

## 四、 Cursor AI 启动步骤与 Prompt 模板

（后续部分将详细提供 Cursor 的提示词和启动脚本）
