
import mongoose, { Schema, model } from 'mongoose'

const guestSpeakerSchema = new Schema({
    image: { type: String, required: false },
    name: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const GuestSpeaker = mongoose.models?.GuestSpeakers || model('GuestSpeakers', guestSpeakerSchema)

export default GuestSpeaker