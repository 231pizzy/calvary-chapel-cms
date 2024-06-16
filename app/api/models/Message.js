import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose'

/*  firstName: '', lastName: '', email: '', message: '', topic: '' */
const messageSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, },
    message: { type: String, required: true },
    topic: { type: String, required: false },
    repliedBy: { type: String, required: false },
    reply: { type: String, required: false },
    status: { type: String, required: false, default: 'unread' },
}, { timestamps: true });

const Message = mongoose.models?.Messages || model('Messages', messageSchema)

export default Message