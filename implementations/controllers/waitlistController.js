const Waitlist = require('../models/Waitlist');

const waitlistController = {
  addToWaitlist: async (req, res) => {
    try {
      const { court_id, requested_date, preferred_time_slot } = req.body;
      const entry = await Waitlist.add({
        user_id: req.user.id,
        court_id,
        requested_date,
        preferred_time_slot
      });
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMyWaitlist: async (req, res) => {
    try {
      const entries = await Waitlist.findByUser(req.user.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  removeFromWaitlist: async (req, res) => {
    try {
      const removed = await Waitlist.remove(req.params.id, req.user.id);
      if (!removed) {
        return res.status(404).json({ error: 'Waitlist entry not found' });
      }
      res.json({ message: 'Removed from waitlist', entry: removed });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = waitlistController;
