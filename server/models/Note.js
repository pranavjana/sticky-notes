import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    default: 'New Note'
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
      default: 200,
      min: 150,  // Minimum size
      max: 400   // Maximum size
    },
    height: {
      type: Number,
      required: true,
      default: 200,
      min: 150,  // Minimum size
      max: 400   // Maximum size
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
  
  // Ensure size stays within bounds
  if (this.size) {
    this.size.width = Math.max(150, Math.min(400, this.size.width));
    this.size.height = Math.max(150, Math.min(400, this.size.height));
  }
  
  next();
});

export default mongoose.model('Note', noteSchema); 