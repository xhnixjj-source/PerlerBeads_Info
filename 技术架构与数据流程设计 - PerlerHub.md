# 技术架构与数据流程设计 - PerlerHub

**文档版本**：v1.0

本文档详细说明了 PerlerHub 项目的技术选型、系统架构、数据模型以及核心业务的数据流转过程。

---

## 一、 系统架构概览 (System Architecture)

本系统采用现代化的 Serverless 架构，以保证高可用性、全球访问速度以及极低的初期运维成本。

### 1.1 核心技术栈
*   **前端展示层 (Frontend)**：Next.js 14 (App Router)
    *   利用 Server Components 实现极速首屏加载和完美的 SEO。
    *   使用 Tailwind CSS 进行响应式样式开发。
*   **后端逻辑层 (Backend)**：Next.js API Routes (Serverless Functions)
    *   处理表单提交、支付回调、AI 接口调用等。
*   **数据与存储层 (Database & Storage)**：Supabase
    *   **PostgreSQL**：关系型数据库，存储图纸、供应商、用户等结构化数据。
    *   **Supabase Storage**：对象存储，存放海量图纸图片、工厂实拍视频。
    *   **Supabase Auth**：处理用户注册、登录（支持 Google/GitHub 第三方登录）。
*   **AI 处理引擎 (AI Engine)**：Google Vertex AI (Gemini Pro Vision)
    *   用于自动化图纸内容生成、多语言翻译。
*   **支付网关 (Payment Gateway)**：Stripe
    *   处理 C 端零售订单的信用卡收款。
*   **部署与分发 (Deployment & CDN)**：Vercel
    *   自动化 CI/CD 管道，全球边缘节点加速。

### 1.2 架构图 (Architecture Diagram)

```text
[ 客户端 (Browser / Mobile) ]
       |
       | (HTTPS / Vercel Edge Network)
       v
[ Next.js 应用 (Vercel) ]
  |-- App Router (Pages & UI)
  |-- API Routes (Serverless Backend)
       |
       |--- (REST / SDK) ---> [ Stripe ] (支付处理)
       |
       |--- (REST / SDK) ---> [ Google Vertex AI ] (图纸识别与SEO生成)
       |
       |--- (PostgREST / SDK)
       v
[ Supabase 平台 ]
  |-- PostgreSQL (结构化数据)
  |-- Auth (身份验证)
  |-- Storage (图片/文件存储)
```

---

## 二、 核心数据模型 (Data Model / ER Diagram)

基于 PostgreSQL，设计以下核心数据表：

### 2.1 Users (用户表 - 由 Supabase Auth 托管)
*   `id` (UUID, PK)
*   `email` (String)
*   `role` (Enum: 'admin', 'supplier', 'customer')
*   `created_at` (Timestamp)

### 2.2 Patterns (图纸库)
*   `id` (UUID, PK)
*   `title` (String) - SEO 友好的标题
*   `description` (Text) - AI 生成的详细描述
*   `image_url` (String) - 关联 Supabase Storage
*   `difficulty` (Enum: 'Beginner', 'Intermediate', 'Advanced')
*   `colors_required` (JSONB) - 格式：`[{"color_name": "Red", "hex": "#FF0000", "count": 150}, ...]`
*   `category_id` (UUID, FK -> Categories)
*   `created_at` (Timestamp)

### 2.3 Suppliers (供应商名录)
*   `id` (UUID, PK)
*   `user_id` (UUID, FK -> Users) - 认领该工厂账号的用户
*   `company_name` (String)
*   `location` (String) - 例如 "Yiwu, China"
*   `factory_type` (String) - 例如 "Raw Material", "Tools"
*   `moq` (String) - 最小起订量
*   `description` (Text)
*   `is_verified` (Boolean) - 平台认证标志
*   `contact_email` (String)

### 2.4 Inquiries (B2B 询盘线索)
*   `id` (UUID, PK)
*   `supplier_id` (UUID, FK -> Suppliers)
*   `buyer_email` (String)
*   `message` (Text)
*   `status` (Enum: 'New', 'Contacted', 'Closed')
*   `created_at` (Timestamp)

### 2.5 Orders (C端零售订单)
*   `id` (UUID, PK)
*   `stripe_session_id` (String)
*   `pattern_id` (UUID, FK -> Patterns)
*   `shipping_address` (JSONB)
*   `total_amount` (Decimal)
*   `status` (Enum: 'Paid', 'Shipped', 'Delivered')

---

## 三、 核心业务数据流 (Data Flows)

### 3.1 AI 自动化图纸入库流程 (Content Generation Flow)
1.  **管理员**在后台上传一张无版权的拼豆图纸图片（或通过爬虫脚本批量抓取）。
2.  图片上传至 **Supabase Storage**，获取公开 URL。
3.  Next.js API 调用 **Google Vertex AI (Gemini Pro Vision)**，传入图片 URL 和 Prompt。
4.  Vertex AI 分析图片，返回 JSON 格式数据（包含标题、描述、难度、所需颜色清单）。
5.  系统将返回的数据连同图片 URL 写入 **Supabase `patterns` 表**。
6.  Next.js 重新生成（ISR/SSG）该图纸的静态页面，实现极速加载和 SEO 收录。

### 3.2 C 端购买与 Dropshipping 发货流 (B2C Order Flow)
1.  **海外客户**在图纸详情页点击 "Buy Complete Kit"。
2.  Next.js 调用 **Stripe API** 创建 Checkout Session。
3.  客户在 Stripe 托管页面完成信用卡支付。
4.  Stripe 发送 Webhook 回调给 Next.js API (`/api/webhooks/stripe`)。
5.  系统验证支付成功，在 **`orders` 表**中创建记录。
6.  系统通过 API 或邮件，将订单详情（商品清单、海外收件地址）发送给**中国合作仓库**。
7.  中国仓库发货，并在系统中回传物流单号，订单状态更新为 'Shipped'。

### 3.3 B2B 询盘线索流 (B2B Lead Gen Flow)
1.  **海外采购商**在供应商详情页填写 "Send Inquiry" 表单。
2.  Next.js API 接收表单数据，写入 **`inquiries` 表**。
3.  系统触发通知服务（如 Resend 或 SendGrid）。
4.  一封包含询盘详情的邮件发送给对应的**中国供应商**。
5.  (可选商业化) 平台可限制免费供应商只能看询盘前 50 个字，需付费解锁完整买家联系方式。
