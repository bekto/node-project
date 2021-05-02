import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import uniqueValidator from 'mongoose-unique-validator';
import IUser from '../interfaces/user';


const UserSchema: Schema = new Schema({
    email: { 
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter an valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
},
{
    timestamps: true
});

UserSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('User', UserSchema);