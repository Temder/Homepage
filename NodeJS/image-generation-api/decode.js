const fs = require('fs');

// Read the source file
const sourceFile = './NodeJS/deepai/test.js';
const rawContent = fs.readFileSync(sourceFile, 'utf8');

// Extract the encoded data between the script tags
const dataMatch = rawContent.match(/<script id="imported-generators" type="notjs">\s*(.*?)\s*<\/script>/s);
if (!dataMatch) {
  console.log('No encoded data found');
  process.exit(1);
}

// Decode the URL encoded content
let decoded = decodeURIComponent(dataMatch[1]);

// Clean up the text
decoded = decoded.replace(/\\n/g, '\n')  // Replace escaped newlines
                 .replace(/\\"/g, '"')   // Replace escaped quotes
                 .replace(/\\\\/g, '\\'); // Replace escaped backslashes

// Write the decoded content to a new file
fs.writeFileSync('decoded.txt', decoded);
console.log('Decoded content written to decoded.txt');
