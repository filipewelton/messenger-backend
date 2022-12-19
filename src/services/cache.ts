import { CacheInstance, ConnectionConfig, createClient } from 'redis'

import { ExceptionError } from '@shared/helpers/exceptionError'

export class CacheService {
  private static client: CacheInstance

  public static async startConnection(config: ConnectionConfig): Promise<void> {
    try {
      const client: CacheInstance = createClient({
        database: 0,
        socket: {
          port: config.port,
          host: config.host,
          connectTimeout: 1000,
          rejectUnauthorized: true,
        },
        username: config.username,
        password: config.password,
      })

      await client.connect()

      const reply = await client.ping()

      if (reply !== 'PONG') {
        return Promise.reject(
          new ExceptionError('THIRD_PARTY_SERVICE_ERROR', 'Connection failed')
        )
      }

      this.client = client
    } catch (error) {
      return Promise.reject(
        new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
      )
    }
  }

  public static async stopConnection() {
    try {
      await this.client.quit()
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async switchDatabase(databaseIndex: number) {
    try {
      await this.client.SELECT(databaseIndex)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async setJson(key: string, value: object) {
    try {
      await this.client.json.set(key, '.', value)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async getJson<I>(key: string): Promise<I> {
    try {
      const json = await this.client.json.get(key).then((reply: I) => reply)

      if (json === null) {
        return Promise.reject(
          new ExceptionError('NOT_FOUND_ERROR', 'JSON not found')
        )
      }

      return json
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async setText(key: string, value: string) {
    try {
      await this.client.set(key, value)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async getText(key: string) {
    try {
      return this.client.get(key)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async setExpirationForKey(key: string, seconds: number) {
    try {
      await this.client.expire(key, seconds)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async deleteKey(key: string) {
    try {
      await this.client.del([key])
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async flushAll() {
    try {
      await CacheService.client.flushAll()
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async getKeysInAPattern(pattern: string) {
    try {
      const list = await this.client.keys(pattern)

      if (list === null || list.length === 0) {
        return Promise.reject(
          new ExceptionError(
            'THIRD_PARTY_SERVICE_ERROR',
            'Not key found with pattern'
          )
        )
      }

      return list
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}
