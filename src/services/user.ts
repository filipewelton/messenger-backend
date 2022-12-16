import { ExceptionError } from '@shared/helpers/exceptionError'
import { UserModel } from '@models/user'

export class UserService {
  public async create(data: Creation) {
    try {
      await new UserModel(data)
        .save()
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async get(fieldName: string, fieldValue: string) {
    try {
      const user = await UserModel.findOne({ [fieldName]: fieldValue })

      if (user === null) {
        return Promise.reject(new ExceptionError('NOT_FOUND_ERROR', 'User not found'))
      }

      return user
    } catch (error) {
      return Promise.reject(new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error))
    }
  }

  public async checkIfDoesNotExist(email: string) {
    try {
      await this.get('email', email)
      return Promise.reject(new ExceptionError('CONFLICT_ERROR', 'This user already exists'))
    } catch (error) {
      const err: ExceptionError = error

      if (err.type === 'NOT_FOUND_ERROR') {
        return Promise.resolve()
      }


      throw error
    }
  }

  public async updateGroupList(userId: string, groupId: string) {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        $push: {
          groups: [groupId],
        },
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async updateContactCards(userId: string, contactCardId: string) {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        $push: {
          contactCards: [contactCardId],
        },
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async validateHash(storedHash: string, providedHash: string) {
    if (storedHash !== providedHash) {
      throw new ExceptionError('FORBIDDEM_ERROR', 'Invalid hash')
    }
  }
}
