import { CacheService } from '@services/cache'
import { ExceptionError } from '@shared/helpers/exceptionError'
import { forEachAsync } from '@shared/helpers/forEachAsync'

export class InvitationService {
  public async store(invitationId: string, invitationData: Invitation) {
    await CacheService.switchDatabase(2)
    await CacheService.setJson(invitationId, invitationData)
    await CacheService.setExpirationForKey(invitationId, 604800000)
  }

  public async exclude(invitationId: string) {
    await CacheService.switchDatabase(2)
    await CacheService.getJson(invitationId)
    await CacheService.deleteKey(invitationId)
  }

  public async getAll(guestUserId: string) {
    try {
      const pattern = `${guestUserId}:*`
      const keys = await CacheService.getKeysInAPattern(pattern)
      const invitations: Invitation[] = []

      await forEachAsync(keys, async (key) => {
        const invitation = await CacheService.getJson<Invitation>(key)
        invitations.push(invitation)
      })

      if (invitations.length === 0) {
        return Promise.reject(
          new ExceptionError('NOT_FOUND_ERROR', 'Invitations not found')
        )
      }

      return invitations
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}
