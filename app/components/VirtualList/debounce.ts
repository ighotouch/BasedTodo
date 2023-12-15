export type DebounceFunction = (func: () => void, delay: number) => void;

export const debounce: DebounceFunction = (func: () => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  };