import { faker } from '@faker-js/faker'

import { DatabaseService } from '@services/database'
import { ProfileService } from '@services/profile'
import { ExceptionError } from '@shared/helpers/exceptionError'

describe('User profile service', () => {
  const service = new ProfileService()

  beforeAll(async () => {
    await DatabaseService.connect()
  })

  let profileId: string

  test('When to create', async () => {
    profileId = await service
      .create({
        username: faker.internet.userName(),
      })
      .then((reply) => reply.id)
  })

  test('When to recover', async () => {
    const profile = await service.get(profileId)
    expect(profile).toBeInstanceOf(Object)
  })

  test('When to update', async () => {
    const bio = faker.random.words(5)
    await service.update(profileId, {
      bio,
    })
    const profile = await service.get(profileId)
    expect(profile.bio).toEqual(bio)
  })

  test('When to delete', async () => {
    await service.exclude(profileId)
    await service
      .get(profileId)
      .catch((error) => expect(error).toBeInstanceOf(ExceptionError))
  })

  afterAll(async () => await DatabaseService.disconnect())
})
