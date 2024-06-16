
import mongoose, { Schema, model } from 'mongoose'

const heroSchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    pageName: { type: String, required: true },
}, { timestamps: true });

const Hero = mongoose.models?.Heroes || model('Heroes', heroSchema)

export default Hero