import mongoose from 'mongoose';

// user schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,   //user first name
        required: true,
        trim: true,
    },
    lastName: {
        type: String,  //user last name
        required: true,
        trim: true,
    },
    email: {
        type: String,   // user email
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,   // password
        required: true,
        minlength: 8,
    },
}, { timestamps: true });


// validate the password length 

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Validate password strength (optional)
        if (this.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

    
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;



