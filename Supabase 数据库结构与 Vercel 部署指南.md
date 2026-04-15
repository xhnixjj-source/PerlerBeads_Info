# Supabase 数据库结构与 Vercel 部署指南

## 1. Supabase 数据库结构设计 (SQL)

在您的 Supabase 项目中，打开 SQL Editor 并运行以下脚本，以创建拼豆Directory网站所需的核心数据表和安全策略（RLS）：

```sql
-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 图纸库表 (Patterns)
CREATE TABLE public.patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    colors_required JSONB DEFAULT '[]'::jsonb,
    bead_count INTEGER,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 供应商表 (Suppliers)
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT, -- e.g., 'Yiwu, Zhejiang', 'Shantou, Guangdong'
    factory_type TEXT, -- e.g., 'Raw Material', 'Tools', 'Packaging'
    contact_info JSONB, -- { email: '', phone: '', website: '' }
    min_order_quantity TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 博主/创作者表 (Creators)
CREATE TABLE public.creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bio TEXT,
    platform TEXT, -- e.g., 'YouTube', 'TikTok', 'Xiaohongshu'
    social_links JSONB, -- { youtube: '', tiktok: '', instagram: '' }
    portfolio_images TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 开启行级安全策略 (Row Level Security - RLS)
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户(所有人)读取数据 (Public Read Access)
CREATE POLICY "Allow public read access on patterns" ON public.patterns FOR SELECT USING (true);
CREATE POLICY "Allow public read access on suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on creators" ON public.creators FOR SELECT USING (true);

-- 仅允许认证用户(管理员)插入/更新数据
CREATE POLICY "Allow authenticated users to insert patterns" ON public.patterns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update patterns" ON public.patterns FOR UPDATE TO authenticated USING (true);
```

## 2. 环境变量配置 (.env.local)

在本地开发时，在项目根目录创建 `.env.local` 文件，填入以下信息（不要提交到 GitHub）：

```env
# Supabase 配置 (从 Supabase Dashboard -> Project Settings -> API 获取)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Vertex AI 配置 (用于图纸SEO内容生成)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# Stripe 支付配置 (后续接入)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 3. Vercel 部署步骤

1.  **代码推送到 GitHub**：
    将您的 Next.js 项目推送到一个私有的 GitHub 仓库。

2.  **在 Vercel 导入项目**：
    *   登录 [Vercel](https://vercel.com/)。
    *   点击 "Add New Project"，选择您刚刚推送的 GitHub 仓库。

3.  **配置环境变量**：
    在 Vercel 的部署配置页面（Environment Variables 区域），将 `.env.local` 中的所有变量（除了 `GOOGLE_APPLICATION_CREDENTIALS` 的本地路径）逐一添加进去。

    *注意：对于 Google Vertex AI 的凭证，在 Vercel 等 Serverless 环境中，推荐将 JSON 凭证文件的内容转换为 Base64 字符串，或者直接使用 Google Cloud 的 Workload Identity Federation，而不是上传物理文件。*
    *在 Vercel 中，您可以设置一个名为 `GOOGLE_CREDENTIALS_JSON` 的环境变量，值为您的服务账号 JSON 内容，然后在代码中解析它。*

4.  **点击 Deploy**：
    Vercel 会自动识别 Next.js 框架，执行 `npm run build` 并部署您的网站。部署完成后，您将获得一个类似 `perler-directory.vercel.app` 的免费域名。

5.  **绑定自定义域名**：
    在 Vercel 项目的 Settings -> Domains 中，添加您购买的域名（如 `perlerhub.com`），并根据提示在您的域名注册商处配置 DNS 记录（通常是 CNAME 或 A 记录）。
