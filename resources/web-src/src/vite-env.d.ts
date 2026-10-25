/// <reference types="vite/client" />

declare module 'virtual:translations' {
  const translations: Record<string, Record<number, string>>;
  export default translations;
}
