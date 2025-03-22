#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join, parse } from 'path';
import { promises as fs } from 'fs';
import { convertImage } from './converters/imageConverter.js';
import { convertText } from './converters/textConverter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    const args = process.argv.slice(2);
    const helpText = `file-swap - A file conversion tool

Usage: file-swap <filepath> <target-format> [options]

Options:
    -d, --delete    Delete source file after conversion
    --help, -h      Show this help message

    ICO Size Options (required for ICO conversion):
    -s             Create 16x16 ICO (small)
    -m             Create 32x32 ICO (medium)
    -l             Create 48x48 ICO (large)

Supported Formats:

    ----- IMAGES -----
    From:
    JPEG, JPG, PNG, SVG, WEBP

    To:
    JPEG, JPG, PNG, WEBP, ICO

    ----- TEXT -----
    From:
    TXT, MD, JSON, YAML

    To:
    TXT, MD, JSON, YAML, CSV

Examples:
    # Convert image to PNG
    file-swap image.jpg png

    # Convert to ICO with size option
    file-swap logo.png ico -s    # small (16x16)
    file-swap logo.png ico -m    # medium (32x32)
    file-swap logo.png ico -l    # large (48x48)

    # Convert between text formats
    file-swap data.json yaml
    file-swap config.yaml json
    file-swap document.txt md
    file-swap data.json csv      # Convert JSON to CSV

    # Delete source file after conversion
    file-swap image.jpg png -d`;

    if (args.length < 2 || args[0] === '--help' || args[0] === '-h') {
        console.log(helpText);
        process.exit(0);
    }

    const [filepath, targetFormat] = args;
    const deleteSource = args.includes('-d') || args.includes('--delete');
    const icoSize = args.find(arg => ['-s', '-m', '-l'].includes(arg));

    try {
        const parsedPath = parse(filepath);
        const sourceFormat = parsedPath.ext.toLowerCase().slice(1);
        const outputPath = join(parsedPath.dir, `${parsedPath.name}.${targetFormat}`);

        if (['jpg', 'jpeg', 'png', 'svg', 'webp', 'ico'].includes(targetFormat)) {
            if (targetFormat === 'ico' && !icoSize) {
                throw new Error('ICO conversion requires a size option: -s (16x16), -m (32x32), or -l (48x48)');
            }

            const sizeMap = {
                '-s': 's',
                '-m': 'm',
                '-l': 'l'
            };

            await convertImage(filepath, targetFormat, sizeMap[icoSize]);
        } else if (['txt', 'md', 'json', 'yaml'].includes(targetFormat)) {
            await convertText(filepath, targetFormat);
        } else if (targetFormat === 'csv') {
            if (['txt', 'md', 'json', 'yaml'].includes(sourceFormat)) {
                await convertText(filepath, targetFormat);
            } else {
                throw new Error('CSV conversion is only supported from TXT, MD, JSON, or YAML formats');
            }
        } else {
            throw new Error(`Unsupported target format: ${targetFormat}`);
        }

        if (deleteSource) {
            await fs.unlink(filepath);
        }

        console.log(`\nSuccessfully converted ${filepath} to ${targetFormat}\n`);
        process.exit(0);
    } catch (error) {
        console.error(`\nError: ${error.message}\n`);
        process.exit(1);
    }
}

main(); 