import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true,
    default: 'New Note'
  },
  emoji: {
    type: String,
    default: '📝'
  },
  position: {
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    }
  },
  size: {
    width: {
      type: Number,
      required: true,
      default: 350
    },
    height: {
      type: Number,
      required: true,
      default: 350
    }
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  backgroundColor: {
    type: String,
    default: '#fef3c7' // default light yellow color
  },
  zIndex: {
    type: Number,
    default: 0
  }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Note', noteSchema); 