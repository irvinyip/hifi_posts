import imageCompression from 'browser-image-compression';

export const resizeImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: parseInt(process.env.NEXT_PUBLIC_IMAGE_MAX_WIDTH || '800'),
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error during image compression:', error);
    throw error;
  }
};