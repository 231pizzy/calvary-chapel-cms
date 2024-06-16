import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const footerSchema = new Schema({
    logo: { type: String, required: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
    // addressLink: { type: String, required: true },
    phone: { type: String, required: false },
    facebookLink: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const Footer = mongoose.models?.Footers || model('Footers', footerSchema)

export default Footer