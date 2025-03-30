
const mongoose = require('mongoose');
const validator = require('validator');
const { default: slugify } = require('slugify');


const DiscountSchema = new mongoose.Schema({
  type: { type: String, }, // "percentage" or "fixed"
  value: { type: Number, default: 0 },
  validUntil: { type: Date } // Expiry date for discount
});
const ActivitySchema = new mongoose.Schema({
  activity: { type: String },
  details: { type: String }
});
const ItinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: Date },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [ActivitySchema]
});


const PriceSchema = new mongoose.Schema({
  adult: { type: Number, required: [true, 'Tour package must have a adult price'] },
  child: { type: Number, required: [true, 'Tour package must have a child price'] }
});
const packageSchema = new mongoose.Schema({
  packageName:
   { type: String, 
    required: [true, 'Tour package must have a names'], 
    unique: true, 
    trim: true ,
    maxlength: [50, 'Tour package name should not exceed 50 characters'] ,
    minlength: [10, 'Tour package name should not be less than 10 characters'] ,
    // validate:  [validator.isAlpha,"Tour package name should only contain alphabetic characters"]
  
  },
  slug: String, 
  destination: { type: String, required: [true, 'Tour package must have a destination'] },
  overview: { type: String },
  ratingsAverage: { type: Number, default: 4.5 },
  highlights: { type: [String], required: [true, 'Tour package must have a  highlights'] },
  included: { type: [String], required: [true, 'Tour package must have a included'] },
  excluded: { type: [String] },
  itinerary: { type: [ItinerarySchema], required: [true, 'Tour package must have a  itinerary'] },
  description: { type: String, required: [true, 'Tour package must have a description'] },
  price: { type: PriceSchema, required: [true, 'Tour package must have a price'] },
  rating: { type: Number },
  duration: { type: Number, required: [true, 'Tour package must have a duration'] }, // Duration in days
  availability: { type: Boolean, default: true },
  discount: { type: DiscountSchema, 
      default: null,
}, // Nested discount object
  createdAt: { type: Date, default: Date.now, select: false },// Auto set on creationm
  images: { type: [String], default: [] },
  coverImage: { type: String },
  groupSize: {
    type: Number,
    required: function () {
      return this.category === 'Family' || this.category === 'Group Travel';
    },
    validate: {
      validator: function (value) {
        // Ensure groupSize is not provided for Couple and Solo
        if ((this.category === 'Couple' || this.category === 'Solo') && value !== undefined) {
          return false;
        }
        return true;
      },
      message: 'GroupSize should only be provided for Family or Group Travel categories.'
    }
  },
  category: {
    type: String,
    enum: ['Couple', 'Family', 'Solo', 'Group Travel'],
    required: true
  },

});


packageSchema.pre('save',  function (next) {
  this.slug = slugify(this.packageName, { lower: true });
  next();
});

packageSchema.pre('save',  function (next) {
  
  console.log("===hero")
  next();

});
packageSchema.post('save', function (doc, next) {

  console.log("=====doc",doc)
  next()
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;


