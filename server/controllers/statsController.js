// server/controllers/statsController.js
// Simple stats controller stub

export default {
  getStats: (req, res) => {
    // TODO: implement real stats logic
    res.json({
      users: 'TBD',
      templates: 'TBD',
      activities: 'TBD',
      timestamp: new Date().toISOString(),
    });
  },
};
