
export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AyahBase {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface MergedAyah extends AyahBase {
  textArabic: string;
  textEnglish: string;
  textUrdu: string;
}

export interface QuranEditionResponse {
  data: [
    {
      name: string;
      englishName: string;
      format: string;
      language: string;
      ayahs: AyahBase[];
    }, // Arabic
    {
      name: string;
      englishName: string;
      format: string;
      language: string;
      ayahs: AyahBase[];
    }, // English
    {
      name: string;
      englishName: string;
      format: string;
      language: string;
      ayahs: AyahBase[];
    }  // Urdu
  ];
  status: string;
  code: number;
}

export interface SurahListResponse {
  data: SurahMeta[];
  status: string;
  code: number;
}

// -- Auth & User Types --

export interface HistoryItem {
  surahNumber: number;
  surahName: string;
  englishName: string;
  lastReadAyah?: number; // Future proofing
  timestamp: number;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  password?: string; // In a real app, never store plain text!
  history: HistoryItem[];
}
