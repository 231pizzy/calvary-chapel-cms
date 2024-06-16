import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const leadershipSchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    leaders: { type: Array, required: true },
    pageName: { type: String, required: true },
}, { timestamps: true });

const Leadership = mongoose.models?.Leaderships || model('Leaderships', leadershipSchema)

export default Leadership