// Script to create placeholder images for 6IX Clothing website
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Create placeholder SVG images
const createPlaceholderSVG = (filename, width, height, text) => {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#333"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    
    fs.writeFileSync(path.join(imagesDir, filename), svg);
    console.log(`Created ${filename}`);
};

// Create product images
for (let i = 1; i <= 8; i++) {
    createPlaceholderSVG(`product${i}.jpg`, 400, 500, `Product ${i}`);
}

// Create team member images
for (let i = 1; i <= 3; i++) {
    createPlaceholderSVG(`team${i}.jpg`, 300, 300, `Team ${i}`);
}

// Create about page main image
createPlaceholderSVG('about-main.jpg', 600, 400, '6IX Studio');

// Create hero background
createPlaceholderSVG('hero-bg.jpg', 1920, 1080, '6IX Clothing');

console.log('All placeholder images created successfully!'); 