import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * HTML 엔티티와 특수 문자를 일반 텍스트로 변환하는 함수
 * @param text 변환할 텍스트
 * @returns 변환된 텍스트
 */
export const decodeSpecialCharacters = (text: string): string => {
  if (!text) return "";

  // HTML 엔티티 디코딩
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  let decodedText = textarea.value;

  // 특수 문자 변환 맵
  const specialCharMap: Record<string, string> = {
    "&#8211;": "-",
    "&#8212;": "—",
    "&#8216;": "'",
    "&#8217;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8230;": "...",
    "&#8482;": "™",
    "&#169;": "©",
    "&#174;": "®",
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
  };

  // 특수 문자 변환
  Object.entries(specialCharMap).forEach(([entity, char]) => {
    decodedText = decodedText.replace(new RegExp(entity, "g"), char);
  });

  return decodedText;
};
