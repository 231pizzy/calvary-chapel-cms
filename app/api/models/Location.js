import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const locationSchema = new Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    coordinate: { type: Object, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const Location = mongoose.models?.Locations || model('Locations', locationSchema)

export default Location