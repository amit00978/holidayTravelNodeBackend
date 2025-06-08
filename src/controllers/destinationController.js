const Destination = require('../models/destinationModal');

// Saving a new destination
exports.saveDestination = async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json({ message: 'Destination saved successfully', data: destination });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get destination by slug
exports.getDestinationBySlug = async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
