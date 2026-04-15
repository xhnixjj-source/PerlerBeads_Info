# Cursor AI 项目启动与开发指南

为了让 Cursor AI 高效地为您生成高质量代码，请按照以下步骤和 Prompt（提示词）进行操作。

## 第一步：项目初始化（在 Cursor 终端中执行）

打开 Cursor，在终端（Terminal）中运行以下命令，初始化 Next.js 项目：

```bash
npx create-next-app@latest perler-directory
# 选项选择：
# TypeScript: Yes
# ESLint: Yes
# Tailwind CSS: Yes
# src/ directory: No (使用根目录 app)
# App Router: Yes
# import alias: Yes (@/*)

cd perler-directory
npm install @supabase/supabase-js @supabase/ssr lucide-react class-variance-authority clsx tailwind-merge @google-cloud/vertexai
```

## 第二步：配置 Supabase 客户端

在 Cursor 的 `Cmd+K` (或 `Ctrl+K`) 对话框中，输入以下 Prompt：

> **Prompt 1: Supabase 初始化**
> "Please create a Supabase client utility for a Next.js App Router project using `@supabase/ssr`. 
> 1. Create `utils/supabase/server.ts` for server-side operations.
> 2. Create `utils/supabase/client.ts` for client-side operations.
> 3. Create `utils/supabase/middleware.ts` for route protection.
> Make sure to handle environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` correctly."

## 第三步：构建数据库模式 (Supabase SQL)

在 Supabase 后台的 SQL Editor 中执行生成的 SQL。在 Cursor 中输入以下 Prompt 生成 SQL：

> **Prompt 2: Database Schema 设计**
> "Generate a complete PostgreSQL schema for a Perler Beads Directory website. We need the following tables with Row Level Security (RLS) enabled:
> 1. `patterns`: id, title, description, image_url, colors_required (jsonb), difficulty_level, created_at.
> 2. `suppliers`: id, name, location, factory_type (raw material, tools), contact_info, min_order_quantity, created_at.
> 3. `creators`: id, name, platform (youtube, tiktok, xiaohongshu), social_links (jsonb), portfolio_images (array), created_at.
> Please write the `CREATE TABLE` statements, setup basic RLS policies allowing public read access, and provide some sample `INSERT` data."

## 第四步：集成 Vertex AI

> **Prompt 3: Vertex AI 路由集成**
> "Create a Next.js API Route (`app/api/generate-seo/route.ts`) that uses the `@google-cloud/vertexai` SDK.
> The API should receive an image URL of a Perler Beads pattern and a brief description.
> It should call the Gemini Pro Vision model to generate:
> 1. An SEO-optimized title.
> 2. A detailed description suitable for a directory site.
> 3. Estimated difficulty level (Beginner, Intermediate, Advanced).
> 4. A list of likely required bead colors.
> Return the result as structured JSON."

## 第五步：生成核心页面组件

> **Prompt 4: 图纸展示列表页**
> "Create a Next.js responsive grid layout page (`app/patterns/page.tsx`) to display Perler Beads patterns.
> Fetch data from Supabase using the server client we created earlier.
> Each card should show the pattern image, title, difficulty badge, and a 'Buy Kit' button.
> Use Tailwind CSS for styling. Include a simple loading skeleton."

> **Prompt 5: 供应商名录页**
> "Create a Next.js page (`app/suppliers/page.tsx`) to list Chinese manufacturing suppliers for Perler Beads.
> Fetch the `suppliers` table from Supabase.
> Display them in a clean list or table format, showing their location, factory type, and MOQ.
> Add a 'Contact Supplier' button that opens a simple modal or email link."

## 开发最佳实践

1. **保持 Prompt 专注**：每次只让 Cursor 生成一个文件或一个功能，不要一次性让它写整个网站。
2. **利用 @ 引用**：在 Cursor 的聊天窗口中，使用 `@utils/supabase/server.ts` 引用已有文件，让 AI 了解上下文。
3. **样式库**：建议让 Cursor 引入 `shadcn/ui` 来快速构建按钮、卡片、表单等组件。
