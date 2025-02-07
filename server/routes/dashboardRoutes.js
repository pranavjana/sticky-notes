import express from 'express';
import DashboardSettings from '../models/DashboardSettings.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Get dashboard settings
router.get('/', requireAuth, async (req, res) => {
  try {
    let settings = await DashboardSettings.findOne({ userId: req.auth.userId });
    if (!settings) {
      settings = await DashboardSettings.create({
        userId: req.auth.userId,
        title: 'Sticky Notes Dashboard'
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching dashboard settings:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard settings' });
  }
});

// Update dashboard settings
router.patch('/', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    let settings = await DashboardSettings.findOne({ userId: req.auth.userId });
    
    if (!settings) {
      settings = await DashboardSettings.create({
        userId: req.auth.userId,
        title
      });
    } else {
      settings.title = title;
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating dashboard settings:', error);
    res.status(500).json({ error: 'Failed to update dashboard settings' });
  }
});

export default router; 