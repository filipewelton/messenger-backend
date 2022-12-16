import { GroupModel } from '@models/group'
import { ExceptionError } from '@shared/helpers/exceptionError'

export class GroupService {
  public async create(data: GroupCreation): Promise<string> {
    try {
      const group = new GroupModel(data)
      await group.save()
      return group.id
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async update(groupId: string, data: GroupUpdate) {
    try {
      await GroupModel.findByIdAndUpdate(groupId, {
        $set: data,
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async get(groupId: string) {
    try {
      const group = await GroupModel.findById(groupId)

      if (group === null) {
        return Promise.reject(
          new ExceptionError('NOT_FOUND_ERROR', 'Group not found')
        )
      }

      return Promise.resolve(group)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async checkIfTheUserIsAdmin(
    admins: string[],
    profileId: string
  ): Promise<void> {
    try {
      if (!admins.includes(profileId)) {
        return Promise.reject(
          new ExceptionError('FORBIDDEM_ERROR', 'User does not have permission')
        )
      }
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async addMemberToTheGroup(groupId: string, profileId: string) {
    try {
      await GroupModel.findByIdAndUpdate(groupId, {
        $push: {
          members: [profileId],
        },
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async checkIfTheUserIsAlreadyInTheMembersList(
    memberList: string[],
    profileId: string
  ): Promise<void> {
    if (memberList.includes(profileId)) {
      return Promise.reject(
        new ExceptionError(
          'CONFLICT_ERROR',
          'This user is already in the member list'
        )
      )
    }
  }
}
