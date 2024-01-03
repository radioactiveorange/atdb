import fs from 'fs-extra'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { parseXMLMap } from './map-parser.js'
import { drawMap } from './draw-map.js'

const { readdir, readFile } = fs
const tmxFolder = './public/xml/'
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

const getXMLMap = async (file, size) => {
  const name = path.basename(file, '.tmx')
  const resource = `${tmxFolder}${name}.tmx`
  const data = await readFile(resource, 'utf8')
  if (data) {
    const xmlString = data.replace(/<!--.*-->/g, '')
    const mapXML = parser.parse(xmlString)
    const temp = parseXMLMap(mapXML, name)
    await drawMap(name, temp, size)
  }
  // readFile(resource, 'utf8', (err, data) => {
  //   if (data) {
  //     const xmlString = data.replace(/<!--.*-->/g, '')

  //     const mapXML = parser.parse(xmlString)
  //     const temp = parseXMLMap(mapXML, name)
  //     drawMap(name, temp, size)
  //   }
  // })
}

const generateAll = async (tmxFolder) => {
  const files = await readdir(tmxFolder)
  const mapFiles = files.filter((file) => path.extname(file) === '.tmx')
  const promises = mapFiles.map((m) => getXMLMap(m, mapFiles.length))
  await Promise.all(promises)
}

var args = process.argv.filter((e, i) => i >= 2)

if (args.length) {
  await getXMLMap(args[0], args.length)
} else {
  await generateAll(tmxFolder)
}
