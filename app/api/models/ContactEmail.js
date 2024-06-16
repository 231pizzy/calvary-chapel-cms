import mongoose, { Schema, model, } from 'mongoose'

const contactEmailSchema = new Schema({
    title: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, required: false, default: false },
    pageName: { type: String, required: false },
}, { timestamps: true });

const ContactEmail = mongoose.models?.ContactEmails || model('ContactEmails', contactEmailSchema)

export default ContactEmail