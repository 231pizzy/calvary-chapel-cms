
import mongoose, { Schema, model } from 'mongoose'

const conferenceSchema = new Schema({
    name: { type: String, required: false },
    sectionTitle: { type: String, required: true },
    sectionId: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const Conference = mongoose.models?.Conferences || model('Conferences', conferenceSchema)

export default Conference