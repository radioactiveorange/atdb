// Script to extract all map coordinates from map.html
const fs = require('fs');

const html = fs.readFileSync('map.html', 'utf8');

// Match the pattern: style="left: 130px; top: 1042px; width: 40px; height: 60px;" title="blackwater_mountain0"
const regex = /style="left:\s*(\d+)px;\s*top:\s*(\d+)px;\s*width:\s*(\d+)px;\s*height:\s*(\d+)px;"\s+title="([^"]+)"/g;

const coordinates = {};
let match;

while ((match = regex.exec(html)) !== null) {
  const [, left, top, width, height, title] = match;
  coordinates[title] = {
    left: parseInt(left),
    top: parseInt(top),
    width: parseInt(width),
    height: parseInt(height)
  };
}

console.log('export const originalMapCoordinates: Record<string, OriginalMapPosition> = {');
Object.entries(coordinates).forEach(([mapId, pos]) => {
  console.log(`  "${mapId}": { left: ${pos.left}, top: ${pos.top}, width: ${pos.width}, height: ${pos.height} },`);
});
console.log('};');

console.log(`\n// Total maps extracted: ${Object.keys(coordinates).length}`);