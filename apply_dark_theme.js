import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const replacements = [
    // Backgrounds
    { rx: /(background(?:Color)?\s*:\s*['"])#fff(['"])/g, repl: '$1#05050A$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#ffffff(['"])/gi, repl: '$1#05050A$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#F8FAFC(['"])/gi, repl: '$1#111118$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#F1F5F9(['"])/gi, repl: '$1#1A1A24$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#E2E8F0(['"])/gi, repl: '$1#27273A$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#FAFAFA(['"])/gi, repl: '$1#0D0D14$2' },
    // Primary/Accent Backgrounds
    { rx: /(background(?:Color)?\s*:\s*['"])#EFF6FF(['"])/gi, repl: '$1#0F172A$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#DBEAFE(['"])/gi, repl: '$1#1E3A8A$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#DCFCE7(['"])/gi, repl: '$1#064E3B$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#F5F3FF(['"])/gi, repl: '$1#2E1065$2' },

    // Text Colors
    { rx: /(color\s*:\s*['"])#0F172A(['"])/gi, repl: '$1#F9FAFB$2' },
    { rx: /(color\s*:\s*['"])#1E293B(['"])/gi, repl: '$1#F3F4F6$2' },
    { rx: /(color\s*:\s*['"])#334155(['"])/gi, repl: '$1#E5E7EB$2' },
    { rx: /(color\s*:\s*['"])#475569(['"])/gi, repl: '$1#D1D5DB$2' },
    { rx: /(color\s*:\s*['"])#64748B(['"])/gi, repl: '$1#9CA3AF$2' },
    { rx: /(color\s*:\s*['"])#94A3B8(['"])/gi, repl: '$1#6B7280$2' },

    // Borders
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#E2E8F0([^'"]*['"])/gi, repl: '$1#1F2937$2' },
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#F1F5F9([^'"]*['"])/gi, repl: '$1#111827$2' },
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#DBEAFE([^'"]*['"])/gi, repl: '$1#1E3A8A$2' },
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#CBD5E1([^'"]*['"])/gi, repl: '$1#374151$2' },

    // Box Shadows (darken the shadow)
    { rx: /rgba\(0,0,0,0\.08\)/g, repl: 'rgba(0,0,0,0.4)' },
    { rx: /rgba\(0,0,0,0\.12\)/g, repl: 'rgba(0,0,0,0.5)' },
    { rx: /rgba\(0,0,0,0\.1\)/g, repl: 'rgba(0,0,0,0.6)' },

    // Wait, what if the color is used in a border directly without 'border:' prefix?
    // Handled mostly by above regexes which just look for border strings.
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    replacements.forEach(({ rx, repl }) => {
        content = content.replace(rx, repl);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

traverseDir(SRC_DIR);
console.log('Done!');
