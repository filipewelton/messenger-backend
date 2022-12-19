import { createHash } from 'crypto'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import { DatabaseService } from '@services/database'
import { UserService } from '@services/user'
import { ExceptionError } from '@shared/helpers/exceptionError'

describe('User service', () => {
  const service = new UserService()
  const client = new PrismaClient()

  beforeAll(async () => {
    await DatabaseService.connect()
  })

  const email = faker.internet.email()
  let profileId: string

  test('When to create', async () => {
    const hash = createHash('sha512').digest('hex')
    profileId = await client.profile
      .create({
        data: {
          username: faker.internet.userName(),
        },
      })
      .then((reply) => reply.id)

    await service.create({
      hash,
      email,
      profileId,
      accountType: 'STANDARD',
    })
  })

  test('When to recover', async () => {
    const user = await service.get('email', email)
    expect(user).toBeInstanceOf(Object)
  })

  test('When checking if the user does not exist', async () => {
    const email = faker.internet.email()
    await service.checkIfDoesNotExist(email)
      .catch((error) => expect(error).toBeInstanceOf(ExceptionError))
  })

  afterAll(async () => {
    await client.user.delete({
      where: { email },
    })

    await client.profile.delete({
      where: { id: profileId },
    })

    await DatabaseService.disconnect()
  })
})
