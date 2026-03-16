// Common Interfaces

export interface Bacaan {
  id: number;
  judul: string;
  judul_arab: string | null;
  slug: string;
  gambar: string | null;
  deskripsi: string | null;
  sections?: Section[];
  sections_count?: number;
  is_multi_section?: boolean;
  items?: Item[]; // For single-section bacaans
}

export interface Section {
  id: number;
  bacaan_id: number;
  judul_section: string;
  slug_section: string;
  urutan: number;
  items?: Item[];
}

export interface Item {
  id: number;
  bacaan_id: number;
  section_id: number | null;
  arabic: string | null;
  latin: string | null;
  terjemahan: string | null;
  indonesia: string | null;
  tipe_tampilan: 'text' | 'syiir' | 'judul_tengah' | 'image' | 'keterangan';
  urutan: number;
}

// Dashboard
export interface DashboardStats {
  total_bacaan: number;
  total_sections: number;
  total_items: number;
  multi_section_count: number;
}

export interface RecentActivity {
  id: number;
  judul: string;
  slug: string;
  updated_at: string;
  created_at: string;
  latest_activity?: string;
  change_source?: 'bacaan' | 'section' | 'item';
  change_preview?: string;
}

export interface ContentHealth {
  bacaan_without_image: number;
  empty_sections: number;
  items_without_translation: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_activity: RecentActivity[];
  content_health: ContentHealth;
  maintenance_mode: boolean;
}

// Reports
export type ReportCategory = 'salah_ketik' | 'teks_hilang' | 'terjemahan_salah' | 'lain_lain';
export type ReportJenis = 'bacaan' | 'section' | 'item';
export type ReportStatus = 'pending' | 'disetujui' | 'ditolak';
export type ReportModeKoreksi = 'langsung' | 'catatan';

export interface BacaanReport {
  id: number;
  bacaan_id: number;
  pelapor_nama: string | null;
  pelapor_email: string | null;
  kategori: ReportCategory;
  jenis_laporan: ReportJenis;
  mode_koreksi: ReportModeKoreksi;
  target_id: number | null;
  field_koreksi: string[];
  konten_asli: any | null; // Store as object/array
  konten_koreksi: any | null; // Store as object/array
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
  mode_koreksi: ReportModeKoreksi;
  target_id?: number;
  field_koreksi: string[];
  konten_asli?: string; // stringified JSON
  konten_koreksi: string; // stringified JSON
  pelapor_nama?: string;
  pelapor_email?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
