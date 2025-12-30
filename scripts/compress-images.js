// Image Compression Script
// 使用方法：node scripts/compress-images.js

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'];

async function compressImages() {
  console.log('🖼️  圖檔壓縮腳本');
  console.log('📁 目標資料夾:', ASSETS_DIR);
  console.log('');

  try {
    const files = await fs.readdir(ASSETS_DIR);
    const imageFiles = files.filter(file => 
      SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())
    );

    if (imageFiles.length === 0) {
      console.log('⚠️  未找到圖檔');
      return;
    }

    console.log(`📊 找到 ${imageFiles.length} 個圖檔:`);
    
    for (const file of imageFiles) {
      const filePath = path.join(ASSETS_DIR, file);
      const stats = await fs.stat(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`   - ${file} (${sizeMB} MB)`);
    }

    console.log('');
    console.log('💡 建議使用以下方式壓縮:');
    console.log('');
    console.log('方案 1: 線上工具 (推薦)');
    console.log('   • TinyPNG: https://tinypng.com/');
    console.log('   • Squoosh: https://squoosh.app/');
    console.log('   • 壓縮率: 60-80%，品質損失極小');
    console.log('');
    console.log('方案 2: 自動化工具');
    console.log('   npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant');
    console.log('   然後執行壓縮腳本 (需要額外設置)');
    console.log('');
    console.log('方案 3: WebP 轉換 (最佳化)');
    console.log('   • 使用 cwebp 或 Squoosh 轉換為 WebP 格式');
    console.log('   • 檔案大小可減少 25-35%');
    console.log('   • 需要更新 constants.tsx 中的副檔名');

  } catch (error) {
    console.error('❌ 錯誤:', error.message);
  }
}

compressImages();
