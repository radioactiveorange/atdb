import fs from 'fs-extra'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { parseXMLMap } from './map-parser.js'
import { drawMap } from './draw-map-improved.js'

const { readdir, readFile } = fs
const tmxFolder = './public/xml/'
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

// Configuration
const BATCH_SIZE = 5  // Process 5 maps at a time
const DELAY_BETWEEN_BATCHES = 1000  // 1 second delay between batches

const getXMLMap = async (file, totalSize) => {
  const name = path.basename(file, '.tmx')
  const resource = `${tmxFolder}${name}.tmx`
  
  try {
    const data = await readFile(resource, 'utf8')
    if (data) {
      const xmlString = data.replace(/<!--.*-->/g, '')
      const mapXML = parser.parse(xmlString)
      const temp = parseXMLMap(mapXML, name)
      await drawMap(name, temp, totalSize)
    }
  } catch (error) {
    console.error(`Failed to process ${name}:`, error.message)
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateInBatches = async (tmxFolder) => {
  const files = await readdir(tmxFolder)
  const mapFiles = files.filter((file) => path.extname(file) === '.tmx')
  
  console.log(`Found ${mapFiles.length} map files to process`)
  console.log(`Processing in batches of ${BATCH_SIZE} with ${DELAY_BETWEEN_BATCHES}ms delay`)
  
  // Process in batches
  for (let i = 0; i < mapFiles.length; i += BATCH_SIZE) {
    const batch = mapFiles.slice(i, i + BATCH_SIZE)
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(mapFiles.length / BATCH_SIZE)
    
    console.log(`\n--- Processing batch ${batchNumber}/${totalBatches} ---`)
    console.log(`Maps: ${batch.join(', ')}`)
    
    // Process batch in parallel (but limited to BATCH_SIZE)
    const promises = batch.map((file) => getXMLMap(file, mapFiles.length))
    await Promise.all(promises)
    
    // Delay between batches to prevent memory issues
    if (i + BATCH_SIZE < mapFiles.length) {
      console.log(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`)
      await delay(DELAY_BETWEEN_BATCHES)
      
      // Suggest garbage collection
      if (global.gc) {
        global.gc()
      }
    }
  }
  
  console.log('\n--- Map generation complete! ---')
}

const generateSingle = async (mapName) => {
  console.log(`Generating single map: ${mapName}`)
  await getXMLMap(mapName + '.tmx', 1)
}

// Parse command line arguments
const args = process.argv.filter((e, i) => i >= 2)

// Add --batch-size and --delay options
let batchSize = BATCH_SIZE
let delayMs = DELAY_BETWEEN_BATCHES
let targetMap = null

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--batch-size' && args[i + 1]) {
    batchSize = parseInt(args[i + 1])
    i++ // Skip next arg
  } else if (args[i] === '--delay' && args[i + 1]) {
    delayMs = parseInt(args[i + 1])
    i++ // Skip next arg
  } else if (!args[i].startsWith('--')) {
    targetMap = args[i]
  }
}

// Override global settings
if (batchSize !== BATCH_SIZE) {
  console.log(`Using custom batch size: ${batchSize}`)
}
if (delayMs !== DELAY_BETWEEN_BATCHES) {
  console.log(`Using custom delay: ${delayMs}ms`)
}

// Run generation
if (targetMap) {
  await generateSingle(targetMap)
} else {
  await generateInBatches(tmxFolder)
}