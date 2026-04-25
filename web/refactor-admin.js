const fs = require('fs');
const path = require('path');

const files = [
    'src/app/(admin)/applications/page.tsx',
    'src/app/(admin)/recruitment/page.tsx',
    'src/app/(admin)/settings/page.tsx',
    'src/app/(admin)/settings/profile/page.tsx',
    'src/app/(admin)/settings/general/page.tsx',
];

for (const file of files) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove outer <div className="flex h-screen ...">
    content = content.replace(/<div className="flex h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden">\s*/, '<>\n');

    // Find <aside> and remove it
    const asideStart = content.indexOf('<aside');
    if (asideStart !== -1) {
        const asideEnd = content.indexOf('</aside>') + '</aside>'.length;
        content = content.substring(0, asideStart) + content.substring(asideEnd);
    }

    // Replace the very last </div> with </>
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
        content = content.substring(0, lastDivIndex) + '</>' + content.substring(lastDivIndex + '</div>'.length);
    }

    // Remove `{/* Sidebar */}` and `{/* Main Content */}`
    content = content.replace(/{\/\* Sidebar \*\/}/g, '');
    content = content.replace(/{\/\* Main Content \*\/}/g, '');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Refactored ${file}`);
}
