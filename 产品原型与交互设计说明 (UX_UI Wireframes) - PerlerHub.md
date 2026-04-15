# 产品原型与交互设计说明 (UX/UI Wireframes) - PerlerHub

**文档版本**：v1.0

本文档描述了 PerlerHub 核心页面的线框图（Wireframe）结构、信息层级和关键交互逻辑，供 UI 设计师和前端开发工程师参考。

---

## 一、 全局导航与布局 (Global Layout)

### 1.1 顶部导航栏 (Header)
*   **Logo (左侧)**：PerlerHub (点击返回首页)
*   **主导航 (中间)**：
    *   **Patterns** (下拉菜单：Anime, Games, Holidays, 3D, Animals)
    *   **Suppliers** (下拉菜单：Beads, Pegboards, Irons, Packaging)
    *   **Creators** (精选博主作品)
    *   **Tools** (Image to Pattern, Color Converter)
    *   **Learn** (Tutorials, Buying Guide)
*   **功能区 (右侧)**：
    *   全局搜索框 (Search patterns, colors, or suppliers...)
    *   购物车图标 (带数量角标)
    *   用户登录/注册 (Sign In / Sign Up)
    *   "Add Listing" 按钮 (供供应商或博主入驻)

### 1.2 底部信息栏 (Footer)
*   **关于我们**：About Us, Contact, Terms of Service, Privacy Policy.
*   **快速链接**：热门图纸分类、热门供应商分类、热门教程。
*   **社交媒体**：Instagram, Pinterest, TikTok, YouTube 链接。
*   **邮件订阅**："Subscribe for weekly free patterns!" (输入框 + 订阅按钮)。

---

## 二、 核心页面线框图设计 (Core Page Wireframes)

### 2.1 首页 (Homepage)

**目标**：快速分流 C 端（找图纸）和 B 端（找工厂）用户，展示平台核心价值。

*   **Hero Section (首屏横幅)**：
    *   大标题：`The Ultimate Directory for Perler Beads Enthusiasts & Businesses.`
    *   副标题：`Find 10,000+ free patterns, discover top Chinese suppliers, and buy complete kits in one click.`
    *   双 CTA 按钮：[Explore Free Patterns] (主按钮，导向 C 端) | [Find Manufacturers] (次按钮，导向 B 端)。
*   **Trending Patterns (热门图纸横向滑动区)**：
    *   展示 4-6 张当前最热的图纸卡片（卡片包含：图片、标题、难度标签、所需颜色数量）。
    *   右上角 "View All Patterns" 链接。
*   **Top Chinese Suppliers (精选中国源头工厂)**：
    *   展示 3-4 家认证工厂的卡片（卡片包含：工厂名称、主营产品标签如 "5mm Soft Beads", "Pegboards"、MOQ 标签、"Verified" 认证徽章）。
    *   右上角 "Browse Supplier Directory" 链接。
*   **Featured Creators (本周推荐创作者)**：
    *   展示 3 位博主的头像、简介和 3 张代表作缩略图。
*   **Popular Tools (热门工具入口)**：
    *   两个大卡片入口："Turn your photo into a pattern" 和 "Brand Color Converter"。

### 2.2 图纸详情页 (Pattern Detail Page) - 核心转化页

**目标**：提供图纸的高清视图和所需材料清单，促使用户点击“一键购买材料包”。

*   **左侧主要内容区 (70% 宽度)**：
    *   **面包屑导航**：Home > Patterns > Games > Pikachu
    *   **大图展示**：高清拼豆图纸（支持放大/缩小查看像素点）。
    *   **图纸信息**：标题 (e.g., "Classic Pikachu 8-bit Sprite")，作者/来源，发布时间。
    *   **详细描述**：SEO 友好的长文本描述，包含关键词。
    *   **相关推荐 (Related Patterns)**：底部展示 4 张风格相似的图纸。
*   **右侧操作面板 (30% 宽度，固定悬浮)**：
    *   **难度徽章**：Beginner / Intermediate / Advanced。
    *   **尺寸信息**：例如 "29 x 29 pegs" (需要几块拼板)。
    *   **所需颜色清单 (Colors Required)**：
        *   列表展示：颜色色块图标 + 颜色名称 + 所需颗数 (e.g., [黄色图标] Yellow: 150 beads)。
    *   **核心转化按钮 (CTA)**：
        *   **[Buy Complete Kit - $9.99]** (包含图纸所需的全部豆子和拼板)。
        *   [Download PDF Pattern] (次要操作，可能需要邮箱注册)。
    *   **分享按钮**：Share to Pinterest, Facebook, Twitter。

