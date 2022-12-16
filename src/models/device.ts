import { Model, model, models, Schema } from 'mongoose'

const { Types } = Schema
const schema = new Schema<DeviceSchema>({
  name: {
    type: Types.String,
    required: true,
  },
  ip: {
    type: Types.String,
    required: true,
  },
  platform: {
    type: Types.String,
    required: true,
  },
})

const DeviceModel: Model<DeviceSchema> =
  models.device || model('device', schema, 'device')

export { DeviceModel }
