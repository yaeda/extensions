import axios from "axios";
import { downloadAudio, getWordAudioPath } from "../../audio";
import { DicionaryType } from "../../consts";
import { TranslateTypeResult } from "../../types";
import { IcibaDictionaryResult } from "./interface";

export function icibaDictionary(word: string): Promise<TranslateTypeResult> {
  const url = "http://dict-co.iciba.com/api/dictionary.php";
  const params = {
    key: "0EAE08A016D6688F64AB3EBB2337BFB0",
    type: "json",
    w: word,
  };

  return new Promise((resolve) => {
    axios
      .get(url, { params })
      .then((response) => {
        resolve({
          type: DicionaryType.Iciba,
          result: response.data,
        });
      })
      .catch((error) => {
        resolve({
          type: DicionaryType.Iciba,
          result: null,
          errorInfo: {
            errorCode: error.response.status,
            errorMessage: error.response.statusText,
          },
        });
      });
  });
}

// function download icicba audio file
export async function downloadIcibaWordAudio(word: string, callback?: () => void) {
  try {
    const icibaResult = await icibaDictionary(word);
    const icibaDictionaryResult = icibaResult.result as IcibaDictionaryResult;
    const symbol = icibaDictionaryResult.symbols[0];
    const phoneticUrl = symbol.ph_am_mp3.length
      ? symbol.ph_am_mp3
      : symbol.ph_tts_mp3.length
      ? symbol.ph_tts_mp3
      : symbol.ph_en_mp3;
    if (phoneticUrl.length) {
      const audioPath = getWordAudioPath(word);
      downloadAudio(phoneticUrl, audioPath, callback);
    }

    console.log(`iciba dictionary result: ${JSON.stringify(icibaDictionaryResult, null, 4)}`);
  } catch (error) {
    console.error(`download iciba audio error: ${error}`);
  }
}
