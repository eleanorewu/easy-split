export async function imageFileToSquareDataUrl(
  file: File,
  size = 128,
  {
    mimeType = 'image/webp',
    quality = 0.85,
  }: { mimeType?: string; quality?: number } = {}
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('不支援的檔案格式');
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('無法處理圖片');

  const srcSize = Math.min(bitmap.width, bitmap.height);
  const sx = Math.floor((bitmap.width - srcSize) / 2);
  const sy = Math.floor((bitmap.height - srcSize) / 2);

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(bitmap, sx, sy, srcSize, srcSize, 0, 0, size, size);

  try {
    return canvas.toDataURL(mimeType, quality);
  } catch {
    return canvas.toDataURL('image/png');
  }
}

