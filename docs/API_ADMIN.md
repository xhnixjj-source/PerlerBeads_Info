# Admin API 参考

本仓库的 Next.js App Router 将 API 放在 **`app/api/admin/`**（根目录 `app/`，不是 `src/app/`）。

所有管理端接口（除登录会话外）均要求：

1. **Cookie**：已调用 `POST /api/admin/session` 登录，浏览器携带 `perlerhub_admin=<ADMIN_DASHBOARD_PASSWORD>`。
2. **可选身份**：请求头 **`x-admin-user-id: <uuid>`**，且该 UUID 存在于 `public.admin_users` 时，操作日志会写入 `admin_logs.admin_id`，并使用该行 `role` 做权限判断。
3. **可选邮箱映射**：环境变量 **`ADMIN_DASHBOARD_EMAIL`** 若与 `admin_users.email` 匹配，则使用该行的 `id` / `role`（无需 `x-admin-user-id`）。
4. 若以上均未命中，则视为 **`super_admin`**（`admin_id` 为空）。

---

## 通用约定

### 错误响应

```json
{
  "error": {
    "message": "Human readable message",
    "code": "unauthorized | forbidden | validation | database | ...",
    "status": 401
  }
}
```

### 列表响应

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### 列表查询参数

| 参数 | 说明 |
|------|------|
| `page` | 页码，从 1 开始，默认 `1` |
| `limit` | 每页条数，默认 `10`，最大 `100` |
| `search` | 全文搜索（各资源搜索字段不同，见下表） |
| `filter` | JSON 字符串，用于等值筛选，如 `{"status":"published"}` |

### 角色与权限（写入类操作）

| 角色 | 可写资源 |
|------|----------|
| `super_admin` | 全部 |
| `content_admin` | `patterns`, `blog`, `products`, `upload` |
| `order_admin` | `orders`, `inquiries`, `upload` |
| `supplier_admin` | `suppliers`, `products`, `upload` |

**Settings**：任意角色可 **GET**；仅 **`super_admin`** 可 **PUT**（另有一层 `canWriteSettings` 校验）。

### 操作日志

对 **`POST` / `PUT` / `DELETE`**（以及上传 `POST`）在成功后写入 **`public.admin_logs`**：

- `action`: `create` | `update` | `delete`
- `table_name`: 业务表名（上传为 `storage`）
- `record_id`: UUID 或 `null`
- `changes`: JSON，通常含 `before` / `after` 或 `payload`

---

## 端点一览

### 会话（已有）

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/admin/session` | 登录，设置 Cookie |
| `DELETE` | `/api/admin/session` | 登出 |

### Suppliers

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/suppliers` | 列表 |
| `POST` | `/api/admin/suppliers` | 新增 |
| `GET` | `/api/admin/suppliers/[id]` | 详情 |
| `PUT` | `/api/admin/suppliers/[id]` | 更新 |
| `DELETE` | `/api/admin/suppliers/[id]` | 删除 |

**列表 `filter` 示例**：`{"verified":true}`、`{"slug":"acme"}`  
**`search`**：匹配 `name`, `slug`, `location`（ilike）。

**`POST` body 示例**：

```json
{
  "slug": "acme-beads",
  "name": "Acme Beads",
  "location": "CN",
  "moq": 100,
  "verified": true,
  "logo_url": "https://example.com/logo.png",
  "banner_images": [],
  "certifications": [],
  "products": [],
  "rating": 4.5,
  "review_count": 12
}
```

**成功（单条）**：`{ "data": { ...row } }`  
**创建**：`201`，`{ "data": { ...row } }`

---

### Products

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/products` | 列表 |
| `POST` | `/api/admin/products` | 新增 |
| `GET` | `/api/admin/products/[id]` | 详情 |
| `PUT` | `/api/admin/products/[id]` | 更新 |
| `DELETE` | `/api/admin/products/[id]` | 删除 |

**`filter` 示例**：`{"category":"perler"}`、`{"featured":true}`、`{"supplier_id":"<uuid>"}`  
**`search`**：`name`, `slug`, `sku`, `category`。

**`POST` body 示例**：

```json
{
  "slug": "kit-001",
  "supplier_id": "uuid",
  "name": "Bulk kit",
  "category": "perler",
  "description": "",
  "price_usd": 19.99,
  "price_cny": null,
  "moq": 10,
  "stock": 100,
  "sku": "SKU-1",
  "images": [],
  "specifications": {},
  "tags": [],
  "featured": false
}
```

---

### Patterns

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/patterns` | 列表 |
| `POST` | `/api/admin/patterns` | 新增 |
| `GET` | `/api/admin/patterns/[id]` | 详情 |
| `PUT` | `/api/admin/patterns/[id]` | 更新 |
| `DELETE` | `/api/admin/patterns/[id]` | 删除 |

