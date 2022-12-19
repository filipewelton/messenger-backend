import { faker } from '@faker-js/faker'

import { ApiCredential, ApiCredentialService } from '@services/apiCredential'
import { CacheService } from '@services/cache'
import { setEnvironmentVariables } from '@shared/helpers/environmentVariables'
import { ExceptionError } from '@shared/helpers/exceptionError'

const service = new ApiCredentialService()

describe('API credential service', () => {
  beforeAll(async () => {
    setEnvironmentVariables()

    await CacheService.startConnection({
      host: process.env.CACHE_HOST,
      port: parseInt(process.env.CACHE_PORT),
      username: process.env.CACHE_USERNAME,
      password: process.env.CACHE_PASSWORD,
    })
  })

  describe('Given an invalid credential', () => {
    test('When to validate', async () => {
      const provided = faker.datatype.uuid()
      const stored = faker.datatype.uuid()

      await service
        .validate(provided, stored)
        .catch((error) => expect(error).toBeInstanceOf(ExceptionError))
    })

    test('When to recover', async () => {
      const accessKey = faker.git.branch()
      await service
        .get(accessKey)
        .catch((error) => expect(error).toBeInstanceOf(ExceptionError))
    })
  })

  describe('Given an valid credential', () => {
    let credential: ApiCredential

    test('When to create', async () => {
      credential = await service.create()
      expect(credential).toHaveProperty('accessKey')
      expect(credential).toHaveProperty('refreshToken')
    })

    test('When to store', async () => {
      const { accessKey, refreshToken } = credential
      await service.store(accessKey, refreshToken)
    })

    test('When to recover', async () => {
      const { accessKey } = credential
      const stored = await service.get(accessKey)
      expect(typeof stored).toEqual('string')
    })

    test('When to validate', async () => {
      const { accessKey, refreshToken } = credential
      const stored = await service.get(accessKey)
      await service.validate(refreshToken, stored)
    })
  })

  afterAll(async () => {
    await CacheService.flushAll()
    await CacheService.stopConnection()
  })
})
