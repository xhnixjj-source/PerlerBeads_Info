# 需求清单与项目开发计划 (Roadmap) - PerlerHub

**文档版本**：v1.0

本文档将 PerlerHub 项目拆解为具体的开发任务，并规划了 MVP（最小可行性产品）到 V1.0 的迭代路线图，适合直接导入 Jira、Trello 或 Linear 等项目管理工具。

---

## 一、 MVP 阶段 (第 1-2 周) - 验证流量与核心体验

**目标**：跑通核心图纸展示逻辑，完成 SEO 基础建设，验证 C 端搜索流量。

### 1.1 基础设施建设 (Infrastructure)
*   [x] 初始化 Next.js 项目并配置 Tailwind CSS
*   [x] 创建 Supabase 项目，执行核心表结构的 SQL 脚本
*   [x] 编写 `utils/supabase/server.ts` 和 `client.ts` 客户端工具类
*   [x] 部署初始代码到 Vercel，绑定自定义域名
*   [x] 集成 Google Vertex AI SDK，配置认证凭据

### 1.2 核心前端页面 (Frontend Pages)
*   [ ] **首页 (`/`)**：包含 Hero 区域、热门图纸推荐、工厂名录入口。
*   [ ] **图纸列表页 (`/patterns`)**：瀑布流/网格布局展示图纸，支持按分类筛选。
*   [ ] **图纸详情页 (`/patterns/[id]`)**：高清大图、AI 生成的 SEO 描述、难度标签、**所需颜色清单（核心组件）**。
*   [ ] **全局组件**：响应式 Header（带搜索框）、Footer。

### 1.3 核心后端与 AI 逻辑 (Backend & AI)
*   [ ] **AI 自动化入库 API (`/api/analyze-pattern`)**：接收图片 URL，调用 Gemini Pro Vision，返回结构化的图纸元数据（标题、描述、颜色清单）。
*   [ ] **Supabase 增删改查 API**：图纸列表读取、详情读取。
*   [ ] **SEO 优化**：在 Next.js 中配置动态的 `generateMetadata`，确保每个图纸页面的 Title 和 Description 都针对 Google 搜索进行优化。

---

## 二、 V1.0 阶段 (第 3-4 周) - 跑通商业闭环

**目标**：上线 B2B 供应商名录，接入 Stripe 支付，跑通 C 端材料包购买和 B 端询盘流程。

### 2.1 商业化闭环 - C端零售 (Dropshipping)
*   [ ] **Stripe 账号注册与配置**：获取 Publishable Key 和 Secret Key。
*   [ ] **支付集成 (`/api/checkout`)**：在图纸详情页点击 "Buy Kit" 后，调用 Stripe API 创建 Checkout Session。
*   [ ] **Webhook 处理 (`/api/webhooks/stripe`)**：监听支付成功事件，将订单信息写入 Supabase 的 `orders` 表。
*   [ ] **订单通知**：支付成功后，通过邮件（如 Resend）自动通知中国合作仓库准备发货。

### 2.2 商业化闭环 - B端供应链 (Supplier Directory)
*   [ ] **供应商列表页 (`/suppliers`)**：展示认证的中国拼豆工厂和设备商。
*   [ ] **供应商详情页 (`/suppliers/[id]`)**：展示工厂实拍、MOQ、主营产品。
*   [ ] **询盘表单组件 (Inquiry Modal)**：允许买家填写联系方式和需求。
*   [ ] **线索提交流程 (`/api/inquiry`)**：将询盘写入 `inquiries` 表，并自动发送邮件通知对应的中国工厂。

### 2.3 辅助功能与留存 (Retention)
*   [ ] **在线工具页 (`/tools/image-to-pattern`)**：前端实现简单的图片像素化逻辑（或调用第三方开源库）。
*   [ ] **创作者名录 (`/creators`)**：展示优质博主及其作品集。
*   [ ] **用户系统 (Supabase Auth)**：允许用户使用 Google 账号登录，收藏喜欢的图纸。

---

## 三、 运营与增长计划 (Growth Strategy)

### 3.1 内容冷启动 (0-1000 图纸)
*   编写 Python 爬虫脚本，从 Pinterest 抓取无版权的拼豆图纸（"perler bead patterns free"）。
*   编写批处理脚本，将抓取的图片 URL 批量送入 `/api/analyze-pattern`，利用 Vertex AI 自动生成高质量的英文标题、描述和色号清单，写入 Supabase。
*   **目标**：在一周内生成 5000 个长尾关键词覆盖的图纸页面，提交 Google Search Console 收录。

### 3.2 供应链冷启动 (0-50 供应商)
*   在 1688 或阿里巴巴国际站上，手动筛选 50 家优质的义乌/广东拼豆源头工厂。
*   手动将它们的资料录入 Supabase，并打上 "Verified" 标签。
*   当平台产生真实询盘时，通过邮件联系这些工厂：“我们在海外平台为您获得了一个真实买家询盘，请联系他...”，以此吸引工厂后续主动入驻或付费。

### 3.3 社交媒体引流 (Social Media)
*   在 TikTok 和 Instagram 上开设官方账号。
*   将平台上的精美图纸制作成 15 秒的 ASMR 拼豆视频（或搬运国内小红书优质视频，注明出处）。
*   在视频评论区和主页挂上 PerlerHub 对应图纸的短链接，引导用户点击 "Get Free Pattern & Buy Kit"。
