import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const SKIP_FILES = ['slide-6.png']; // 不處理的檔案

async function preCompress() {
  console.log('🗜️  圖檔預壓縮腳本 (TinyPNG 前置處理)');
  console.log('📁 目標資料夾:', ASSETS_DIR);
  console.log('🚫 跳過檔案:', SKIP_FILES.join(', '));
  console.log('📏 目標大小: < 5MB');
  console.log('');

  try {
    const files = await fs.readdir(ASSETS_DIR);
    
    for (const file of files) {
      // 檢查檔案格式
      if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
      
      // 檢查是否在跳過清單中
      if (SKIP_FILES.includes(file)) {
        console.log(`⏭️  ${file} - 已跳過`);
        continue;
      }
      
      const filePath = path.join(ASSETS_DIR, file);
      const stats = await fs.stat(filePath);
      const originalSize = stats.size;
      const originalSizeMB = (originalSize / 1024 / 1024).toFixed(2);
      
      // 檢查檔案大小
      if (originalSize <= MAX_SIZE) {
        console.log(`✅ ${file} (${originalSizeMB} MB) - 已小於 5MB，無需壓縮`);
        continue;
      }
      
      console.log(`🔄 ${file} (${originalSizeMB} MB) - 開始壓縮...`);
      
      // 逐步降低品質直到小於 5MB
      let quality = 80;
      let compressed = false;
      
      while (quality >= 40) {
        try {
          const buffer = await sharp(filePath)
            .png({ quality, compressionLevel: 9, effort: 10 })
            .toBuffer();
          
          if (buffer.length < MAX_SIZE) {
            await fs.writeFile(filePath, buffer);
            const newSizeMB = (buffer.length / 1024 / 1024).toFixed(2);
            const savedPercent = ((1 - buffer.length / originalSize) * 100).toFixed(1);
            console.log(`   ✅ 成功: ${originalSizeMB}MB → ${newSizeMB}MB (節省 ${savedPercent}%, 品質 ${quality})`);
            compressed = true;
            break;
          }
        } catch (error) {
          console.error(`   ❌ 品質 ${quality} 壓縮失敗:`, error.message);
        }
        quality -= 5;
      }
      
      if (!compressed) {
        console.log(`   ⚠️  無法壓縮至 5MB 以下，建議手動降低解析度`);
      }
      
      console.log('');
    }
    
    console.log('');
    console.log('✨ 壓縮完成！');
    console.log('💡 下一步: 使用 TinyPNG (https://tinypng.com/) 進行無損優化');
    
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    process.exit(1);
  }
}

preCompress();
