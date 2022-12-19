import { PrismaClient } from '@prisma/client'
import { ExceptionError } from '@shared/helpers/exceptionError'

const client = new PrismaClient()

export class DatabaseService {
  public static async connect() {
    return await client.$connect().catch((error) => {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    })
  }

  public static async disconnect() {
    return await client.$disconnect().catch((error) => {
      throw new ExceptionError('THIRD_PARTY_SERVICE_ERROR', error)
    })
  }
}
