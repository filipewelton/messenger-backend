import { v5 } from 'uuid'
import { sign } from 'jsonwebtoken'

import { ExceptionError } from '@shared/helpers/exceptionError'
import { CacheService } from '@services/cache'

export class UserCredentialService {
  public async create(userId: string): Promise<UserCredential> {
    try {
      const id = String(userId)
      const { JWT_SECRET } = process.env
      const accessKey = v5(id, v5.DNS)
      const refreshToken = sign({ userId }, JWT_SECRET, {
        algorithm: 'HS512',
        expiresIn: '1h',
      })

      return { accessKey, refreshToken, userId }
    } catch (error) {
      throw new ExceptionError('INTERNAL_ERROR', error)
    }
  }

  public async store(credential: UserCredential) {
    const { accessKey, refreshToken, userId } = credential
    await CacheService.switchDatabase(1)
    await CacheService.setJson(accessKey, {
      refreshToken,
      userId,
    })
  }

  public async validate(
    provided: UserCredential,
    stored: UserCredential
  ): Promise<void> {
    const stringifyP = JSON.stringify(provided)
    const stringifyS = JSON.stringify(stored)

    if (stringifyP !== stringifyS) {
      return Promise.reject(
        new ExceptionError('UNAUTHORIZED_ERROR', 'Invalid user credential')
      )
    }
  }

  public async get(accessKey: string) {
    try {
      await CacheService.switchDatabase(1)

      const credential = await CacheService.getJson<UserCredential>(accessKey)

      if (credential === null) {
        return Promise.reject(
          new ExceptionError('UNAUTHORIZED_ERROR', 'Invalid user credential')
        )
      }

      return credential
    } catch (error) {
      return Promise.reject(
        new ExceptionError(
          'THIRD_PARTY_SERVICE_ERROR',
          'Invalid user credential'
        )
      )
    }
  }

  public async exclude(accessKey: string) {
    await CacheService.switchDatabase(1)
    await CacheService.deleteKey(accessKey)
  }
}
