# Breakdown Implementasi Fitur Laporan Bacaan

## Overview
Fitur pelaporan konten bacaan untuk pengguna publik dengan dua opsi: "Benarkan Langsung" dan "Pakai Catatan". Admin dapat menyetujui (mengupdate data) atau menolak laporan.

---

## Fase 1: Database & Backend

### 1.1 Migration
**File:** `backend/database/migrations/xxxx_xx_xx_create_bacaan_reports_table.php`

```php
Schema::create('bacaan_reports', function (Blueprint $table) {
    $table->id();
    $table->foreignId('bacaan_id')->constrained('bacaans')->onDelete('cascade');
    $table->string('pelapor_nama', 255)->nullable();
    $table->string('pelapor_email', 255)->nullable();
    $table->enum('kategori', ['salah_ketik', 'teks_hilang', 'terjemahan_salah', 'lain_lain']);
    $table->enum('jenis_laporan', ['bacaan', 'section', 'item']);
    $table->unsignedBigInteger('target_id')->nullable();
    $table->json('field_koreksi')->nullable();
    $table->longText('konten_asli')->nullable();
    $table->longText('konten_koreksi')->nullable();
    $table->enum('status', ['pending', 'disetujui', 'ditolak'])->default('pending');
    $table->timestamps();
    
    $table->index(['bacaan_id', 'status']);
    $table->index('jenis_laporan');
});
```

### 1.2 Model
**File:** `backend/app/Models/BacaanReport.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BacaanReport extends Model
{
    protected $fillable = [
        'bacaan_id',
        'pelapor_nama',
        'pelapor_email',
        'kategori',
        'jenis_laporan',
        'target_id',
        'field_koreksi',
        'konten_asli',
        'konten_koreksi',
        'status',
    ];

    protected $casts = [
        'field_koreksi' => 'array',
    ];

    public function bacaan(): BelongsTo
    {
        return $this->belongsTo(Bacaan::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(BacaanItem::class, 'target_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(BacaanSection::class, 'target_id');
    }
}
```

### 1.3 Controller - Public
**File:** `backend/app/Http/Controllers/Api/Public/ReportController.php`

```php
<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\BacaanReport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bacaan_id' => 'required|exists:bacaans,id',
            'kategori' => 'required|in:salah_ketik,teks_hilang,terjemahan_salah,lain_lain',
            'jenis_laporan' => 'required|in:bacaan,section,item',
            'target_id' => 'required_if:jenis_laporan,section,item|nullable',
            'field_koreksi' => 'required|array|min:1',
            'field_koreksi.*' => 'string',
            'konten_asli' => 'nullable',
            'konten_koreksi' => 'required',
            'pelapor_nama' => 'nullable|string|max:255',
            'pelapor_email' => 'nullable|email|max:255',
        ]);

        // Validate target exists based on jenis_laporan
        if ($validated['jenis_laporan'] === 'section') {
            $exists = \App\Models\BacaanSection::where('id', $validated['target_id'])
                ->where('bacaan_id', $validated['bacaan_id'])->exists();
            if (!$exists) {
                return response()->json(['error' => 'Section tidak ditemukan'], 404);
            }
        } elseif ($validated['jenis_laporan'] === 'item') {
            $exists = \App\Models\BacaanItem::where('id', $validated['target_id'])
                ->where('bacaan_id', $validated['bacaan_id'])->exists();
            if (!$exists) {
                return response()->json(['error' => 'Item tidak ditemukan'], 404);
            }
        }

        $report = BacaanReport::create($validated);

        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'report' => $report,
        ], 201);
    }
}
```

