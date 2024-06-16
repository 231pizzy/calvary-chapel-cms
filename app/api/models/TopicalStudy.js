
import mongoose, { Schema, model } from 'mongoose'

const topicalStudySchema = new Schema({
    sectionTitle: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const TopicalStudy = mongoose.models?.TopicalStudies || model('TopicalStudies', topicalStudySchema)

export default TopicalStudy