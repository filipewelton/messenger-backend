import { ContactCardModel } from '@models/contactCard'
import { ExceptionError } from '@shared/helpers/exceptionError'

export class ContactService {
  public async create(user1: string, user2: string) {
    try {
      const contactCard = new ContactCardModel({
        user1: Object(user1),
        user2: Object(user2)
      })
      await contactCard.save()
      return
    } catch (error) {
      return Promise.reject(
        new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
      )
    }
  }

  public async getAll(userId: string) {
    try {
      const contactCards = await ContactCardModel.find({
        $or: [{ user1: userId }, { user2: userId }]
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
      await ContactCardModel.findByIdAndDelete(contactCardId)
      return
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}
