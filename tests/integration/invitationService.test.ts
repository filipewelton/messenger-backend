import { faker } from '@faker-js/faker'

import { CacheService } from '@services/cache'
import { setEnvironmentVariables } from '@shared/helpers/setEnvironmentVariables'
import { InvitationService } from '@services/invitation'

describe('Invitations service', () => {
  const service = new InvitationService()

  beforeAll(async () => {
    setEnvironmentVariables()

    await CacheService.startConnection({
      host: process.env.CACHE_HOST,
      port: parseInt(process.env.CACHE_PORT),
      password: process.env.CACHE_PASSWORD,
      username: process.env.CACHE_USERNAME,
    })
  })

  const hostUserId = faker.database.mongodbObjectId()
  const guestUserId = faker.database.mongodbObjectId()
  const invitationId = `${guestUserId}:${hostUserId}`

  test('When to store', async () => {
    await service.store(invitationId, {
      hostUserId,
      type: 'FRIENDSHIP',
      createdAt: new Date(),
      message: faker.random.words(10),
    })
  })

  test('When to recover all invitations', async () => {
    const invitations = await service.getAll(guestUserId)
    expect(invitations).toHaveLength(1)
  })

  test('When to delete', async () => {
    await service.exclude(invitationId)
  })

  afterAll(async () => await CacheService.stopConnection())
})
