/** 讨论正文插图：演示环境压缩为 Data URL 存入本地 */

export const RICH_EDITOR_IMAGE_MAX_FILE_BYTES = 3 * 1024 * 1024;
export const RICH_EDITOR_IMAGE_MAX_EDGE = 1400;
export const RICH_EDITOR_IMAGE_MAX_DATA_URL_CHARS = 900_000;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const isAcceptedEditorImage = (file: File): boolean =>
  ACCEPTED_IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/');

export const compressImageForEditor = async (file: File): Promise<string> => {
  if (!isAcceptedEditorImage(file)) {
    throw new Error('INVALID_TYPE');
  }
  if (file.size > RICH_EDITOR_IMAGE_MAX_FILE_BYTES) {
    throw new Error('TOO_LARGE');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('LOAD_FAILED'));
      el.src = objectUrl;
    });

    const scale = Math.min(1, RICH_EDITOR_IMAGE_MAX_EDGE / img.naturalWidth, RICH_EDITOR_IMAGE_MAX_EDGE / img.naturalHeight);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('CANVAS_FAILED');
    ctx.drawImage(img, 0, 0, width, height);

    const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    let quality = mime === 'image/jpeg' ? 0.88 : undefined;
    let dataUrl = canvas.toDataURL(mime, quality);

    if (mime === 'image/jpeg' && quality !== undefined) {
      while (dataUrl.length > RICH_EDITOR_IMAGE_MAX_DATA_URL_CHARS && quality > 0.45) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
    }

    if (dataUrl.length > RICH_EDITOR_IMAGE_MAX_DATA_URL_CHARS) {
      throw new Error('TOO_LARGE_AFTER_COMPRESS');
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
