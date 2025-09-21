import fs from 'fs'

function getVersion() {
  try {
    const manifestPath = '../andors-trail/AndorsTrail/app/src/main/AndroidManifest.xml'
    console.log(`Reading version from: ${manifestPath}`)

    const data = fs.readFileSync(manifestPath, 'utf8')

    // Simple regex to extract version
    const versionMatch = data.match(/android:versionName="([^"]+)"/)

    if (versionMatch) {
      const version = versionMatch[1]
      console.log(`Andor's Trail version: ${version}`)

      // Save to .env.local
      const envContent = `VITE_AT_VERSION=${version}\n`
      fs.writeFileSync('.env.local', envContent)
      console.log('Version saved to .env.local')

      return version
    } else {
      console.warn('Could not find android:versionName in manifest')
      return null
    }
  } catch (error) {
    console.error('Failed to read version:', error.message)
    return null
  }
}

// Always run when script is executed
getVersion()

export { getVersion }