// src/features/gallery/utils/imageUtils.ts
export const imageUtils = {
  compressImage: async (file: File): Promise<File> => {
    // Image compression logic
    console.log(file);
    return file;
  },

  generateThumbnail: async (file: File): Promise<string> => {
    console.log(file);
    return "thumbnail-url";
  },

  validateImage: (file: File): boolean => {
    console.log(file);
    return true;
  },
};
