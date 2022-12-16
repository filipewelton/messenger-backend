import { faker } from '@faker-js/faker'

import { DatabaseService } from '@services/database'
import { GroupService } from '@services/group'
import { setEnvironmentVariables } from '@shared/helpers/setEnvironmentVariables'

import { deleteGroup } from '../shared/mocks/group'

describe('Group service', () => {
  const service = new GroupService()

  beforeAll(async () => {
    setEnvironmentVariables()

    const { DATABASE_URI } = process.env

    await DatabaseService.startConnection(DATABASE_URI)
  })

  let groupId: string

  test('When to create', async () => {
    const profileId = faker.database.mongodbObjectId()
    groupId = await service.create({
      admins: [profileId],
      members: [profileId],
      name: faker.random.alphaNumeric(),
    })
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
    await deleteGroup(groupId)
    await DatabaseService.stopConnection()
  })
})
