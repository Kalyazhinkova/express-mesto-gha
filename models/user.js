import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const urlCheck = /^http[s]*:\/\/.+$/;
        return urlCheck.test(v);
      },
      message: 'Аватар задается в виде ссылки!',
    },
  },
});

export const User = mongoose.model('User', userSchema);
