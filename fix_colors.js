const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'components', 'SearchForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all primary colors with blue
content = content.replace(/primary-100/g, 'blue-100');
content = content.replace(/primary-200/g, 'blue-200');
content = content.replace(/primary-500/g, 'blue-500');
content = content.replace(/primary-600/g, 'blue-600');
content = content.replace(/primary-700/g, 'blue-700');

fs.writeFileSync(filePath, content);
console.log('Colors fixed!');
