const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const [search, replace] of Object.entries(replacements)) {
        if (content.includes(search)) {
            content = content.split(search).join(replace);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

const files = [
    'src/app/page.tsx',
    'src/app/login/page.tsx',
    'src/app/recruitment/page.tsx',
    'src/app/applications/page.tsx',
    'src/app/settings/general/page.tsx',
    'src/app/settings/profile/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/layout.tsx',
    'README.md',
    'src/app/api/download-document/route.ts'
];

const replacements = {
    // Admin Sidebars
    'Admin<span className="text-primary">Portal</span>': 'Eurovanta<span className="text-primary">Talent Admin</span>',
    'Admin Portal': 'Eurovanta Talent Admin',
    
    // Landing Page
    'Global<span className="text-primary">Hire</span>': 'Eurovanta<span className="text-primary">Talent</span>',
    'GlobalHire': 'Eurovanta Talent',
    'ID: GH-': 'ID: ET-',
};

for (const file of files) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        replaceInFile(fullPath, replacements);
    }
}
