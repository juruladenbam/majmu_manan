// Common Interfaces

export interface Bacaan {
  id: number;
  judul: string;
  judul_arab: string | null;
  slug: string;
  gambar: string | null;
  deskripsi: string | null;
  sections?: Section[];
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
