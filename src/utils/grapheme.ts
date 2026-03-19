export function firstGrapheme(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Prefer Intl.Segmenter for correct emoji/grapheme clustering.
  const Seg = (Intl as any).Segmenter as undefined | (new (locale?: string, options?: any) => any);
  if (Seg) {
    const seg = new Seg(undefined, { granularity: 'grapheme' });
    const it = seg.segment(trimmed)[Symbol.iterator]();
    const first = it.next();
    return first?.value?.segment ?? '';
  }

  // Fallback: code-point based (may split complex emoji sequences).
  return Array.from(trimmed)[0] ?? '';
}

