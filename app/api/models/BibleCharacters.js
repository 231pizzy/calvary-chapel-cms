
import mongoose, { Schema, model } from 'mongoose'

const bibleCharacterSchema = new Schema({
    name: { type: String, required: false },
    sectionTitle: { type: String, required: true },
    sectionId: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const BibleCharacter = mongoose.models?.BibleCharacters || model('BibleCharacters', bibleCharacterSchema)

export default BibleCharacter