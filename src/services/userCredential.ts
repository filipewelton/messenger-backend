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
    try {
      const p = provided,
        s = stored

      if (p.accessKey !== s.accessKey) throw null
      if (p.refreshToken !== s.refreshToken) throw null
      if (p.userId !== s.userId) throw null

      return
    } catch (error) {
      return Promise.reject(
        new ExceptionError('UNAUTHORIZED_ERROR', 'Invalid user credential')
      )
    }
  }

  public async get(accessKey: string) {
    try {
      await CacheService.switchDatabase(1)
      const credential = await CacheService.getJson<UserCredential>(accessKey)
      return { ...credential, accessKey }
    } catch (error) {
      const { type }: ExceptionError = error

      throw type === 'NOT_FOUND_ERROR'
        ? new ExceptionError('UNAUTHORIZED_ERROR', 'Invalid user credential')
        : error
    }
  }

  public async exclude(accessKey: string) {
    await CacheService.switchDatabase(1)
    await CacheService.deleteKey(accessKey)
  }
}
