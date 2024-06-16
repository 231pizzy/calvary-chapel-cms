import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const faithSchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    bodyTitle: { type: String, required: true },
    bodyImage: { type: String, required: true },
    sections: { type: Object, required: true },
    pageName: { type: String, required: true },
}, { timestamps: true });

const Faith = mongoose.models?.Faiths || model('Faiths', faithSchema)

export default Faith