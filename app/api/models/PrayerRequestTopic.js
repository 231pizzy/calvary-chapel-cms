import moment from 'moment';
import mongoose, { Schema, model, } from 'mongoose'

const prayerRequestTopicSchema = new Schema({
    title: { type: String, required: true },
    pageName: { type: String, required: false },
}, { timestamps: true });

const PrayerRequestTopic = mongoose.models?.PrayerRequestTopics || model('PrayerRequestTopics', prayerRequestTopicSchema)

export default PrayerRequestTopic