### 1.4 Controller - Admin
**File:** `backend/app/Http/Controllers/Api/Admin/ReportController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BacaanReport;
use App\Models\Bacaan;
use App\Models\BacaanSection;
use App\Models\BacaanItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BacaanReport::with(['bacaan:id,judul,slug']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('jenis') && $request->jenis !== 'all') {
            $query->where('jenis_laporan', $request->jenis);
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($reports);
    }

    public function show(int $id): JsonResponse
    {
        $report = BacaanReport::with(['bacaan', 'item', 'section'])->findOrFail($id);
        return response()->json($report);
    }

    public function count(): JsonResponse
    {
        $count = BacaanReport::where('status', 'pending')->count();
        return response()->json(['pending_count' => $count]);
    }

    public function setuju(Request $request, int $id): JsonResponse
    {
        $report = BacaanReport::findOrFail($id);

        if ($report->status !== 'pending') {
            return response()->json(['error' => 'Laporan sudah diproses'], 400);
        }

        $fieldKoreksi = $report->field_koreksi ?? [];
        $kontenKoreksi = $report->konten_koreksi;

        switch ($report->jenis_laporan) {
            case 'item':
                $item = BacaanItem::findOrFail($report->target_id);
                foreach ($fieldKoreksi as $field) {
                    if (in_array($field, ['arabic', 'latin', 'terjemahan'])) {
                        $item->$field = $kontenKoreksi[$field] ?? null;
                    }
                }
                $item->save();
                break;

            case 'section':
                $section = BacaanSection::findOrFail($report->target_id);
                if (in_array('judul_section', $fieldKoreksi)) {
                    $section->judul_section = $kontenKoreksi['judul_section'] ?? $section->judul_section;
                }
                $section->save();
                break;

            case 'bacaan':
                $bacaan = Bacaan::findOrFail($report->bacaan_id);
                foreach ($fieldKoreksi as $field) {
                    if (in_array($field, ['judul', 'judul_arab', 'deskripsi'])) {
                        $bacaan->$field = $kontenKoreksi[$field] ?? $bacaan->$field;
                    }
                }
                $bacaan->save();
                break;
        }

        $report->update(['status' => 'disetujui']);

        return response()->json([
            'message' => 'Laporan disetujui dan data telah diperbarui',
            'report' => $report->fresh(),
        ]);
    }

    public function tolak(Request $request, int $id): JsonResponse
    {
        $report = BacaanReport::findOrFail($id);

        if ($report->status !== 'pending') {
            return response()->json(['error' => 'Laporan sudah diproses'], 400);
        }

        $report->update(['status' => 'ditolak']);

        return response()->json([
            'message' => 'Laporan ditolak',
            'report' => $report->fresh(),
        ]);
    }
}
```

### 1.5 Routes
**File:** `backend/routes/api.php`

```php
// Public
use App\Http\Controllers\Api\Public\ReportController;
Route::post('/reports', [ReportController::class, 'store']);

// Admin Protected
use App\Http\Controllers\Api\Admin\ReportController as AdminReportController;

Route::middleware('auth:sanctum')->group(function () {
    // ... existing routes
    Route::get('/admin/reports', [AdminReportController::class, 'index']);
    Route::get('/admin/reports/{id}', [AdminReportController::class, 'show']);
    Route::get('/admin/reports/count', [AdminReportController::class, 'count']);
    Route::post('/admin/reports/{id}/setuju', [AdminReportController::class, 'setuju']);
    Route::post('/admin/reports/{id}/tolak', [AdminReportController::class, 'tolak']);
});
```

---

## Fase 2: Shared Types

### 2.1 TypeScript Types
**File:** `shared-lib/src/types/index.ts` (tambahkan)

```typescript
export type ReportCategory = 'salah_ketik' | 'teks_hilang' | 'terjemahan_salah' | 'lain_lain';
export type ReportJenis = 'bacaan' | 'section' | 'item';
export type ReportStatus = 'pending' | 'disetujui' | 'ditolak';

export interface BacaanReport {
  id: number;
  bacaan_id: number;
  pelapor_nama: string | null;
  pelapor_email: string | null;
  kategori: ReportCategory;
  jenis_laporan: ReportJenis;
  target_id: number | null;
  field_koreksi: string[];
  konten_asli: string | null;
  konten_koreksi: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  bacaan?: Pick<Bacaan, 'id' | 'judul' | 'slug'>;
  item?: Item;
  section?: Section;
}

export interface CreateReportPayload {
  bacaan_id: number;
  kategori: ReportCategory;
  jenis_laporan: ReportJenis;
  target_id?: number;
  field_koreksi: string[];
  konten_asli?: string;
  konten_koreksi: string;
  pelapor_nama?: string;
  pelapor_email?: string;
}
```

---

## Fase 3: Public App - API Client

