
import mongoose, { Schema, model } from 'mongoose'

const resourceMinistrySchema = new Schema({
    sectionTitle: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const ResourceMinistry = mongoose.models?.ResourceMinistries || model('ResourceMinistries', resourceMinistrySchema)

export default ResourceMinistry