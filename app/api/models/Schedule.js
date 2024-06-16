
import mongoose, { Schema, model } from 'mongoose'

const scheduleSchema = new Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    location: { type: String, required: true },
    serviceType: { type: String, required: true },
    speaker: { type: String, required: true },
    isThereCharacterStudies: { type: Boolean, required: false, default: false },
    bibleCharacters: { type: Array, required: false },
    isThereTopicalStudies: { type: Boolean, required: false, default: false },
    topicalStudies: { type: Array, required: false },
    frequency: { type: String, required: true },
    date: { type: String, required: false },
    conferences: { type: String, required: false },
    endDate: { type: String, required: false },
    weeklyRepeatDays: { type: Array, required: false },
    monthlyRepeatType: { type: String, required: false },
    monthlyRepeatDays: { type: Object, required: false },
    duration: { type: Object, required: true },
    status: { type: String, required: false, default: 'published' },
    resourceId: { type: String, required: false },
    liveLink: { type: String, required: false, },
    pageName: { type: String, required: false },
}, { timestamps: true });

const Schedule = mongoose.models?.Schedules || model('Schedules', scheduleSchema)

Schedule.schema.add({ conferences: { type: String, required: false } })

export default Schedule