### 3.1 Report API
**File:** `public-app/src/features/reports/api/index.ts`

```typescript
import { apiClient } from '@/lib/apiClient';
import type { BacaanReport, CreateReportPayload } from '@project/shared';

export const reportApi = {
  create: (data: CreateReportPayload) => 
    apiClient.post<BacaanReport>('/reports', data),
};
```

### 3.2 Report Hooks
**File:** `public-app/src/features/reports/hooks/index.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import { reportApi } from '../api';
import type { CreateReportPayload } from '@project/shared';

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (data: CreateReportPayload) => reportApi.create(data),
  });
};
```

---

## Fase 4: Public App - UI Components

### 4.1 Report Modal Component
**File:** `public-app/src/features/reports/components/ReportModal.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { useCreateReport } from '../hooks';
import type { Item, Section, Bacaan, ReportCategory } from '@project/shared';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'item' | 'section' | 'bacaan';
  target: Item | Section | Bacaan;
  bacaanId: number;
}

const KATEGORI_OPTIONS: { value: ReportCategory; label: string }[] = [
  { value: 'salah_ketik', label: 'Salah Ketik' },
  { value: 'teks_hilang', label: 'Teks Hilang' },
  { value: 'terjemahan_salah', label: 'Terjemahan Salah' },
  { value: 'lain_lain', label: 'Lainnya' },
];

const ITEM_FIELDS = [
  { key: 'arabic', label: 'Arabic' },
  { key: 'latin', label: 'Latin' },
  { key: 'terjemahan', label: 'Terjemahan' },
];

const SECTION_FIELDS = [
  { key: 'judul_section', label: 'Judul Section' },
];

const BACAAN_FIELDS = [
  { key: 'judul', label: 'Judul' },
  { key: 'judul_arab', label: 'Judul Arab' },
  { key: 'deskripsi', label: 'Deskripsi' },
];

export const ReportModal = ({ isOpen, onClose, type, target, bacaanId }: ReportModalProps) => {
  const [kategori, setKategori] = useState<ReportCategory>('salah_ketik');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [kontenKoreksi, setKontenKoreksi] = useState('');
  const [pelaporNama, setPelaporNama] = useState('');
  const [pelaporEmail, setPelaporEmail] = useState('');
  const [mode, setMode] = useState<'langsung' | 'catatan'>('langsung');

  const createReport = useCreateReport();

  useEffect(() => {
    if (isOpen) {
      setKategori('salah_ketik');
      setSelectedFields(type === 'item' ? ['arabic'] : type === 'section' ? ['judul_section'] : ['judul']);
      setKontenKoreksi('');
    }
  }, [isOpen, type]);

  const getFields = () => {
    switch (type) {
      case 'item': return ITEM_FIELDS;
      case 'section': return SECTION_FIELDS;
      case 'bacaan': return BACAAN_FIELDS;
    }
  };

  const getFieldValue = (field: string): string => {
    const t = target as any;
    if (type === 'item') {
      return mode === 'langsung' ? '' : (t[field] || '');
    }
    return t[field] || '';
  };

  const handleSubmit = async () => {
    const kontenAsli: Record<string, string> = {};
    const kontenKoreksiObj: Record<string, string> = {};

    if (mode === 'langsung') {
      selectedFields.forEach(field => {
        kontenKoreksiObj[field] = kontenKoreksi;
      });
    } else {
      selectedFields.forEach(field => {
        kontenAsli[field] = getFieldValue(field);
        kontenKoreksiObj[field] = kontenKoreksi;
      });
    }

    await createReport.mutateAsync({
      bacaan_id: bacaanId,
      kategori,
      jenis_laporan: type,
      target_id: type !== 'bacaan' ? (target as any).id : undefined,
      field_koreksi: selectedFields,
      konten_asli: JSON.stringify(kontenAsli),
      konten_koreksi: JSON.stringify(kontenKoreksiObj),
      pelapor_nama: pelaporNama || undefined,
      pelapor_email: pelaporEmail || undefined,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lapor Kesalahan">
      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'langsung' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setMode('langsung')}
          >
            Benarkan Langsung
          </Button>
          <Button
            variant={mode === 'catatan' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setMode('catatan')}
          >
            Pakai Catatan
          </Button>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategori Masalah</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value as ReportCategory)}
            className="w-full p-2 border rounded-lg"
          >
            {KATEGORI_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Field Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Field yang Dikoreksi</label>
          <div className="flex flex-wrap gap-2">
            {getFields().map(field => (
              <label key={field.key} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFields([...selectedFields, field.key]);
                    } else {
                      setSelectedFields(selectedFields.filter(f => f !== field.key));
                    }
                  }}
                />
                {field.label}
              </label>
            ))}
          </div>
        </div>

        {/* Konten Sekarang (mode catatan) */}
        {mode === 'catatan' && (
          <div>
            <label className="block text-sm font-medium mb-1">Konten Sekarang</label>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
              {selectedFields.map(field => (
                <div key={field}>
                  <span className="font-medium">{getFields().find(f => f.key === field)?.label}:</span>
                  <pre className="whitespace-pre-wrap">{getFieldValue(field)}</pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Koreksi Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === 'langsung' ? 'Koreksi yang Diusulkan' : 'Catatan'}
          </label>
          <textarea
            value={kontenKoreksi}
            onChange={(e) => setKontenKoreksi(e.target.value)}
            className="w-full p-2 border rounded-lg min-h-[100px]"
            placeholder={mode === 'langsung' ? 'Tulis koreksi...' : 'Tulis catatan...'}
          />
        </div>

        {/* Pelapor Info */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Nama (opsional)"
            value={pelaporNama}
            onChange={(e) => setPelaporNama(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email (opsional)"
            value={pelaporEmail}
            onChange={(e) => setPelaporEmail(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>

        {/* Submit */}
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={createReport.isPending || !kontenKoreksi}
        >
          {createReport.isPending ? 'Mengirim...' : 'Kirim Laporan'}
        </Button>
      </div>
    </Modal>
  );
};
```

