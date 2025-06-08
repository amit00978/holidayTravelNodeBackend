const mongoose = require('mongoose');
const slugify = require('slugify');

const destinationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  tagline: {
    type: String
  },
  highlights: {
    type: [String],
    default: []
  },
  destinationDetails: {
    destination: {
      type: String,
      required: true
    },
    population: {
      type: String
    },
    capitalCity: {
      type: String
    },
    language: {
      type: String
    },
    currency: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Auto-generate slug before saving
destinationSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Destination', destinationSchema);
