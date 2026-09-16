import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, '..', 'app', 'posts');
const publicImgDir = path.join(__dirname, '..', 'public', 'image-grid');

if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /<ImageGrid[\s\S]*?\/>/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const gridBlock = match[0];
    const baseUrlMatch = gridBlock.match(/baseUrl="([^"]+)"/);
    const fileNameMatch = gridBlock.match(/fileName="([^"]+)"/);
    const rangeMatch = gridBlock.match(/range="([^"]+)"/);
    
    if (baseUrlMatch && fileNameMatch && rangeMatch) {
      const baseUrl = baseUrlMatch[1];
      const fileName = fileNameMatch[1];
      const rangeStr = rangeMatch[1];
      
      if (baseUrl.startsWith('http')) {
        const folderName = baseUrl.split('/').pop();
        const localFolder = path.join(publicImgDir, folderName);
        
        if (!fs.existsSync(localFolder)) {
          fs.mkdirSync(localFolder, { recursive: true });
        }
        
        let range;
        try {
          range = JSON.parse(rangeStr);
        } catch {
          range = rangeStr.split(',').map(n => parseInt(n.trim(), 10));
        }
        
        let start, end;
        if (range.length === 2) {
          start = range[0];
          end = range[1];
        } else {
          start = range[0];
          end = range[range.length - 1]; // Assume sorted array
        }
        
        console.log(`Downloading images for ${folderName} (${start} to ${end})...`);
        for (let i = start; i <= end; i++) {
          const imgName = fileName.replace('[]', i.toString());
          const imgUrl = `${baseUrl}/${imgName}`;
          const destPath = path.join(localFolder, imgName);
          
          if (!fs.existsSync(destPath)) {
            console.log(`  Downloading ${imgUrl}`);
            await downloadImage(imgUrl, destPath);
          }
        }
      }
    }
  }
}

async function main() {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
  for (const file of files) {
    await processFile(path.join(postsDir, file));
  }
  console.log("Image download complete.");
}

main().catch(console.error);
