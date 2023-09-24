import path from 'path';
import { fileURLToPath } from 'url';

//obtengo la ruta de src
export const __dirname = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).slice(0, -1).join(path.sep);
console.log(`\npath: ${__dirname}\t`);