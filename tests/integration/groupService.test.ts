import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import { DatabaseService } from '@services/database'
import { GroupService } from '@services/group'

const client = new PrismaClient()

describe('Group service', () => {
  const service = new GroupService()

  beforeAll(async () => {
    await DatabaseService.connect()
  })

  let profileId: string
  let groupId: string

  test('When to create', async () => {
    profileId = await client.profile
      .create({
        data: {
          username: faker.internet.userName(),
        },
      })
      .then((reply) => reply.id)

    groupId = await service
      .create({
        name: faker.random.word(),
        profileId,
      })
      .then((reply) => reply.id)
  })

  test('When to recover', async () => {
    const reply = await service.get(groupId)
    expect(reply).toBeInstanceOf(Object)
  })

  test('When to update', async () => {
    const groupName = faker.company.name()

    await service.update(groupId, {
      name: groupName,
    })

    const { name } = await service.get(groupId)
    expect(name).toEqual(groupName)
  })

  afterAll(async () => {
    await DatabaseService.disconnect()
  })
})
