import { DatabaseService } from '@services/database'

describe('Database service', () => {
  test('Connect', async () => {
    await DatabaseService.connect()
  })

  test('Disconnect', async () => {
    await DatabaseService.disconnect()
  })
})
