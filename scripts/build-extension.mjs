
import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const dist = 'dist';
const candidates = ['src', 'scr'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// Copia manifest.json
if (!fs.existsSync('manifest.json')) {
  console.error('manifest.json não encontrado na raiz. Saindo.');
  process.exit(1);
}
fs.copyFileSync('manifest.json', path.join(dist, 'manifest.json'));

// Copia pasta da extensão, preferindo 'src', senão 'scr'
let copied = false;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    fs.cpSync(c, path.join(dist, c), { recursive: true });
    console.log(`Copiado ${c} -> ${dist}/${c}`);
    copied = true;
    break;
  }
}
if (!copied) {
  console.warn('Nenhuma pasta src/ ou scr/ encontrada. Apenas manifest será empacotado.');
}

// Copia icons se existir
if (fs.existsSync('icons')) {
  fs.cpSync('icons', path.join(dist, 'icons'), { recursive: true });
  console.log('icons copiados para dist/icons');
}

// Gera ZIP
const output = fs.createWriteStream(path.join(dist, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });
archive.directory(dist, false);
archive.pipe(output);
await archive.finalize();
console.log('Build gerado em dist/ e dist/extension.zip');
