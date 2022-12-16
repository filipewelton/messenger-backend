import { Model, model, models, Schema } from 'mongoose'

const { Types } = Schema
const schema = new Schema<GroupSchema>({
  admins: {
    type: [Types.ObjectId],
    required: true,
  },
  members: {
    type: [Types.ObjectId],
    required: true,
  },
  name: {
    type: Types.String,
    required: true,
    maxlength: 30,
  },
  description: {
    type: Types.String,
    maxlength: 250,
  },
})

const GroupModel: Model<GroupSchema> =
  models.group || model('group', schema, 'group')

export { GroupModel }
