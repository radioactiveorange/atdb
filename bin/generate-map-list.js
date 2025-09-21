import fs from 'fs-extra'
import path from 'path'

const { readdir, writeFile } = fs

// Generate a list of all available map images
const generateMapList = async () => {
  try {
    // Get all files from backgrounds directory
    const backgroundFiles = await readdir('./public/backgrounds/')
    const mapIds = backgroundFiles
      .filter(file => file.endsWith('.jpg'))
      .map(file => path.basename(file, '.jpg'))
      .sort()

    console.log(`Found ${mapIds.length} generated map images`)

    // Create JavaScript module with the list
    const jsContent = `// Auto-generated list of available maps
export const availableMapIds = ${JSON.stringify(mapIds, null, 2)}
`

    await writeFile('./src/data/available-maps.ts', jsContent)
    console.log('Generated src/data/available-maps.ts')

    // Also create JSON for reference
    await writeFile('./public/available-maps.json', JSON.stringify(mapIds, null, 2))
    console.log('Generated public/available-maps.json')

    return mapIds
  } catch (error) {
    console.error('Failed to generate map list:', error)
    return []
  }
}

await generateMapList()