**Majmu' Manan** application development, covering specifications, technical architecture, database design, to task breakdown.

---

### 1. Product Specification (Specify)

* **Goal & Target:** Reading/wirid content application for extended family ("internal circle"), inspired by **NU Online**.
* **Platform:** **PWA (Progressive Web App)**. Accessed via browser, installable via "Add to Home Screen", and **must work Offline** (Service Worker) for reading wirid without internet.
* **Key Features (Public App / Reader UI/UX):**
    * **Flexible Swipe Navigation:**
        * If reading has Chapters/Segments (e.g., Tahlil, Maulid), navigate between chapters using **Swipe Left/Right**.
        * If reading is short/single (e.g., Daily Prayer), navigate only **Scroll Up/Down** (no swipe).
    * **URL/Slug Routing:** Page/swipe transitions must change URL (e.g., `/bacaan/tahlil/tawasul` to `/bacaan/tahlil/inti`) so reading position is saved on refresh and shareable via link.
    * **Guest Personalization (Public App Only - Local Storage):**
        * **Bookmarks:** Users can bookmark readings without logging in. Data is stored locally on the device.
        * **Preferences:** Font size, translation visibility, and theme (Dark/Light) settings are saved in the browser.
* **Admin/CMS Features:**
    * Dedicated panel needed for content management.
    * Main functions: Fix old "messy" data (typos, wrong format), input Arabic/Latin/Translation text, and arrange chapter order.
* **Data Source:** Using old database (`majmu_manan_v1.sql`) as initial *seed*, but structure totally revamped to support swipe feature.
### 2. Database Design & Schema V2

Database structure is simplified to focus on **Content Management**. Since user features (bookmarks/preferences) are client-side, we **remove/exclude** any user-related tables for the public app.

**Core Tables (Content Only):**

1.  **Table `bacaans` (Header):**
    * Stores main metadata: `id`, `judul` (title), `slug` (unique), `gambar` (image), `deskripsi` (description).
2.  **Table `bacaan_sections` (Grouping/Chapter):**
    * Stores chapters or sections.
    * Columns: `id`, `bacaan_id` (FK), `judul_section` (section title), `slug_section`, `urutan` (order - INT).
    * *Logic:* This table enables Swipe feature. One Reading Title can have many Sections.
3.  **Table `bacaan_items` (Content/Verse):**
    * Stores content rows per page.
    * Columns: `id`, `bacaan_id` (FK), `section_id` (FK - Nullable), `urutan` (order).
    * **Content:** `arabic` (LongText), `latin` (LongText), `terjemahan` (translation - LongText).
    * **Display:** `tipe_tampilan` (display type - Enum: text, syiir, center_title, image, note).
    * *Logic:* If `section_id` is NULL, it means the reading is *flat scroll* type (no chapters).

*> Note: Tables like `users` (for public), `bookmarks`, or `histories` are NOT created in the backend. The `users` table exists solely for Admin authentication.*

--- * **Display:** `tipe_tampilan` (display type - Enum: text, syiir, center_title, image, note).
    * *Logic:* If `section_id` is NULL, it means the reading is *flat scroll* type (no chapters).

---

### 3. Tech Stack & Architecture (Plan)

Considering infrastructure limitations (**Shared Hosting without SSH**), architecture is divided into Development (Local) and Production (Static File).

* **Backend (Server Side):**
    * **Framework:** Laravel 12 (API Only Mode).
    * **Database:** MySQL.
    * **Docs:** L5-Swagger (for Frontend reference).
    * **Auth:** Laravel Sanctum.
    * **Deployment:** Manual PHP file upload, Laravel `public` folder separated to subdomain/api folder.
* **Frontend (Client Side):**
    * **Structure:** **Monorepo** (using NPM/PNPM Workspaces) run locally.
    * **Framework:** React JS + Vite.
    * **UI Library:** **Chakra UI** (v3).
    * **State Management:** React Query (TanStack Query) + Axios.
    * **Directory Pattern:** **Feature-Based Architecture** (Code grouped by business features: `features/auth`, `features/reader`, not by file type). See [ARCHITECTURE.md](ARCHITECTURE.md).
