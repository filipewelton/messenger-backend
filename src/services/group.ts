import { GroupMember, PrismaClient } from '@prisma/client'

import { ExceptionError } from '@shared/helpers/exceptionError'

const client = new PrismaClient()

export class GroupService {
  public async create(data: GroupCreation) {
    try {
      const group = await client.group.create({
        data: {
          name: data.name,
        },
      })

      await client.groupMember.create({
        data: {
          isAdmin: true,
          profileId: data.profileId,
          groupId: group.id,
        },
      })

      return group
    } catch (error) {
      console.log(error)
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async update(groupId: string, data: GroupUpdate) {
    try {
      await client.group.update({
        data,
        where: { id: groupId },
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public async get(groupId: string) {
    return await client.group
      .findFirstOrThrow({
        where: { id: groupId },
      })
      .catch(() => {
        throw new ExceptionError('NOT_FOUND_ERROR', 'Group not found')
      })
  }

  public async checkIfTheUserIsAdmin(member: GroupMember): Promise<void> {
    try {
      if (member.isAdmin === false) {
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
      await client.groupMember.create({
        data: {
          groupId,
          isAdmin: false,
          profileId,
        },
      })
    } catch (error) {
      return
    }
  }

  public async checkIfTheUserIsAlreadyInTheMembersList(
    groupId: string, profileId: string
  ): Promise<void> {
    return await client.groupMember
      .findFirstOrThrow({
        where: { AND: [{ groupId }, { profileId }] }
      })
      .then(() => undefined)
      .catch(() => {
        throw new ExceptionError('NOT_FOUND_ERROR', 'Group not found')
      })
  }
}
