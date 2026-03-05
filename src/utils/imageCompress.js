/**
 * 画像の Data URL をリサイズ・圧縮して localStorage の容量を抑える。
 * 長辺を maxSize ピクセルに収め、JPEG 品質 quality で圧縮する。
 * @param {string} dataUrl - 元画像の Data URL（image/*）
 * @param {{ maxSize?: number, quality?: number }} [opts] - maxSize: 長辺の最大px（既定 1200）, quality: 0〜1（既定 0.78, localStorage 容量対策のためやや強め）
 * @returns {Promise<string>} 圧縮後の Data URL（image/jpeg）
 */
export function compressImageDataUrl(dataUrl, opts = {}) {
  const maxSize = opts.maxSize ?? 1200;
  const quality = opts.quality ?? 0.78;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w <= maxSize && h <= maxSize) {
          w = img.naturalWidth;
          h = img.naturalHeight;
        } else if (w >= h) {
          w = maxSize;
          h = Math.round((img.naturalHeight * maxSize) / img.naturalWidth);
        } else {
          h = maxSize;
          w = Math.round((img.naturalWidth * maxSize) / img.naturalHeight);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const result = canvas.toDataURL('image/jpeg', quality);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    img.src = dataUrl;
  });
}