* **Frontend Monorepo Structure:**
    * `shared-lib`: Contains Type Definitions (TS Interfaces), Chakra UI Theme, Axios Instance, and basic UI Components (Button, Card). Used by Admin and Public.
    * `admin-panel`: React App specifically for CMS (Heavy CRUD).
    * `public-app`: React App specifically for User/PWA (Focus on performance & Swipe UX).
    See [ARCHITECTURE.md](ARCHITECTURE.md).

---

### 4. Task Breakdown

#### Phase 1: Setup Backend & Data Migration (Foundation)
* **Setup Laravel:** Install Laravel 12, configure `.env` (database connection), and install support libraries (L5-Swagger).
* **Setup Database & Migration:** Create Laravel migration files for V2 schema (`bacaans`, `bacaan_sections`, `bacaan_items`).
* **Setup Models:** Create Eloquent Models (`Bacaan`, `Section`, `Item`) along with relationships (`hasMany`, `belongsTo`) to facilitate seeding process.
* **Setup Seeder (Migration):** Create `MigrasiDataLamaSeeder.php` script with logic:
    * Fetch data from old table `bacaan_details`.
    * Detect `segmen_parent`: If exists, insert into `sections` table.
    * Detect `segmen_child`: Insert into `items` table.
    * Generate `slug` automatically using PHP helper (`Str::slug`).
* **Execution:** Run `php artisan migrate` and `php artisan db:seed` to move old data to new home.

#### Phase 2: API Development (Core Logic)
* **API Auth:** Implement Login for Admin via Laravel Sanctum.
* **Admin Endpoints:** 
    * Complete CRUD for Bacaan, Section, and Item.
    * Special endpoint for structure update (re-order chapter/verse).
* **Public Endpoints:** 
    * Read-only API optimized for cache.
    * `GET /bacaan/{slug}` (metadata detail).
    * `GET /bacaan/{slug}/{section}` (content per chapter for swipe navigation).
* **Documentation:** Generate automatic API documentation using L5-Swagger so Frontend team can work in parallel.

#### Phase 3: Frontend Setup (Monorepo)
* **Workspace:** Init `package.json` with workspaces: `admin`, `public`, `shared`.
* **Shared Lib:** Setup TypeScript interfaces (matching Laravel API), Chakra UI Theme configuration (colors, Arabic font), and Axios Base URL setup.
* **Environment:** Setup `.env` in each app to hold Laravel API URL.

#### Phase 4: Admin Panel Development (CMS)
* **Auth UI:** Login page & token integration.
* **List View:** Reading list table.
* **Detail Editor:**
    * Feature to add/edit Section.
    * Feature to edit Item (Arabic, Latin, Translation) via *bulk* or *inline editing*.
    * Display *Preview* feature.

#### Phase 5: Public App Development (PWA)
* **Home UI:** Reading menu grid & search.
* **Reader Logic (Core):**
    * Implement React Router to handle dynamic URLs.
    * Implement data *fetching* logic per section.
    * Implement **Gesture Handler** (Swipe Left/Right) to trigger route navigation.
* **Guest Features (Client-Side):**
    * **Bookmarks:** Implement "Add to Bookmark" button using LocalStorage/IndexedDB.
    * **Settings (Preferences):** Create Settings Modal to adjust font size & toggle translation (saved in LocalStorage).
* **PWA Assets:** Manifest.json, Icon, Service Worker (offline cache).

#### Phase 6: Deployment
* **Build:** Run `npm run build` locally for Admin and Public app.
* **Upload Backend:** Upload Laravel folder outside public server root, point `index.php` in `public_html/api` to core folder.
* **Upload Frontend:** Upload React build result (`dist` folder) to `public_html`.
* **Routing Server:** Add `.htaccess` to handle *client-side routing* (so refresh doesn't 404).