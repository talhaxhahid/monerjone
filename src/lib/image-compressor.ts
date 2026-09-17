/**
 * Client-Side Image Compression using HTML5 Canvas & WebP
 * Resizes large camera/phone photos (e.g. 5MB-10MB) to maximum 800px and converts to WebP at 78% quality.
 * Resulting payload is typically 30KB - 70KB with crystal clear portrait quality.
 */

export async function compressImageToWebP(
  fileOrDataUrl: File | string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === 'undefined') {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let width = img.width || 400;
          let height = img.height || 400;

          // Calculate aspect ratio preserving dimensions
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            if (typeof fileOrDataUrl === 'string') {
              resolve(fileOrDataUrl);
            } else {
              reject(new Error('Could not get canvas context'));
            }
            return;
          }

          // Smooth resizing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP export
          try {
            const webpDataUrl = canvas.toDataURL('image/webp', quality);
            if (webpDataUrl && webpDataUrl.startsWith('data:image/webp')) {
              resolve(webpDataUrl);
              return;
            }
          } catch {
            // WebP not supported or canvas tainted, try JPEG
          }

          try {
            const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
            if (jpegDataUrl) {
              resolve(jpegDataUrl);
              return;
            }
          } catch {
            // If toDataURL failed on canvas, fallback
          }

          if (typeof fileOrDataUrl === 'string') {
            resolve(fileOrDataUrl);
          } else {
            resolve(img.src);
          }
        } catch (canvasErr) {
          if (typeof fileOrDataUrl === 'string') {
            resolve(fileOrDataUrl);
          } else {
            reject(canvasErr);
          }
        }
      };

      img.onerror = (err) => {
        if (typeof fileOrDataUrl === 'string') {
          resolve(fileOrDataUrl);
        } else {
          reject(err);
        }
      };

      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            img.src = e.target.result as string;
          } else {
            reject(new Error('FileReader returned empty result'));
          }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(fileOrDataUrl);
      }
    } catch (outerErr) {
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(outerErr);
      }
    }
  });
}
