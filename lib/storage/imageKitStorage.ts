import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export interface ImageKitUploadResponse {
  url: string;
  fileId: string;
  name: string;
}

/**
 * Uploads a file to ImageKit
 * @param fileBuffer The file buffer to upload
 * @param fileName The name of the file
 * @param folder Optional folder name in ImageKit
 */
export async function uploadToImageKit(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "asalways"
): Promise<ImageKitUploadResponse> {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  } catch (error: any) {
    console.error("ImageKit upload error:", error);
    throw new Error(error.message || "Failed to upload to ImageKit");
  }
}

/**
 * Deletes a file from ImageKit
 * @param fileId The ID of the file to delete
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error: any) {
    console.error("ImageKit delete error:", error);
    throw new Error(error.message || "Failed to delete from ImageKit");
  }
}

export default imagekit;
