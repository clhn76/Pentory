/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef } from "react";

/**
 * 지정된 지연 시간 후에 콜백 함수를 실행하는 디바운스 훅
 *
 * @template T - 디바운스할 함수 타입
 * @param {T} callback - 디바운스할 콜백 함수
 * @param {number} delay - 디바운스 지연 시간(밀리초)
 * @returns {(...args: Parameters<T>) => void} - 디바운스된 콜백 함수
 *
 * @example
 * // 사용 예시
 * const handleSearch = useDebounce((value) => {
 *   // 검색 로직 실행
 * }, 500);
 *
 * // 이벤트 핸들러에서 사용
 * const onChange = (e) => {
 *   handleSearch(e.target.value);
 * };
 */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};
