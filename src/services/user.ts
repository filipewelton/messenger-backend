import { PrismaClient } from '@prisma/client'

import { ExceptionError } from '@shared/helpers/exceptionError'

const client = new PrismaClient()

export class UserService {
  public async create(data: Creation) {
    try {
      await client.user.create({
        data,
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async get(fieldName: SearchParameter, fieldValue: string) {
    try {
      const user = await client.user.findFirst({
        where: { [fieldName]: fieldValue },
      })

      if (user === null) {
        return Promise.reject(
          new ExceptionError('NOT_FOUND_ERROR', 'User not found')
        )
      }

      return user
    } catch (error) {
      return Promise.reject(
        new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
      )
    }
  }

  public async checkIfDoesNotExist(email: string) {
    try {
      await this.get('email', email)

      return Promise.reject(
        new ExceptionError('CONFLICT_ERROR', 'This user already exists')
      )
    } catch (error) {
      const { type }: ExceptionError = error

      if (type === 'NOT_FOUND_ERROR') {
        return Promise.resolve()
      }

      throw error
    }
  }

  public async validateHash(stored: string, provided: string) {
    if (stored !== provided) {
      throw new ExceptionError('UNAUTHORIZED_ERROR', 'Invalid hash')
    }
  }

  public async validateAccountType(
    stored: AccountTypes,
    provided: AccountTypes
  ) {
    if (stored !== provided) {
      return Promise.reject(
        new ExceptionError('NOT_FOUND_ERROR', 'This account does not exist')
      )
    }

    return Promise.resolve()
  }
}
