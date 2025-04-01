const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  phone: { type: String, required: false,  default: ""},
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail,"Please provide a valid email"],
  },
  photo: {
    type: String,
    required: false // Optional if you don't want to require a photo
  },
  role: { 
    type: String, 
    enum: ['User', 'Admin', 'Travel Agent'], 
    default: 'User' 
},

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8, // You can adjust the minimum length as needed,

  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v === this.password; // Ensures the passwordConfirm matches the password
      },
      message: 'Passwords do not match'
    }
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});



// Password encryption middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it's being updated

  this.password = await bcrypt.hash(this.password, 12); // Hash the password using bcrypt
  this.passwordConfirm = undefined; // Remove passwordConfirm field to prevent saving it
  next(); // Continue to the next middleware or save the document
});

userSchema.post ('save', function(doc, next) {
  this.password = undefined; // Remove password field to prevent returning it in the response
  next();
})

module.exports = mongoose.model('User', userSchema);
