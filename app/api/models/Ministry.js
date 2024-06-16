import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose'

const ministrySchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    bodyImage: { type: String, required: true },
    bodyTitle: { type: String, required: true },
    bodyDetails: { type: String, required: true },
    ministry: { type: String, required: true },
}, { timestamps: true });

const Ministry = mongoose.models?.Ministries || model('Ministries', ministrySchema)

export default Ministry