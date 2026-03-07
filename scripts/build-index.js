import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const appsJsonPath = path.join(rootDir, 'apps.json');

function buildIndex() {
    console.log('Scanning for React applications...');
    const apps = [];
    
    // Read all items in root directory
    const items = fs.readdirSync(rootDir);
    
    for (const item of items) {
        // Skip hidden folders, node_modules, and scripts
        if (item.startsWith('.') || item === 'node_modules' || item === 'scripts' || item === 'src' || item === 'public') {
            continue;
        }
        
        const itemPath = path.join(rootDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            const packageJsonPath = path.join(itemPath, 'package.json');
            
            if (fs.existsSync(packageJsonPath)) {
                try {
                    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                    apps.push({
                        folder: item,
                        name: packageData.name || item,
                        description: packageData.description || '',
                        features: packageData.features || [],
                        author: packageData.author || 'Bilinmeyen Geliştirici',
                        category: packageData.category || 'Genel Yetenek' // Default to Genel Yetenek
                    });
                    console.log(`Found app: ${item}`);
                } catch (error) {
                    console.error(`Error reading package.json in ${item}:`, error.message);
                }
            }
        }
    }
    
    fs.writeFileSync(appsJsonPath, JSON.stringify(apps, null, 2));
    console.log(`Generated apps.json with ${apps.length} applications.`);
}

buildIndex();
