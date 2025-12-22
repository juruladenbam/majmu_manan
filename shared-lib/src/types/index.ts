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
