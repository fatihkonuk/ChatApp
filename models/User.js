const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false,
    }
});


UserSchema.pre('validate', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    } 
    if(this.isModified('username')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true
        });
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;