export const Key = {
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
} as const;

export type KeyValue = (typeof Key)[keyof typeof Key];
