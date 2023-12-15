import fs from 'fs';
import path from 'path';

export function writeFileSafe(filePath: string, content: string) {
    const { dir } = path.parse(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
}
