import { createHash } from 'crypto'
import { sign } from 'jsonwebtoken'

import { CacheService } from '@services/cache'
import { ExceptionError } from '@shared/helpers/exceptionError'

export class ApiCredentialService {
  public async validate(
    providedToken: string,
    storedToken: string
  ): Promise<void> {
    if (providedToken !== storedToken) {
      return Promise.reject(
        new ExceptionError('UNAUTHORIZED_ERROR', 'Api credential')
      )
    }
  }

  public async get(accessKey: string) {
    try {
      await CacheService.switchDatabase(0)
      const refreshToken = await CacheService.getText(accessKey)
      return refreshToken
    } catch (error) {
      return Promise.reject(new ExceptionError('UNAUTHORIZED_ERROR', error))
    }
  }

  public async create(): Promise<ApiCredential> {
    try {
      const { JWT_SECRET } = process.env
      const accessKey = createHash('sha512').digest('hex')
      const refreshToken = sign({}, JWT_SECRET, {
        algorithm: 'HS512',
      })

      return { accessKey, refreshToken }
    } catch (error) {
      return Promise.reject(new ExceptionError('INTERNAL_ERROR', error))
    }
  }

  public async store(accessKey: string, refreshToken: string): Promise<void> {
    try {
      await CacheService.switchDatabase(0)
      await CacheService.setText(accessKey, refreshToken)
      await CacheService.setExpirationForKey(accessKey, 3600)
    } catch (error) {
      return Promise.reject(new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error))
    }
  }
}
