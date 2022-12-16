import { faker } from '@faker-js/faker'

import { ContactService } from '@services/contact'
import { DatabaseService } from '@services/database'
import { setEnvironmentVariables } from '@shared/helpers/setEnvironmentVariables'

const service = new ContactService()

describe('Contact service', () => {
  beforeAll(async () => {
    setEnvironmentVariables()
    const { DATABASE_URI } = process.env
    await DatabaseService.startConnection(DATABASE_URI)
  })

  const user1 = faker.database.mongodbObjectId()

  test('When to create', async () => {
    const user2 = faker.database.mongodbObjectId()
    await service.create(user1, user2)
  })

  let contactCardId: string

  test('When to recover', async () => {
    const contactCards = await service.getAll(user1)
    contactCardId = contactCards[0].id
    expect(contactCards).toHaveLength(1)
  })

  test('When to delete', async () => {
    await service.exclude(contactCardId)
  })

  afterAll(async () => await DatabaseService.stopConnection())
})
