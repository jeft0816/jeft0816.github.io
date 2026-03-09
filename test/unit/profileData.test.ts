import { describe, expect, it } from 'vitest'
import { profileData } from '../../app/constants/profile'

const DISCORD_ID_REGEX = /^\d+$/

describe('profileData', () => {
  it('contains required public profile fields', () => {
    expect(profileData.names.length).toBeGreaterThan(0)
    expect(profileData.discordId).toMatch(DISCORD_ID_REGEX)
    expect(profileData.avatarUrl).toBeTruthy()
    expect(profileData.location).toBeTruthy()
  })
})
