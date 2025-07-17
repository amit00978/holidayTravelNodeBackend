const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const  crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  phone: { type: String, required: false, default: "" },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    required: false // Optional if you don't want to require a photo
  },
  role: {
    type: String,
    enum: ['User', 'admin', 'travelAgent'],
    default: 'User'
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8, // You can adjust the minimum length as needed,
    select: false // Don't expose the password field in the response

  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v === this.password; // Ensures the passwordConfirm matches the password
      },
      message: 'Passwords do not match'
    }
  },
  otp:{
    type: String,
    trim:true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire : Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});



// Password encryption middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it's being updated

  this.password = await bcrypt.hash(this.password, 12); // Hash the password using bcrypt
  this.passwordConfirm = undefined; // Remove passwordConfirm field to prevent saving it
  next(); // Continue to the next middleware or save the document
});

userSchema.post('save', function (doc, next) {
  this.password = undefined; // Remove password field to prevent returning it in the response
  next();
})

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp
  }

  // False means not changed
  return false;
}

userSchema.methods.comparePassowrd = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken = async function () {
const resetToken = crypto.randomBytes(32).toString('hex');

  
 this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 this.passwordResetExpire= Date.now()+10*60*1000;
 console.log("===reset token",resetToken)
 return resetToken
}


userSchema.pre('save',function(next){

  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now()-1000;
  next();
})

userSchema.pre('find', function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// You might also want to consider findOneAndUpdate and findOneAndDelete
userSchema.pre('findOneAndUpdate', function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('findOneAndDelete', function (next) {
  this.find({ active: { $ne: false } });
  next();
});

module.exports = mongoose.model('User', userSchema);
