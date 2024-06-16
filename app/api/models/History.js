import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose'

const historySchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    section1Image: { type: String, required: true },
    section1Heading: { type: String, required: true },
    section1Text: { type: String, required: true },
    section2Image: { type: String, required: true },
    section2Heading: { type: String, required: true },
    section2Text: { type: String, required: true },
    section3Image: { type: String, required: true },
    section3Heading: { type: String, required: true },
    section3Text: { type: String, required: true },
    pageName: { type: String, required: true },
}, { timestamps: true });

const History = mongoose.models?.Histories || model('Histories', historySchema)

export default History