### 4.2 Long Press Handler Hook
**File:** `public-app/src/hooks/useLongPress.ts`

```typescript
import { useState, useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  duration?: number;
}

export const useLongPress = ({ onLongPress, onClick, duration = 500 }: UseLongPressOptions) => {
  const [showMenu, setShowMenu] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = useCallback(() => {
    timerRef.current = setTimeout(() => {
      onLongPress();
      setShowMenu(true);
    }, duration);
  }, [onLongPress, duration]);

  const handleMouseUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!showMenu && onClick) {
      onClick();
    }
    setShowMenu(false);
  }, [showMenu, onClick]);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  return {
    showMenu,
    closeMenu,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleMouseDown,
      onTouchEnd: handleMouseUp,
      onClick: handleClick,
    },
  };
};
```

### 4.3 Modify ReadingItem Component
**File:** `public-app/src/features/reader/components/ReadingItem.tsx` (modifikasi)

Tambahkan:
```typescript
import { useLongPress } from '@/hooks/useLongPress';
import { ReportModal } from '@/features/reports/components/ReportModal';
// ... existing imports

export const ReadingItem = ({ item, className }: ReadingItemProps) => {
  const [showReportModal, setShowReportModal] = useState(false);
  
  const { showMenu, closeMenu, handlers } = useLongPress({
    onLongPress: () => setShowReportModal(true),
  });

  return (
    <>
      <div {...handlers} className="relative">
        {/* Existing content */}
        {renderContent()}
        {/* ... */}
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 top-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 py-1">
          <button
            onClick={() => { closeMenu(); setShowReportModal(true); }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            📝 Laporkan Kesalahan
          </button>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="item"
        target={item}
        bacaanId={item.bacaan_id}
      />
    </>
  );
};
```

### 4.4 Modify ReaderMenuPage - Add Menu for Bacaan & Section
**File:** `public-app/src/pages/reader/ReaderMenuPage.tsx` (modifikasi)

