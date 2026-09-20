import type { Phrase } from "../types/phrase";

const API_URL = "https://www.positive-api.online/phrase/esp";

export async function getPhrase(): Promise<Phrase> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudo obtener la frase");
  }

  const data: Phrase = await response.json();

  return data;
}

