# React Architecture Documentation: Feature-Based Monorepo

This document explains the project architecture structure that combines **Feature-Based Architecture** principles (for scalability) with the **NPM Workspaces** approach (for separating Admin and Public applications without code duplication).

## 1. Core Philosophy

This architecture is built on the following principles:
1.  **Separation of Concerns:** Separating *Public* applications (Customer facing, SEO, Performance) and *Admin* (Data heavy, Complex logic).
2.  **Feature-Based:** Grouping code based on *business features* (Product, Auth, Order), not by file type.
3.  **Single Source of Truth:** Using a *Shared Library* for data types (Typescript Interfaces) and common utilities to avoid manual duplication (Copy-Paste).
4.  **Colocation:** Placing related code as close as possible (API, Hooks, Components, State are in one feature folder).

---

## 2. Global Directory Structure (Root)

We use a **Lightweight Monorepo** approach using the built-in `workspaces` feature (NPM/Yarn/PNPM).

```text
my-project/
├── package.json              <-- Root Workspaces Configuration
├── tsconfig.base.json        <-- Base TypeScript Config (optional)
│
├── 📁shared-lib              <-- Shared Logic (Used by Admin & Public)
│   ├── package.json          <-- name: "@project/shared"
│   ├── src
│   │   ├── types             <-- DB Interfaces (Product, User, API Response)
│   │   ├── utils             <-- Formatters (IDR, Date), Validations
│   │   └── ui                <-- Basic UI Kit (Button, Input, CardWrapper)
│   └── index.ts              <-- Export module to be imported by other apps
│
├── 📁admin-panel             <-- React Application (Vite/Next) for CMS
│   ├── package.json          <-- dependency: "@project/shared": "*"
│   └── src
│       ├── app               <-- Layouts, Providers, Global Router
│       ├── features          <-- CRUD Logic, Table, Form Management
│       └── pages             <-- Pages /admin/...
│
└── 📁public-app              <-- React Application (Vite/Next) for User
    ├── package.json          <-- dependency: "@project/shared": "*"
    └── src
        ├── app               <-- Layouts, Providers, Global Router
        ├── features          <-- Catalog Logic, Cart, Checkout
        └── pages             <-- Pages /...
```

---

## 3. Feature-Based Implementation Details
Inside the src folder in both admin-panel and public-app, we apply a modular feature structure.

src Folder Structure
```
src/
├── 📁app                   <-- Global Setup
│   ├── layouts/            (AdminLayout, PublicLayout)
│   ├── providers.tsx       (React Query, AuthProvider)
│   ├── router.tsx          (URL Definitions)
│   └── main.tsx            (Entry Point)
│
├── 📁features              <-- Application Heart (Business Logic)
│   ├── 📁auth
│   └── 📁products          <-- Example Feature "Products"
│       ├── 📁api           (endpoints: getProducts, createProduct)
│       ├── 📁components    (ProductTable, ProductForm - specific to this feature)
│       ├── 📁hooks         (useProducts, useProductMutation)
│       ├── 📁types         (Local types if any, extend from shared)
│       └── index.ts        (Public API for this feature)
│
├── 📁pages                 <-- Routing / View Layer (Thin/Minimal Logic)
│   ├── 📁products
│   │   ├── ListPage.tsx    (Only calls components from features)
│   │   └── DetailPage.tsx
│   └── DashboardPage.tsx
│
└── 📁shared                <-- Local generic code but not in global shared-lib
    ├── 📁hooks             (useDebounce, useToggle)
    └── 📁api               (Axios Instance Setup)
```

---

## 4. Workspaces Configuration (IMPORTANT)
To allow admin-panel to import shared-lib without copy-paste, perform the following configuration:

A. Root package.json
```json
{
  "name": "root-project",
  "private": true,
  "workspaces": [
    "admin-panel",
    "public-app",
    "shared-lib"
  ]
}
```
B. Shared Lib shared-lib/package.json
```json
{
  "name": "@project/shared",
  "version": "1.0.0",
  "main": "index.ts"
}
```
C. App package.json (Admin & Public)
```json
{
  "name": "admin-panel",
  "dependencies": {
    "react": "^18.0.0",
    "@project/shared": "*"
  }
}
```

---

## 5. Development Guidelines (Rules of Thumb)
A. Where to put code?

| Code Type | Example | Storage Location |
| :--- | :--- | :--- |
| Data Interface | Product, User, ApiResponse | `shared-lib/src/types` |
| Pure Utility | formatRupiah, formatDate | `shared-lib/src/utils` |
| Primitive UI | Button, Input, ModalBase | `shared-lib/src/ui` |
| Feature Logic | useCreateProduct, fetchProduct | `src/features/products/...` |
| Feature UI | ProductCard, ProductTable | `src/features/products/components` |
| Pages | ProductListPage, CheckoutPage | `src/pages/...` |

B. Smart vs Dumb Components
    - Dumb Components (UI): Only receive props and display data. Must not fetch data themselves. Location: features/*/components or shared-lib/ui.
    - Smart Components (Pages/Containers): Allowed to fetch data, call hooks, and manage layout. Location: src/pages or root features components.

C. Workflow
    1. Define Types: Update shared-lib/types if there are DB structure changes.
    2. Create Logic: Create API calls and Hooks in features/{feature}/hooks.
    3. Create Components: Create UI components in features/{feature}/components.
    4. Assemble in Page: Mount those components in pages/{route}.

---

## 6. Code Examples
Importing in Admin Panel:
```typescript
// Get Type from Shared Lib (Automatically updated if shared changes)
import { Product } from '@project/shared'; 
// Get Local Logic
import { useCreateProduct } from '@/features/products/hooks';

export const ProductForm = () => {
  const mutation = useCreateProduct();
  
  const handleSubmit = (data: Product) => {
    mutation.mutate(data);
  }
  // ... render form
}
```
Importing in Public App:
```typescript
// SAME Type, ensuring data consistency
import { Product, formatRupiah } from '@project/shared'; 

export const ProductCard = ({ item }: { item: Product }) => {
  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p>{formatRupiah(item.price)}</p>
    </div>
  )
}
```
