const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESSION_SIZE_BYTES = 1.5 * 1024 * 1024;

export const compress_image_file = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file);
        const largest_dimension = Math.max(bitmap.width, bitmap.height);
        const scale = Math.min(1, MAX_DIMENSION / largest_dimension);

        if (scale >= 1 && file.size <= SKIP_COMPRESSION_SIZE_BYTES) {
            bitmap.close();
            return file;
        }

        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
            bitmap.close();
            return file;
        }

        context.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
        );

        if (!blob) {
            return file;
        }

        return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
            type: "image/jpeg",
        });
    } catch {
        return file;
    }
};
