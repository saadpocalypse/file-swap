import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";

export const ICO_SIZES = {
    s: 16,
    m: 32,
    l: 48
};

export async function convertImage(inputPath, targetFormat, icoSize = null) {
    try {
        const parsedPath = path.parse(inputPath);
        const outputPath = path.join(
            parsedPath.dir,
            `${parsedPath.name}.${targetFormat}`
        );

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        if (targetFormat === "ico") {
            if (!icoSize) {
                throw new Error("ICO conversion requires a size option: s (16x16), m (32x32), or l (48x48)");
            }

            const size = ICO_SIZES[icoSize];
            if (!size) {
                throw new Error(`Invalid ICO size: ${icoSize}. Use s (16x16), m (32x32), or l (48x48)`);
            }

            await image
                .resize(size, size)
                .toFile(outputPath);
        } else {
            await image
                .toFormat(targetFormat, {
                    quality: 90,
                    mozjpeg: targetFormat === "jpg" || targetFormat === "jpeg",
                    compressionLevel: targetFormat === "png" ? 9 : 6,
                })
                .toFile(outputPath);
        }

        return outputPath;
    } catch (error) {
        throw new Error(`Failed to convert image: ${error.message}`);
    }
}
