import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import { ContactCardService } from '@services/contactCard'
import { DatabaseService } from '@services/database'

const service = new ContactCardService()
const client = new PrismaClient()

describe('Contact service', () => {
  let profileId: string
  let hostId: string
  let guestId: string
  let contactCardId: string

  beforeAll(async () => {
    await DatabaseService.connect()

    profileId = await client.profile
      .create({
        data: {
          username: faker.internet.userName(),
        },
      })
      .then((reply) => reply.id)

    hostId = await client.user
      .create({
        data: {
          profileId,
          accountType: 'STANDARD',
          email: faker.internet.email(),
          hash: faker.datatype.uuid(),
        },
      })
      .then((reply) => reply.id)

    guestId = await client.profile
      .create({
        data: {
          username: faker.internet.userName(),
        },
      })
      .then((reply) => reply.id)
  })

  test('When to create', async () => {
    const contactCard = await service.create(hostId, guestId)
    contactCardId = contactCard.id
    expect(contactCard).toBeInstanceOf(Object)
  })

  test('When to recover', async () => {
    const contactCards = await service.getAll(hostId)
    expect(contactCards).toHaveLength(1)
  })

  test('When to delete', async () => {
    await service.exclude(contactCardId)
  })

  afterAll(async () => {
    await client.user.delete({
      where: { id: hostId },
    })
    await client.profile.delete({
      where: { id: profileId },
    })
    await client.profile.delete({
      where: { id: guestId },
    })
    await DatabaseService.disconnect()
  })
})
