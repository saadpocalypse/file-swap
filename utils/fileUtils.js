import path from 'path';

export const SUPPORTED_CONVERSIONS = {
    'image': {
        from: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        to: ['jpg', 'jpeg', 'png', 'webp', 'ico']
    },
    'document': {
        from: ['docx'],
        to: ['pdf']
    },
    'text': {
        from: ['txt', 'md', 'json', 'yaml', 'csv'],
        to: ['txt', 'md', 'json', 'yaml', 'csv']
    }
};

export function getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase().slice(1);
}

export function getFileCategory(extension) {
    for (const [category, formats] of Object.entries(SUPPORTED_CONVERSIONS)) {
        if (formats.from.includes(extension)) {
            return category;
        }
    }
    return null;
}

export function isConversionPossible(sourceExt, targetExt) {
    if (sourceExt === targetExt) {
        return 'SAME_FORMAT';
    }

    const category = getFileCategory(sourceExt);
    if (!category) {
        return 'UNSUPPORTED_SOURCE';
    }

    if (!SUPPORTED_CONVERSIONS[category].to.includes(targetExt)) {
        return 'UNSUPPORTED_TARGET';
    }

    return 'POSSIBLE';
} 