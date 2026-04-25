const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements, needsImageImport = false) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const [search, replace] of Object.entries(replacements)) {
        if (content.includes(search)) {
            content = content.split(search).join(replace);
            modified = true;
        }
    }
    
    if (modified) {
        if (needsImageImport && !content.includes("import Image from 'next/image';") && !content.includes('import Image from "next/image";')) {
            const lines = content.split('\n');
            const importIndex = lines.findIndex(l => l.startsWith('import '));
            lines.splice(importIndex > -1 ? importIndex : 0, 0, "import Image from 'next/image';");
            content = lines.join('\n');
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

// Landing page
replaceInFile(path.join(__dirname, 'src/app/page.tsx'), {
    [`<Image src="/globe.svg" alt="Eurovanta Talent Logo" width={28} height={28} className="text-primary opacity-90" />
                    Eurovanta<span className="text-primary">Talent</span>`]: `<Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} priority className="object-contain" />`,
    
    [`Eurovanta<span className="text-primary">Talent</span>`]: `<Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain" />`
});

// Admin Portals
const adminFiles = [
    'src/app/login/page.tsx',
    'src/app/recruitment/page.tsx',
    'src/app/applications/page.tsx',
    'src/app/settings/general/page.tsx',
    'src/app/settings/profile/page.tsx',
    'src/app/settings/page.tsx'
];

for (const file of adminFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        replaceInFile(fullPath, {
            '<h1 className="font-heading font-bold text-xl text-darkBlue tracking-tight">Eurovanta<span className="text-primary">Talent Admin</span></h1>': '<Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain" />',
            '<h1 className="font-heading font-bold text-3xl text-darkBlue tracking-tight mb-2">Eurovanta<span className="text-primary">Talent Admin</span></h1>': '<Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain mx-auto mb-4" />',
        }, true);
    }
}
