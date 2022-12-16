import { createHash } from 'crypto'
import { faker } from '@faker-js/faker'

import { setEnvironmentVariables } from '@shared/helpers/setEnvironmentVariables'
import { DatabaseService } from '@services/database'
import { UserService } from '@services/user'
import { ExceptionError } from '@shared/helpers/exceptionError'

import { deleteUser } from '../shared/mocks/user'

describe('User service', () => {
  const service = new UserService()

  beforeAll(async () => {
    setEnvironmentVariables()

    const { DATABASE_URI } = process.env

    await DatabaseService.startConnection(DATABASE_URI)
  })

  const email = faker.internet.email()
  let userId: string

  test('When to create', async () => {
    const hash = createHash('sha512').digest('hex')

    await service.create({
      hash,
      email,
      accountType: 'STANDARD',
      profile: Object(faker.database.mongodbObjectId()),
    })
      .catch(console.log)
  })

  test('When to recover', async () => {
    const user = await service.get('email', email)
    userId = user.id
    expect(user).toBeInstanceOf(Object)
  })

  test('When checking if the user does not exist', async () => {
    const email = faker.internet.email()
    await service.checkIfDoesNotExist(email)
      .catch((error) => expect(error).toBeInstanceOf(ExceptionError))
  })

  test('When to update group list', async () => {
    const groupId = faker.database.mongodbObjectId()
    await service.updateGroupList(userId, groupId)
    const user = await service.get('email', email)
    const groupList = user.groups.map((value) => String(value))
    expect(groupList).toContain(groupId)
  })

  test('When to update contact cards', async () => {
    const contactCardId = faker.database.mongodbObjectId()
    await service.updateContactCards(userId, contactCardId)
    const user = await service.get('email', email)
    const contactCards = user.contactCards.map((value) => String(value))
    expect(contactCards).toContain(contactCardId) 
  })

  afterAll(async () => {
    await deleteUser(email)
    await DatabaseService.stopConnection()
  })
})
