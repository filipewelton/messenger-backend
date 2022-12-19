import { PrismaClient } from '@prisma/client'

import { ExceptionError } from '@shared/helpers/exceptionError'

const client = new PrismaClient()

export class ContactCardService {
  public async create(hostId: string, guestId: string) {
    try {
      const contactCard = await client.contactCard.create({
        data: {
          hostId,
          guestId,
        },
      })
      return contactCard
    } catch (error) {
      return Promise.reject(
        new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
      )
    }
  }

  public async getAll(hostId: string) {
    try {
      const contactCards = await client.contactCard.findMany({
        where: { hostId },
      })
      return contactCards
    } catch (error) {
      return Promise.reject(
        new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
      )
    }
  }

  public async exclude(contactCardId: string) {
    try {
      await client.contactCard.delete({
        where: { id: contactCardId },
      })
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}