Tambahkan menu tiga titik di header bacaan:
```typescript
import { ReportModal } from '@/features/reports/components/ReportModal';
import { useState } from 'react';
// ...

export const ReaderMenuPage = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'bacaan' | 'section'>('bacaan');
  const [reportTarget, setReportTarget] = useState<any>(null);
  // ... existing code

  const openReportModal = (type: 'bacaan' | 'section', target: any) => {
    setReportType(type);
    setReportTarget(target);
    setShowReportModal(true);
  };

  return (
    <>
      {/* Header bacaan - tambahkan icon ... */}
      <div className="text-center py-6 mb-6 ...">
        {/* ... existing content ... */}
        
        {/* Menu tiga titik */}
        <div className="absolute top-8 right-4">
          <button
            onClick={() => {
              const menu = document.createElement('div');
              menu.innerHTML = `
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                  <button id="report-btn" class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                    📝 Lapor Kesalahan
                  </button>
                  <button id="bookmark-btn" class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                    ${isBookmarked ? '🔖 Hapus Bookmark' : '🔖 Bookmark'}
                  </button>
                </div>
              `;
              document.body.appendChild(menu);
              
              menu.querySelector('#report-btn')?.addEventListener('click', () => {
                openReportModal('bacaan', bacaan);
                menu.remove();
              });
              menu.querySelector('#bookmark-btn')?.addEventListener('click', () => {
                handleToggleBookmark();
                menu.remove();
              });
              
              setTimeout(() => {
                document.addEventListener('click', () => menu.remove(), { once: true });
              }, 0);
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Section items - tambahkan icon di samping judul */}
      {bacaan.sections?.map((section) => (
        <Link key={section.id} to={`/bacaan/${slug}/${section.slug_section}`}>
          <div className="group flex items-center gap-4 p-4 rounded-xl ...">
            {/* ... existing content ... */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openReportModal('section', section);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ⋮
            </button>
          </div>
        </Link>
      ))}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        type={reportType}
        target={reportTarget}
        bacaanId={bacaan.id}
      />
    </>
  );
};
```

---

## Fase 5: Admin Panel - API Client

### 5.1 Report API
**File:** `admin-panel/src/features/reports/api/index.ts`

```typescript
import { apiClient } from '@/lib/apiClient';
import type { BacaanReport, PaginatedResponse } from '@project/shared';

interface ReportListParams {
  status?: 'pending' | 'disetujui' | 'ditolak' | 'all';
  jenis?: 'bacaan' | 'section' | 'item' | 'all';
  per_page?: number;
  page?: number;
}

export const reportApi = {
  list: (params?: ReportListParams) => 
    apiClient.get<PaginatedResponse<BacaanReport>>('/admin/reports', { params }),
  
  get: (id: number) => 
    apiClient.get<BacaanReport>(`/admin/reports/${id}`),
  
  getCount: () => 
    apiClient.get<{ pending_count: number }>('/admin/reports/count'),
  
  setuju: (id: number) => 
    apiClient.post<BacaanReport>(`/admin/reports/${id}/setuju`),
  
  tolak: (id: number) => 
    apiClient.post<BacaanReport>(`/admin/reports/${id}/tolak`),
};
```

### 5.2 Report Hooks
**File:** `admin-panel/src/features/reports/hooks/index.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '../api';

export const useReportList = (params?: Parameters<typeof reportApi.list>[0]) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportApi.list(params),
  });
};

export const useReportDetail = (id: number) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportApi.get(id),
    enabled: !!id,
  });
};

export const useReportCount = () => {
  return useQuery({
    queryKey: ['reports', 'count'],
    queryFn: () => reportApi.getCount(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useSetujuReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reportApi.setuju(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useTolakReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reportApi.tolak(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
```

---

## Fase 6: Admin Panel - UI Pages

### 6.1 Reports List Page
**File:** `admin-panel/src/pages/reports/ReportsListPage.tsx`

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReportList } from '@/features/reports/hooks';
import { Button, Card } from '@/components/ui';