### 2.3 供应商详情页 (Supplier Profile Page) - B2B 核心页

**目标**：全面展示工厂实力，促使海外买家发送询盘。

*   **顶部工厂信息卡 (Header Card)**：
    *   工厂名称 (e.g., "Yiwu Artkal Plastics Co., Ltd.")。
    *   "Verified Manufacturer" 徽章。
    *   所在地：Yiwu, Zhejiang, China。
    *   核心数据：成立年份、厂房面积、员工人数。
*   **左侧主要内容区 (70% 宽度)**：
    *   **About the Company (公司简介)**：详细的图文介绍。
    *   **Main Products (主营产品图库)**：展示豆子、热压机、包装等高清产品图。
    *   **Certifications (资质认证)**：CE, EN71, RoHS 等证书扫描件。
    *   **Factory Tour (工厂实拍)**：车间、仓库、展厅的照片或视频。
*   **右侧操作面板 (30% 宽度，固定悬浮)**：
    *   **关键交易信息**：
        *   Min. Order Quantity (MOQ): 1000 Bags
        *   Lead Time: 7-15 Days
        *   Accepted Payment: T/T, PayPal, L/C
    *   **核心转化按钮 (CTA)**：
        *   **[Send Inquiry / Contact Supplier]** (点击弹出询盘表单，需填写买家邮箱、需求描述、数量等)。
    *   **联系方式 (部分隐藏)**：显示部分邮箱/电话，需登录或点击后查看完整信息（用于平台收集买家线索）。

### 2.4 在线工具页 (Image to Pattern Generator)

**目标**：提供高频使用的实用工具，增加用户粘性和停留时间。

*   **页面布局 (单栏居中)**：
    *   **标题**：Turn Any Photo into a Perler Bead Pattern
    *   **步骤一：上传图片**：巨大的拖拽上传区域 (Drag & Drop or Click to Upload)。
    *   **步骤二：调整参数 (上传后显示)**：
        *   选择目标尺寸 (e.g., 1 Pegboard 29x29, 2x2 Pegboards)。
        *   选择调色板 (e.g., Perler Standard 50 Colors, Artkal 200 Colors)。
        *   调整对比度/亮度滑块。
    *   **步骤三：生成与预览**：
        *   点击 [Generate Pattern] 按钮。
        *   展示生成的像素化效果对比图 (原图 vs 拼豆图)。
    *   **步骤四：导出与购买**：
        *   [Download PDF Guide] (导出图纸)。
        *   **[Buy Required Beads]** (根据生成的图纸，自动计算所需色号，并提供一键购买链接)。

---

## 三、 关键交互流程 (Key User Flows)

### 3.1 C 端用户购买材料包流程 (Dropshipping Flow)
1.  用户通过 Google 搜索长尾词 (e.g., "mario mushroom perler pattern") 进入**图纸详情页**。
2.  查看图纸和所需颜色清单，觉得不错。
3.  点击右侧的 **[Buy Complete Kit]** 按钮。
4.  系统将该图纸所需的所有色号（单色补充包）或预先打包好的套装加入购物车。
5.  用户进入 Checkout 页面，填写海外收货地址。
6.  通过 Stripe 完成信用卡支付。
7.  系统自动将订单信息推送到中国合作仓库（或通过 ERP 软件同步）。
8.  中国仓库完成拣货、打包，通过跨境物流（如云途、燕文）直发海外客户。

### 3.2 B 端买家发送询盘流程 (B2B Lead Gen Flow)
1.  海外手工店老板通过导航进入 **Suppliers 列表页**，筛选 "Pegboards" 厂家。
2.  点击进入某家义乌工厂的**供应商详情页**。
3.  查看工厂资质和 MOQ，符合要求。
4.  点击右侧的 **[Send Inquiry]** 按钮。
5.  弹出模态框 (Modal)，填写：Name, Email, Company, Message (需求详情), Quantity。
6.  点击 [Submit]。
7.  系统后台记录该条线索 (Lead)，并自动发送邮件通知中国工厂的业务员。
8.  中国工厂业务员通过邮件或平台内部消息系统与海外买家取得联系，开始跟单。
