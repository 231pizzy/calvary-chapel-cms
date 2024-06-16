import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const liveLinkSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const LiveLink = mongoose.models?.LiveLinks || model('LiveLinks', liveLinkSchema)

export default LiveLink