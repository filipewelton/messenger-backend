import { ExceptionError } from '@shared/helpers/exceptionError'
import { UserProfileModel } from '@models/userProfile'

export class UserProfileService {
  public async create(data: Creation) {
    try {
      await new UserProfileModel(data).save()
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async get(profileId: string): Promise<UserProfileSchema> {
    try {
      const profile = await UserProfileModel.findById(profileId)

      if (profile === null) {
        return Promise.reject(
          new ExceptionError('NOT_FOUND_ERROR', 'User profile not found')
        )
      }

      return profile
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async update(profileId: string, data: Update) {
    try {
      await UserProfileModel.findByIdAndUpdate(profileId, {
        $set: data,
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async exclude(profileId: string): Promise<void> {
    try {
      await UserProfileModel.findByIdAndDelete(profileId)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}