**`filter` 示例**：`{"difficulty":"beginner"}`（与数据库中存储一致，一般为小写）  
**`search`**：`title`, `slug`。

**`POST` body 示例**：

```json
{
  "slug": "pikachu",
  "title": "Pikachu",
  "difficulty": "beginner",
  "color_palette": [],
  "image_url": "https://example.com/p.png",
  "seo_title": null,
  "seo_description": null,
  "seo_keywords": null,
  "ai_generated_metadata": {},
  "views_count": 0,
  "downloads_count": 0
}
```

> 若行上仍关联 **orders**，`DELETE` 可能因外键失败。

---

### Orders

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/orders` | 列表 |
| `GET` | `/api/admin/orders/[id]` | 详情 |
| `PUT` | `/api/admin/orders/[id]` | 更新（无 DELETE） |

**`filter` 示例**：`{"status":"Paid"}` 或 `{"status":"paid"}`（取决于数据库约束）、`{"pattern_id":"<uuid>"}`  
**`search`**：`order_number`。

**`PUT` body 示例**：

```json
{
  "status": "Shipped",
  "total_price": 49.99
}
```

`status` 为字符串，需与当前库中 `orders_status_check` 一致（可能为迁移后的 `Pending`/`Paid`/…）。

---

### Inquiries

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/inquiries` | 列表 |
| `GET` | `/api/admin/inquiries/[id]` | 详情 |
| `PUT` | `/api/admin/inquiries/[id]` | 更新 |

另有旧接口 **`POST /api/admin/inquiries/[id]/status`**（仅更新 `status`）。

**`filter` 示例**：`{"supplier_id":"<uuid>"}`、`{"status":"New"}`（需表中存在 `status` 列）  
**`search`**：`buyer_email`, `message`。

**`PUT` body 示例**（字段均为可选，至少传一个）：

```json
{
  "status": "Contacted",
  "message": "Followed up by email."
}
```

---

### Blog posts

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/blog` | 列表 |
| `POST` | `/api/admin/blog` | 新增 |
| `GET` | `/api/admin/blog/[id]` | 详情 |
| `PUT` | `/api/admin/blog/[id]` | 更新 |
| `DELETE` | `/api/admin/blog/[id]` | 删除 |

**`filter` 示例**：`{"status":"published"}`  
**`search`**：`title`, `slug`。

**`POST` body 示例**：

```json
{
  "slug": "hello",
  "title": "Hello",
  "content": { "type": "doc", "content": [] },
  "excerpt": "",
  "featured_image_url": "",
  "status": "draft",
  "published_at": ""
}
```

`published_at` 传空字符串会存为 `null`。

---

### Upload（Storage）

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/admin/upload` | 上传文件 |

**请求**：`multipart/form-data`，字段名 **`file`**，最大约 **8MB**。

**成功示例**：

```json
{
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/public/admin-uploads/uploads/....webp",
    "path": "uploads/....webp",
    "bucket": "admin-uploads"
  }
}
```

**部署前**：在 Supabase 中创建 **`admin-uploads`** bucket，并按需设为 **Public** 或改用签名 URL（当前实现使用 `getPublicUrl`）。

---

### Settings（键值 JSON）

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/settings` | 读取 `admin_settings` 单行 |
| `PUT` | `/api/admin/settings` | 仅 `super_admin` 更新 |

需执行迁移 **`supabase/migrations/20260417000002_admin_settings.sql`** 创建 `public.admin_settings`。

**`GET` 响应示例**：

```json
{
  "data": {
    "settings": {},
    "updated_at": null
  }
}
```

**`PUT` body**：

```json
{
  "data": {
    "announcement": "Maintenance tonight",
    "featureFlags": { "beta": true }
  }
}
```

---

## cURL 示例（列表）

```bash
curl -sS "http://localhost:3000/api/admin/suppliers?page=1&limit=10&search=acme" \
  -H "Cookie: perlerhub_admin=$ADMIN_DASHBOARD_PASSWORD"
```

## 依赖环境

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`（本 Admin API 主要用 service role）
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_DASHBOARD_PASSWORD`
