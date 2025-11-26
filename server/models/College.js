const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  academics: { type: Number, min: 1, max: 5, required: true },
  mentalHealth: { type: Number, min: 1, max: 5, required: true },
  placements: { type: Number, min: 1, max: 5, required: true },
  infrastructure: { type: Number, min: 1, max: 5, required: true },
  faculty: { type: Number, min: 1, max: 5, required: true }
});

const costBreakdownSchema = new mongoose.Schema({
  tuition: { type: Number, required: true },
  hostel: { type: Number, required: true },
  mess: { type: Number, required: true },
  otherFees: { type: Number, default: 0 },
  additionalCharges: { type: Number, default: 0 }
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  placementRate: { type: Number, min: 0, max: 100, required: true },
  facultyCount: { type: Number, required: true }
});

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  overallRating: { type: Number, min: 1, max: 5, required: true },
  ratings: { type: ratingSchema, required: true },
  cost: { type: costBreakdownSchema, required: true },
  departments: [departmentSchema],
  website: { type: String },
  description: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp on save
collegeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('College', collegeSchema);
