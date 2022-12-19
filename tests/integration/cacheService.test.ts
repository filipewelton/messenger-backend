import { faker } from '@faker-js/faker'

import { CacheService } from '@services/cache'
import { setEnvironmentVariables } from '@shared/helpers/environmentVariables'

describe('Cache service', () => {
  beforeAll(async () => {
    try {
      setEnvironmentVariables()

      await CacheService.startConnection({
        host: process.env.CACHE_HOST,
        port: parseInt(process.env.CACHE_PORT),
        username: process.env.CACHE_USERNAME,
        password: process.env.CACHE_PASSWORD,
      })
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  })

  const key = faker.random.alphaNumeric()

  test('When to store a JSON', async () => {
    const value = {
      prop: faker.datatype.uuid(),
    }
    await CacheService.setJson(key, value)
  })

  test('When to recover a JSON', async () => {
    const value = await CacheService.getJson(key)
    expect(value).toHaveProperty('prop')
  })

  test('When to store text', async () => {
    const value = faker.datatype.uuid()
    await CacheService.setText(key, value)
  })

  test('When to to recover a text', async () => {
    const value = await CacheService.getText(key)
    expect(typeof value).toEqual('string')
  })

  test('When to set expiration', (done) => {
    CacheService.setExpirationForKey(key, 250)
      .then(() => {
        setTimeout(async () => {
          const value = await CacheService.getText(key)
          expect(typeof value).toEqual('string')
          done()
        }, 500)
      })
      .catch((error) => {
        throw error
      })
  })

  test('When to delete a key', async () => {
    let value = faker.datatype.uuid()
    await CacheService.setText(key, value)
    await CacheService.deleteKey(key)
    value = await CacheService.getText(key)
    expect(value).toEqual(null)
  })

  test('When to recover keys in a pattern', async () => {
    const k1 = `${key}:1`
    const k2 = `${key}:2`
    const value = faker.datatype.uuid()

    await CacheService.setText(k1, value)
    await CacheService.setText(k2, value)

    const keys = await CacheService.getKeysInAPattern(`${key}:*`)
    expect(keys).toHaveLength(2)
  })

  afterAll(async () => {
    await CacheService.flushAll()
    await CacheService.stopConnection()
  })
})
