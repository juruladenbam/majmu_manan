# Majmu' Manan Project - QWEN Context

## Project Overview

Majmu' Manan is a **monorepo** application focused on providing a **reading/wirid content platform** for extended family members ("internal circle"), inspired by NU Online. The project implements a **Progressive Web App (PWA)** architecture with offline capabilities for reading content without internet connectivity.

### Architecture
The project follows a **monorepo** structure using PNPM workspaces with three main components:
- `backend`: Laravel 12 API-only backend with MySQL database
- `admin-panel`: React application for content management (CMS)
- `public-app`: React application for end-users with PWA features
- `shared-lib`: Shared TypeScript interfaces, utilities and components

### Key Technologies
- **Backend**: Laravel 12 (API Only), MySQL, L5-Swagger, Laravel Sanctum
- **Frontend**: React JS + Vite, TypeScript, Chakra UI v3, React Query (TanStack Query)
- **Architecture**: Feature-based architecture with NPM/PNPM workspaces
- **PWA**: Service Worker for offline caching and installability

## Project Structure

```
majmu-manan/
├── backend/              # Laravel 12 API backend
├── admin-panel/          # React CMS application  
├── public-app/           # React PWA application
├── shared-lib/           # Shared types, utils and components
├── docs/                 # Architecture documentation
├── package.json          # Workspace configuration
├── pnpm-workspace.yaml   # PNPM workspace setup
├── spec.md               # Technical specifications
└── ARCHITECTURE.md       # Architecture documentation
```

## Database Schema (V2)

The backend implements a simplified database structure focusing on content management:

1. **`bacaans`** (Reading Headers): Contains main metadata
   - `id`, `judul` (title), `slug` (unique), `gambar` (image), `deskripsi` (description)

2. **`bacaan_sections`** (Chapters/Groups): Stores chapters or sections
   - `id`, `bacaan_id` (FK), `judul_section` (section title), `slug_section`, `urutan` (order)

3. **`bacaan_items`** (Content Items): Stores content rows per page
   - `id`, `bacaan_id` (FK), `section_id` (FK - Nullable), `urutan` (order)
   - Content fields: `arabic`, `latin`, `terjemahan` (translation)
   - Display type: `tipe_tampilan` (text, syiir, center_title, image, note)

> Note: Guest user features (bookmarks/preferences) are stored client-side using localStorage.

## Key Features

### Public App (PWA)
- **Flexible Swipe Navigation**: Chapters navigate with swipe gestures, single readings with scroll
- **URL/Slug Routing**: Dynamic routing that enables saving reading position and sharing links
- **Guest Personalization**: Bookmarks and preferences stored locally (font size, translation, theme)
- **Offline Support**: Service worker enables offline reading capability
- **Arabic Typography**: Optimized typography for Arabic content with Scheherazade New font

### Admin Panel (CMS)
- Dedicated content management interface
- Functions to fix old "messy" data and manage Arabic/Latin/Translation content
- Chapter arrangement and content structuring tools

## Development Setup

### Prerequisites
- Node.js (with pnpm)
- PHP 8.2+ 
- MySQL database

### Monorepo Commands
- `pnpm install` - Install all dependencies across workspaces
- `pnpm dev:admin` - Run admin panel in development mode  
- `pnpm dev:public` - Run public app in development mode
- `pnpm build` - Build all workspaces

### Backend (Laravel)
- Located in `/backend` directory
- API-only Laravel 12 application
- Composer commands: `composer install`, `php artisan migrate`, `php artisan serve`
- API documentation available via L5-Swagger

### Frontend Applications
Both `admin-panel` and `public-app` use:
- React with TypeScript
- Chakra UI for components
- React Query for data fetching
- React Router for navigation
- Shared types from `@project/shared` package

## Development Conventions

### Feature-Based Architecture
Code is organized by features rather than file types:
```
features/
├── auth/
├── reader/              # Reading content feature
│   ├── api/             # API endpoints
│   ├── components/      # UI components  
│   ├── hooks/           # Custom hooks
│   ├── types/           # Local types
│   └── index.ts         # Feature exports
└── bookmarks/           # Bookmark feature
```

### Shared Library
- Common TypeScript interfaces in `shared-lib/src/types`
- Theme configurations and utility functions
- API instances and basic UI components

### Client-Side Preferences
The application stores user preferences using localStorage:
- `fontSize` - Font size for Arabic text
- `showTranslation` - Toggle for translation visibility  
- `themeMode` - Light/dark theme preference

## Building and Running

### Development
1. Navigate to root directory and run `pnpm install`
2. Start backend: `cd backend && php artisan serve`
3. Start admin panel: `pnpm dev:admin`
4. Start public app: `pnpm dev:public`

### Production
1. Run `pnpm build` to build all applications
2. Deploy backend as Laravel application
3. Deploy frontend builds to static hosting
4. Configure service worker for PWA functionality

## Key Implementation Notes

- The swipe navigation feature uses `react-swipeable` for gesture recognition
- Arabic content is displayed with special typography considerations using Scheherazade New font
- Content display types include text, syiir (poetry), centered titles, images, and notes
- Bookmarks are implemented as client-side localStorage with no backend user accounts for public users
- The application uses React Query for server state management and localStorage hooks for client preferences