// Spawn group system for linking monsters/NPCs to map spawn areas

export interface SpawnGroup {
  key: string
  maps: string[] // Map IDs where this spawn group appears
  monsters: any[] // Monster/NPC data linked to this spawn group
}

export interface SpawnData {
  spawngroups: Record<string, SpawnGroup>
}

export const createSpawnGroupsFromDatabase = (database: any): SpawnData => {
  const spawngroups: Record<string, SpawnGroup> = {}

  console.log('Creating spawn groups from database...')

  // First, create spawn groups from monsters
  if (database.monsters) {
    database.monsters.forEach((monster: any) => {
      // Create spawn group for monster.id
      const monsterKey = monster.id.toLowerCase()
      if (!spawngroups[monsterKey]) {
        spawngroups[monsterKey] = {
          key: monsterKey,
          maps: [],
          monsters: []
        }
      }
      spawngroups[monsterKey].monsters.push(monster)

      // Also create spawn group for monster.spawnGroup if different
      if (monster.spawnGroup && monster.spawnGroup.toLowerCase() !== monsterKey) {
        const spawnGroupKey = monster.spawnGroup.toLowerCase()
        if (!spawngroups[spawnGroupKey]) {
          spawngroups[spawnGroupKey] = {
            key: spawnGroupKey,
            maps: [],
            monsters: []
          }
        }
        spawngroups[spawnGroupKey].monsters.push(monster)
      }
    })
  }

  // Also create spawn groups from NPCs
  if (database.npcs) {
    database.npcs.forEach((npc: any) => {
      const npcKey = npc.id.toLowerCase()
      if (!spawngroups[npcKey]) {
        spawngroups[npcKey] = {
          key: npcKey,
          maps: [],
          monsters: []
        }
      }
      spawngroups[npcKey].monsters.push(npc)
    })
  }

  console.log(`Created ${Object.keys(spawngroups).length} spawn groups`)
  console.log('Sample spawn groups:', Object.keys(spawngroups).slice(0, 10))

  return { spawngroups }
}

export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max)
}

export const getMonsterSprite = (monster: any): { src: string; x: number; y: number } => {
  console.log('Getting sprite for:', monster.id, monster.iconID, monster.monsterClass, monster.isNPC)

  // Handle iconID if present
  if (monster.iconID) {
    const [filename, indexStr] = monster.iconID.split(':')
    const index = indexStr ? parseInt(indexStr) : 0

    return {
      src: `${window.location.origin}/atdb/drawable/${filename}.png`,
      x: (index % 8) * 32,
      y: Math.floor(index / 8) * 32
    }
  }

  // NPC fallbacks
  if (monster.isNPC || monster.monsterClass === 'npc') {
    return { src: `${window.location.origin}/atdb/drawable/monsters_man1.png`, x: 0, y: 0 }
  }

  // Monster type fallbacks
  if (monster.id.toLowerCase().includes('rat')) {
    return { src: `${window.location.origin}/atdb/drawable/monsters_rats.png`, x: 32, y: 0 }
  }
  if (monster.id.toLowerCase().includes('ant') || monster.id.toLowerCase().includes('wasp')) {
    return { src: `${window.location.origin}/atdb/drawable/monsters_insects.png`, x: 0, y: 0 }
  }

  // Default to basic human sprite
  console.warn('Using default sprite for:', monster.id)
  return { src: `${window.location.origin}/atdb/drawable/monsters_man1.png`, x: 0, y: 0 }
}