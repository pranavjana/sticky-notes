import mongoose from 'mongoose';

const dashboardSettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'Sticky Notes Dashboard'
  }
}, {
  timestamps: true
});

const DashboardSettings = mongoose.model('DashboardSettings', dashboardSettingsSchema);

export default DashboardSettings; 