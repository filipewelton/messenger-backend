import { ExceptionError } from '@shared/helpers/exceptionError'
import { connect, Connection } from 'mongoose'

class DatabaseService {
  private static connection: Connection

  public static async startConnection(uri: string) {
    try {
      const client = await connect(uri, {
        dbName: process.env.DATABASE_NAME,
      })
      this.connection = client.connection
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }

  public static async stopConnection() {
    try {
      await this.connection.close(true)
    } catch (error) {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    }
  }
}

export { DatabaseService }
