import { Model, model, models, Schema } from 'mongoose'

const { Types } = Schema
const schema = new Schema<UserSchema>({
  profile: {
    required: true,
    type: Types.ObjectId,
  },
  contactCards: {
    type: [Types.ObjectId],
  },
  groups: {
    type: [Types.ObjectId],
  },
  devices: {
    type: [Types.ObjectId],
  },
  email: {
    type: Types.String,
    required: true,
    unique: true,
  },
  hash: {
    type: Types.String,
    required: true,
  },
  accountType: {
    type: Types.String,
    required: true,
  },
})

const UserModel: Model<UserSchema> =
  models.user || model('user', schema, 'user')

export { UserModel }
