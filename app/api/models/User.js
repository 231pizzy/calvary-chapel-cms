import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import moment from 'moment';

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: 'Admin' },
    fullName: { type: String, required: false },
    profilePicture: { type: String, required: false },
}, { timestamps: true });

const User = mongoose.models?.Users || model('Users', userSchema)

const adminEmail = 'ikenna.isineyi@brilloconnetz.com'
const adminPassword = 'admin';

//Create admin acceount if it doesnt exist
User.find({ role: 'Admin' }).then(data => {
    if (!data?.length) {
        bcrypt.hash(adminPassword, Number(process.env.SALT), (err, hash) => {
            if (err) {
                console.log('hash err', err)
            }
            else {
                const admin = new User({
                    email: 'ikenna.isineyi@brilloconnetz.com',
                    password: hash,
                    role: 'Admin',
                    fullName: 'Admin Admin',
                    profilePicture: 'default.png',
                })

                admin.save();
            }

        })
    }
})

export default User