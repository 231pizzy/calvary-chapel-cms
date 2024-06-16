import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose'

const contactFormSchema = new Schema({
    banner: { type: String, required: true },
    heroText: { type: String, required: true },
    heroSubtitle: { type: String, required: false, },
    details: { type: String, required: true },
    address: { type: String, required: true },
    // addressLink: { type: String, required: true },
    topics: { type: Array, required: true },
    pageName: { type: String, required: true },
}, { timestamps: true });

const ContactForm = mongoose.models?.ContactForms || model('ContactForms', contactFormSchema)

export default ContactForm