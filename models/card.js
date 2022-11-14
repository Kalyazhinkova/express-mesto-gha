import mongoose from 'mongoose';

const { Schema } = mongoose;

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const urlCheck = /^http[s]*:\/\/.+$/;
        return urlCheck.test(v);
      },
      message: 'Картинка задается в виде ссылки!',
    },
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [{
      type: Schema.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Card = mongoose.model('card', cardSchema);
