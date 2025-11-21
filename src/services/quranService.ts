import type { QuranEditionResponse, SurahListResponse, MergedAyah, SurahMeta } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

// The specific Uthmani Bismillah string to look for and remove
const BISMILLAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export const fetchSurahList = async (): Promise<SurahMeta[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) throw new Error('Failed to fetch surah list');
    const json: SurahListResponse = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching surah list:", error);
    throw error;
  }
};

export const fetchSurahData = async (surahNumber: number): Promise<MergedAyah[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.asad,ur.jalandhry`
    );
    
    if (!response.ok) throw new Error('Failed to fetch surah data');
    
    const json: QuranEditionResponse = await response.json();
    
    const arabicAyahs = json.data[0].ayahs;
    const englishAyahs = json.data[1].ayahs;
    const urduAyahs = json.data[2].ayahs;

    // Merge the three editions into a single array of Ayah objects
    const merged: MergedAyah[] = arabicAyahs.map((ayah, index) => {
      let textArabic = ayah.text;

      // Remove Bismillah from the start of the first ayah of surahs 
      // (except Surah 1: Al-Fatiha and Surah 9: At-Tawbah)
      // This prevents double Bismillah when we add it as a header.
      if (surahNumber !== 1 && surahNumber !== 9 && index === 0) {
         if (textArabic.startsWith(BISMILLAH_TEXT)) {
            textArabic = textArabic.replace(BISMILLAH_TEXT, '').trim();
         }
      }

      return {
        ...ayah,
        textArabic,
        textEnglish: englishAyahs[index]?.text || '',
        textUrdu: urduAyahs[index]?.text || '',
      };
    });

    return merged;
  } catch (error) {
    console.error("Error fetching surah data:", error);
    throw error;
  }
};