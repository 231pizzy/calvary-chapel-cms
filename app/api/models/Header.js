import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const headerSchema = new Schema({
    logo: { type: String, required: true },
    title: { type: String, required: true },
    pageName: { type: String, required: true },
}, { timestamps: true });

const Header = mongoose.models?.Headers || model('Headers', headerSchema)

export default Header