import { model, Model, models, Schema } from 'mongoose'

const { Types } = Schema

const schema = new Schema<UserProfileSchema>({
  username: {
    type: Types.String,
    required: true,
    maxlength: 25,
  },
  fullName: {
    type: Types.String,
    maxlength: 50,
  },
  bio: {
    type: Types.String,
    maxlength: 250,
    default: 'Hello guys!',
  },
})

const UserProfileModel: Model<UserProfileSchema> =
  models['user-profile'] || model('user-profile', schema, 'user-profile')

export { UserProfileModel }
