import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface PhotoUploadResult {
  success: boolean;
  fileName: string;
}

class PhotoService {
  /**
   * Redimensiona una imatge mantenint l'aspect ratio
   */
  private async resizeImage(
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calcula les noves dimensions mantenint l'aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibuixa la imatge redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converteix a blob i després a File
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              resolve(file); // Fallback si no es pot redimensionar
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Valida si el fitxer és una imatge vàlida
   */
  private validateImageFile(file: File): void {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Tipus de fitxer no vàlid. Només s'accepten: JPG, PNG, WebP"
      );
    }

    if (file.size > maxSize) {
      throw new Error("El fitxer és massa gran. Màxim 10MB");
    }
  }

  /**
   * Genera nom del fitxer basat en la ID de la localització
   */
  private generateFileNameFromLocationId(locationId: string): string {
    return `locations/${locationId}.jpg`;
  }

  /**
   * Puja una foto a Firebase Storage amb la ID de la localització com a nom
   */
  async uploadPhotoForLocation(
    file: File,
    locationId: string
  ): Promise<PhotoUploadResult> {
    try {
      console.log("📸 Iniciant pujada de foto per localització:", locationId);

      // Valida el fitxer
      this.validateImageFile(file);

      // Redimensiona la imatge per optimitzar l'emmagatzematge
      const resizedFile = await this.resizeImage(file);
      console.log(
        `📏 Imatge redimensionada: ${file.size} bytes → ${resizedFile.size} bytes`
      );

      // Genera nom del fitxer amb la ID de la localització
      const fileName = this.generateFileNameFromLocationId(locationId);

      // Crea referència a Firebase Storage
      const storageRef = ref(storage, fileName);

      // Puja el fitxer
      console.log("☁️ Pujant fitxer a Firebase Storage...");
      await uploadBytes(storageRef, resizedFile);

      console.log("✅ Foto pujada amb èxit per localització:", locationId);

      return {
        success: true,
        fileName,
      };
    } catch (error) {
      console.error("❌ Error pujant foto:", error);
      throw new Error(`Error pujant la foto: ${(error as Error).message}`);
    }
  }

  /**
   * Obté la URL de la foto d'una localització
   */
  async getPhotoUrl(locationId: string): Promise<string | null> {
    try {
      const fileName = this.generateFileNameFromLocationId(locationId);
      const storageRef = ref(storage, fileName);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch {
      // Si no troba la imatge, retorna null
      return null;
    }
  }

  /**
   * Crea una URL temporal per previsualitzar la imatge abans de pujar-la
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Allibera la memòria d'una URL de previsualització
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const photoService = new PhotoService();
