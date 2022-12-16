import { faker } from '@faker-js/faker'

import { CacheService } from '@services/cache'
import { UserCredential, UserCredentialService } from '@services/userCredential'
import { setEnvironmentVariables } from '@shared/helpers/setEnvironmentVariables'

describe('User credential service', () => {
  const service = new UserCredentialService()

  beforeAll(async () => {
    setEnvironmentVariables()

    await CacheService.startConnection({
      host: process.env.CACHE_HOST,
      port: parseInt(process.env.CACHE_PORT),
      username: process.env.CACHE_USERNAME,
      password: process.env.CACHE_PASSWORD,
    })
  })

  let credential: UserCredential

  test('When to create', async () => {
    const userId = faker.database.mongodbObjectId()
    credential = await service.create(userId)
    expect(credential).toHaveProperty('accessKey')
    expect(credential).toHaveProperty('refreshToken')
  })

  test('When to store', async () => {
    await service.store(credential)
  })

  test('When to recover', async () => {
    const data = await service.get(credential.accessKey)
    expect(data).toHaveProperty('userId')
    expect(data).toHaveProperty('refreshToken')
  })

  test('When to delete', async () => {
    await service.exclude(credential.accessKey)

  })

  afterAll(async () => {
    await CacheService.flushAll()
    await CacheService.stopConnection()
  })
})
