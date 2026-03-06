import { describe, expect, it } from 'vitest'
import { profileData } from '../../app/constants/profile'

describe('profileData', () => {
  it('contains required public profile fields', () => {
    expect(profileData.names.length).toBeGreaterThan(0)
    expect(profileData.discordId).toMatch(/^\d+$/)
    expect(profileData.avatarUrl).toBeTruthy()
    expect(profileData.location).toBeTruthy()
  })
})
