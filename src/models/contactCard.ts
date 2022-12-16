import { Model, model, models, Schema } from 'mongoose'

const { Types } = Schema
const schema = new Schema<ContactCardSchema>({
  user1: {
    type: Types.ObjectId,
    required: true,
  },
  user2: {
    type: Types.ObjectId,
    required: true,
  },
})

export const ContactCardModel: Model<ContactCardSchema> =
  models['contact-card'] || model('contact-card', schema, 'contact-card')
