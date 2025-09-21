// Hardcoded coordinates extracted from the original site's map.html
// This maps map IDs to their exact pixel positions and sizes from the working site

export interface OriginalMapPosition {
  left: number
  top: number
  width: number
  height: number
}

export const originalMapCoordinates: Record<string, OriginalMapPosition> = {
  "blackwater_mountain0": { left: 130, top: 1042, width: 40, height: 60 },
  "blackwater_mountain1": { left: 88, top: 1000, width: 50, height: 40 },
  "blackwater_mountain2": { left: 88, top: 978, width: 40, height: 20 },
  "blackwater_mountain3": { left: 88, top: 956, width: 40, height: 20 },
  "blackwater_mountain4": { left: 88, top: 924, width: 40, height: 30 },
  "blackwater_mountain10": { left: 90, top: 840, width: 40, height: 40 },
  "blackwater_mountain11": { left: 90, top: 778, width: 60, height: 60 },
  "blackwater_mountain12": { left: 32, top: 820, width: 56, height: 54 },
  "blackwater_mountain14": { left: 132, top: 840, width: 60, height: 40 },
  "blackwater_mountain15": { left: 174, top: 778, width: 30, height: 60 },
  "blackwater_mountain16": { left: 206, top: 778, width: 30, height: 60 },
  "blackwater_mountain30": { left: 252, top: 918, width: 60, height: 40 },
  "blackwater_mountain32": { left: 190, top: 922, width: 60, height: 60 },
  "blackwater_mountain40": { left: 166, top: 882, width: 22, height: 22 },
  "blackwater_mountain53": { left: 196, top: 758, width: 60, height: 18 },
  "blackwater_mountain54": { left: 258, top: 746, width: 60, height: 30 },
  "blackwater_mountain55": { left: 190, top: 882, width: 46, height: 38 },
  "blackwater_mountain56": { left: 194, top: 840, width: 32, height: 40 },
}

// Get coordinates for a map, or return default if not found
export const getOriginalMapPosition = (mapId: string): OriginalMapPosition | null => {
  return originalMapCoordinates[mapId] || null
}