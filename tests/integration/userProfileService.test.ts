import { faker } from '@faker-js/faker'

import { DatabaseService } from '@services/database'
import { setEnvironmentVariables } from '@shared/helpers/setEnvironmentVariables'
import { UserProfileService } from '@services/userProfile'
import { ExceptionError } from '@shared/helpers/exceptionError'

describe('User profile service', () => {
  const service = new UserProfileService()

  beforeAll(async () => {
    setEnvironmentVariables()

    const { DATABASE_URI } = process.env

    await DatabaseService.startConnection(DATABASE_URI)
  })

  let profileId: string

  test('When to create', async () => {
    profileId = await service.create({
      username: faker.internet.userName()
    })
  })

  test('When to recover', async () => {
    const profile = await service.get(profileId)
    expect(profile).toBeInstanceOf(Object)
  })

  test('When to update', async () => {
    const bio = faker.random.words(5)
    await service.update(profileId, {
      bio
    })
    const profile = await service.get(profileId)
    expect(profile.bio).toEqual(bio)
  })

  test('When to delete', async () => {
    await service.exclude(profileId)
    await service.get(profileId)
      .catch((error) => expect(error).toBeInstanceOf(ExceptionError))
  })

  afterAll(async () => await DatabaseService.stopConnection())
})
