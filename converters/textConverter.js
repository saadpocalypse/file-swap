import path from 'path';
import { promises as fs } from 'fs';
import yaml from 'yaml';

export async function convertText(inputPath, targetFormat) {
    const parsedPath = path.parse(inputPath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.${targetFormat}`);
    const sourceFormat = parsedPath.ext.toLowerCase().slice(1);

    const content = await fs.readFile(inputPath, 'utf-8');

    let data;
    switch (sourceFormat) {
        case 'json':
            data = JSON.parse(content);
            break;
        case 'yaml':
            data = yaml.parse(content);
            break;
        case 'csv':
            data = parseCSV(content);
            break;
        case 'md':
        case 'txt':
            data = content;
            break;
        default:
            throw new Error(`Unsupported source format: ${sourceFormat}`);
    }

    let output;
    switch (targetFormat) {
        case 'json':
            output = JSON.stringify(data, null, 2);
            break;
        case 'yaml':
            output = yaml.stringify(data);
            break;
        case 'csv':
            output = stringifyCSV(convertToCSVFormat(data));
            break;
        case 'md':
            output = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            break;
        case 'txt':
            output = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            break;
        default:
            throw new Error(`Unsupported target format: ${targetFormat}`);
    }

    await fs.writeFile(outputPath, output);
    return outputPath;
}

function parseCSV(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
        }, {});
    });
}

function stringifyCSV(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('CSV output requires an array of objects');
    }

    const headers = Object.keys(data[0]);
    const rows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        });
        rows.push(values.join(','));
    }

    return rows.join('\n');
}

function convertToCSVFormat(data) {
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        return data;
    }

    if (typeof data === 'string') {
        return data.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => ({ content: line }));
    }

    if (typeof data === 'object' && data !== null) {
        const rows = [];
        flattenObject(data, rows);
        return rows;
    }

    if (Array.isArray(data)) {
        return data.map(item => ({ value: item }));
    }

    return [{ value: data }];
}

function flattenObject(obj, rows, prefix = '') {
    const flatRow = {};
    
    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (value === null) {
            flatRow[newKey] = '';
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            flattenObject(value, rows, newKey);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    flattenObject(item, rows, `${newKey}_${index}`);
                } else {
                    flatRow[`${newKey}_${index}`] = item;
                }
            });
        } else {
            flatRow[newKey] = value;
        }
    }

    if (Object.keys(flatRow).length > 0) {
        rows.push(flatRow);
    }
} 