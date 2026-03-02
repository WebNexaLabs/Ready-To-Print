import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

// We want to replace these specific hardcoded colors with CSS variables
// #05050A -> var(--bg-primary)
// #111118 -> var(--bg-secondary)
// #1A1A24 -> var(--bg-tertiary)
// #27273A -> var(--border-color)
// #111827 -> var(--border-dark)
// #1F2937 -> var(--border-light)
// #F9FAFB -> var(--text-primary)
// #F3F4F6 -> var(--text-secondary)
// #E5E7EB -> var(--text-tertiary)
// #D1D5DB -> var(--text-muted)
// #9CA3AF -> var(--text-muted-dark)
// #6B7280 -> var(--text-disabled)
// #0F172A -> var(--bg-accent-dark)

const replacements = [
    { rx: /(background(?:Color)?\s*:\s*['"])#05050A(['"])/gi, repl: '$1var(--bg-primary)$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#111118(['"])/gi, repl: '$1var(--bg-secondary)$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#1A1A24(['"])/gi, repl: '$1var(--bg-tertiary)$2' },
    { rx: /(background(?:Color)?\s*:\s*['"])#0F172A(['"])/gi, repl: '$1var(--bg-accent-dark)$2' },
    { rx: /(color\s*:\s*['"])#F9FAFB(['"])/gi, repl: '$1var(--text-primary)$2' },
    { rx: /(color\s*:\s*['"])#F3F4F6(['"])/gi, repl: '$1var(--text-secondary)$2' },
    { rx: /(color\s*:\s*['"])#E5E7EB(['"])/gi, repl: '$1var(--text-tertiary)$2' },
    { rx: /(color\s*:\s*['"])#D1D5DB(['"])/gi, repl: '$1var(--text-muted)$2' },
    { rx: /(color\s*:\s*['"])#9CA3AF(['"])/gi, repl: '$1var(--text-muted-dark)$2' },
    { rx: /(color\s*:\s*['"])#6B7280(['"])/gi, repl: '$1var(--text-disabled)$2' },
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#1F2937([^'"]*['"])/gi, repl: '$1var(--border-light)$2' },
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#111827([^'"]*['"])/gi, repl: '$1var(--border-dark)$2' },
    { rx: /(border(?:Color|Top|Bottom|Left|Right)?\s*:\s*['"][^'"]*)#27273A([^'"]*['"])/gi, repl: '$1var(--border-color)$2' },
    // Also catch some inline borders that might just specify color directly
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
console.log('Done replacing colors in components!');
