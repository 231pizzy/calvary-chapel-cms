
import mongoose, { Schema, model } from 'mongoose'

const metaSchema = new Schema({
    tag: { type: String, required: true },
    parent: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

const Meta = mongoose.models?.Metas || model('Metas', metaSchema)

export default Meta