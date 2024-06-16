
import mongoose, { Schema, model } from 'mongoose'

const resourceSchema = new Schema({
    date: { type: String, required: true },
    title: { type: String, required: true },
    scripture: { type: String, required: true },
    bookOfScripture: { type: String, required: true },
    chapter: { type: Number, required: true },
    verse: { type: Object, required: true },
    serviceType: { type: String, required: true },
    speaker: { type: String, required: true },
    isThereCharacterStudies: { type: Boolean, required: false, default: false },
    bibleCharacters: { type: Array, required: false },
    isThereTopicalStudies: { type: Boolean, required: false, default: false },
    conferences: { type: String, required: false },
    topicalStudies: { type: Array, required: false },
    video: { type: String, required: false },
    audio: { type: String, required: false },
    audioDownload: { type: Array, required: false },
    documentDownload: { type: Array, required: false },
    status: { type: String, required: false, default: 'published' },
    pageName: { type: String, required: false },
}, { timestamps: true });

const Resource = mongoose.models?.Resources || model('Resources', resourceSchema)

export default Resource