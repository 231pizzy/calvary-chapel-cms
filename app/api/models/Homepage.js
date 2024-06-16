import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose'

const homepageSchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    navigation: { type: Array, required: false },
    services: { type: Array, required: true },
    pageName: { type: String, required: true },
}, { timestamps: true });

const Homepage = mongoose.models?.Homepages || model('Homepages', homepageSchema)

export default Homepage