export const ReportsListPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jenisFilter, setJenisFilter] = useState<string>('all');
  
  const { data, isLoading } = useReportList({
    status: statusFilter as any,
    jenis: jenisFilter as any,
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getJenisLabel = (jenis: string) => {
    const labels = {
      bacaan: 'Bacaan',
      section: 'Section',
      item: 'Item',
    };
    return labels[jenis as keyof typeof labels] || jenis;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Bacaan</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>

        <select
          value={jenisFilter}
          onChange={(e) => setJenisFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">Semua Jenis</option>
          <option value="bacaan">Bacaan</option>
          <option value="section">Section</option>
          <option value="item">Item</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Tanggal</th>
              <th className="text-left p-4">Jenis</th>
              <th className="text-left p-4">Target</th>
              <th className="text-left p-4">Kategori</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
            ) : (
              data?.data.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {new Date(report.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4">{getJenisLabel(report.jenis_laporan)}</td>
                  <td className="p-4">
                    {report.jenis_laporan === 'bacaan' ? (
                      <span>{report.bacaan?.judul}</span>
                    ) : report.target_id ? (
                      <Link 
                        to={`/bacaan/${report.bacaan?.slug}`}
                        className="text-primary-600 hover:underline"
                      >
                        {report.jenis_laporan} #{report.target_id}
                      </Link>
                    ) : '-'}
                  </td>
                  <td className="p-4">
                    {report.kategori.replace('_', ' ')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link to={`/reports/${report.id}`}>
                      <Button variant="outline" size="sm">Lihat</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      {data?.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.last_page }, (_, i) => (
            <Button
              key={i}
              variant={data.current_page === i + 1 ? 'primary' : 'outline'}
              size="sm"
              // onClick={() => ...}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 6.2 Report Detail Page
**File:** `admin-panel/src/pages/reports/ReportDetailPage.tsx`

```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { useReportDetail, useSetujuReport, useTolakReport } from '@/features/reports/hooks';
import { Button, Card } from '@/components/ui';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

export const ReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading } = useReportDetail(Number(id));
  const setujuMutation = useSetujuReport();
  const tolakMutation = useTolakReport();

  const [editedKoreksi, setEditedKoreksi] = useState<Record<string, string>>({});

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!report) return <div className="p-6">Laporan tidak ditemukan</div>;

  const parseJsonField = (json: string | null): Record<string, string> => {
    if (!json) return {};
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  };

  const kontenAsli = parseJsonField(report.konten_asli);
  const kontenKoreksi = parseJsonField(report.konten_koreksi);
  const fields = report.field_koreksi || [];

  const handleSetuju = async () => {
    await setujuMutation.mutateAsync(Number(id));
    navigate('/reports');
  };

  const handleTolak = async () => {
    await tolakMutation.mutateAsync(Number(id));
    navigate('/reports');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/reports')} className="mb-4">
        ← Kembali
      </Button>

      <h1 className="text-2xl font-bold mb-6">Detail Laporan #{report.id}</h1>

      {/* Info Pelapor */}
      <Card className="mb-4">
        <h2 className="font-semibold mb-2">Info Pelapor</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Nama: {report.pelapor_nama || '-'}</div>
          <div>Email: {report.pelapor_email || '-'}</div>
          <div>Tanggal: {new Date(report.created_at).toLocaleDateString('id-ID')}</div>
        </div>
      </Card>

      {/* Detail Laporan */}
      <Card className="mb-4">
        <h2 className="font-semibold mb-2">Detail Laporan</h2>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>Jenis: {report.jenis_laporan}</div>
          <div>Target ID: {report.target_id || '-'}</div>
          <div>Kategori: {report.kategori.replace('_', ' ')}</div>
          <div>Status: <span className="font-bold">{report.status}</span></div>
        </div>

        {/* Field yang dikoreksi */}
        <div className="mb-4">
          <h3 className="font-medium mb-1">Field yang Dikoreksi:</h3>
          <div className="flex gap-2">
            {fields.map(field => (
              <span key={field} className="px-2 py-1 bg-gray-100 rounded text-sm">{field}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Konten Asli */}
      {report.jenis_laporan === 'item' && (
        <Card className="mb-4">
          <h2 className="font-semibold mb-2">Konten Asli</h2>
          {fields.map(field => (
            <div key={field} className="mb-4">
              <h4 className="text-sm font-medium mb-1">{field}</h4>
              <div 
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                dangerouslySetInnerHTML={{ __html: kontenAsli[field] || '-' }}
              />
            </div>
          ))}
        </Card>
      )}

      {/* Konten Koreksi - Editable */}
      <Card className="mb-4">
        <h2 className="font-semibold mb-2">Koreksi (Editable)</h2>
        {report.status === 'pending' ? (
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field}>
                <h4 className="text-sm font-medium mb-1">{field}</h4>
                <RichTextEditor
                  value={kontenKoreksi[field] || ''}
                  onChange={(html) => setEditedKoreksi({ ...editedKoreksi, [field]: html })}
                  dir={field === 'arabic' ? 'rtl' : 'ltr'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field}>
                <h4 className="text-sm font-medium mb-1">{field}</h4>
                <div 
                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-sm"
                  dangerouslySetInnerHTML={{ __html: kontenKoreksi[field] || '-' }}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      {report.status === 'pending' && (
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleSetuju}
            disabled={setujuMutation.isPending}
            className="flex-1"
          >
            {setujuMutation.isPending ? 'Memproses...' : '✓ Setuju & Simpan'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleTolak}
            disabled={tolakMutation.isPending}
            className="flex-1"
          >
            {tolakMutation.isPending ? 'Memproses...' : '✗ Tolak'}
          </Button>
        </div>
      )}
    </div>
  );
};
```

### 6.3 Sidebar - Add Reports Menu with Badge
**File:** `admin-panel/src/components/layout/Sidebar.tsx` (modifikasi)

```typescript
import { useReportCount } from '@/features/reports/hooks';

const NavItem = ({ to, icon, label, active, badge }: NavItemProps) => {
    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                active
                    ? "bg-primary/20 text-text-main dark:text-white"
                    : "text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
        >
            <span className={clsx(
                "material-symbols-outlined",
                active
                    ? "text-stone-800 dark:text-yellow-200"
                    : "text-text-secondary group-hover:text-text-main dark:group-hover:text-gray-200"
            )}>{icon}</span>
            <span className={clsx("text-sm", active ? "font-bold" : "font-medium")}>{label}</span>
            {badge && badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {badge}
                </span>
            )}
        </Link>
    );
};

export const Sidebar = () => {
    const location = useLocation();
    const { data: countData } = useReportCount();

    return (
        <aside className="w-64 ...">
            {/* ... existing code ... */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 flex flex-col gap-1">
                <NavItem to="/dashboard" icon="dashboard" label="Dashboard" active={isActive('/dashboard')} />
                <NavItem to="/bacaan" icon="book_2" label="Bacaan" active={isActive('/bacaan')} />
                <NavItem 
                    to="/reports" 
                    icon="flag" 
                    label="Laporan" 
                    active={isActive('/reports')} 
                    badge={countData?.pending_count}
                />
                {/* ... */}
            </div>
        </aside>
    );
};
```

### 6.4 Admin Routes
**File:** `admin-panel/src/App.tsx` (modifikasi)

```typescript
import { ReportsListPage } from '@/pages/reports/ReportsListPage';
import { ReportDetailPage } from '@/pages/reports/ReportDetailPage';

// Add routes
<Route path="/reports" element={<ReportsListPage />} />
<Route path="/reports/:id" element={<ReportDetailPage />} />
```

---

## Ringkasan Fase

| Fase | Komponen | Deskripsi |
|------|----------|-----------|
| 1 | Database & Backend | Migration, Model, Controllers, Routes |
| 2 | Shared Types | TypeScript interfaces |
| 3 | Public App - API | API client & hooks |
| 4 | Public App - UI | ReportModal, LongPress hook, Modifikasi ReadingItem & ReaderMenuPage |
| 5 | Admin - API | API client & hooks |
| 6 | Admin - UI | ReportsListPage, ReportDetailPage, Sidebar badge, Routes |

---

## Catatan Implementasi

1. **Rich Text Editor di Public App**: Menggunakan komponen `RichTextEditor` yang sama dengan admin panel (Lexical), tapi dengan konfigurasi lebih sederhana.

2. **Validasi Target**: Saat submit laporan, backend memvalidasi bahwa target_id benar-benar milik bacaan_id yang sama (mencegah lintas-bacaan).

3. **Atomic Transactions**: Saat "Setuju", gunakan DB transaction untuk memastikan konsistensi data.

4. **Cache**: Jika menggunakan cache untuk bacaan, invalidasi cache setelah approve laporan.

5. **Mobile UX**: Long press duration 500ms cukup untuk mencegah accidental trigger, tapi bisa disesuaikan.
