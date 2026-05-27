import { IMAGE_RULES } from "../utils/constants.js";

export class ImageImporter {
  async importFile(file) {
    this.validateFile(file);
    const dataUrl = await this.readAsDataUrl(file);
    const image = await this.loadImage(dataUrl);

    if (image.naturalWidth < IMAGE_RULES.minSide || image.naturalHeight < IMAGE_RULES.minSide) {
      throw new Error(`圖片最短邊需至少 ${IMAGE_RULES.minSide}px`);
    }

    return {
      image,
      name: file.name.replace(/\.[^.]+$/, "")
    };
  }

  validateFile(file) {
    if (!file) throw new Error("請選擇圖片檔案");
    if (!IMAGE_RULES.acceptedTypes.includes(file.type)) {
      throw new Error("支援 JPG、PNG、WebP、GIF、BMP，不支援 SVG");
    }
    if (file.size > IMAGE_RULES.maxBytes) {
      throw new Error("圖片大小需小於 10MB");
    }
  }

  readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("讀取圖片失敗"));
      reader.readAsDataURL(file);
    });
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("載入圖片失敗"));
      image.src = src;
    });
  }
}
