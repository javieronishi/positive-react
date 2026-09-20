export interface Phrase {
  id: number;
  text: string;
  lang: string;
  category_id: number;
  author_id: number | null;
}

export interface HistoryItem {
  key: string;
  phrase: Phrase;
  timestamp: string;
}

