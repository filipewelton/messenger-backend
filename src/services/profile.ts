import { PrismaClient, Profile } from '@prisma/client'

import { ExceptionError } from '@shared/helpers/exceptionError'

const client = new PrismaClient()

export class ProfileService {
  public async create(data: Creation) {
    try {
      const profile = await client.profile.create({
        data,
      })
      return profile
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async get(profileId: string): Promise<Profile> {
    try {
      return await client.profile
        .findFirstOrThrow({
          where: { id: profileId },
        })
        .catch(() => {
          throw new ExceptionError('NOT_FOUND_ERROR', 'User profile not found')
        })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async update(profileId: string, data: Update) {
    try {
      await client.profile.update({
        data,
        where: { id: profileId },
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async exclude(profileId: string): Promise<void> {
    try {
      await client.profile.delete({
        where: { id: profileId }
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}
