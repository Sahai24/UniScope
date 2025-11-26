const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  // Hashed user identifier for anonymous but unique user tracking
  userHash: {
    type: String,
    required: true,
    index: true
  },
  // Verified status through .edu email
  isVerified: {
    type: Boolean,
    default: false
  },
  // Overall rating
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Detailed ratings
  ratings: {
    academics: { type: Number, min: 1, max: 5, required: true },
    mentalHealth: { type: Number, min: 1, max: 5, required: true },
    placements: { type: Number, min: 1, max: 5, required: true },
    infrastructure: { type: Number, min: 1, max: 5, required: true },
    faculty: { type: Number, min: 1, max: 5, required: true }
  },
  // AI-moderated content
  pros: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 5;
      },
      message: 'Please provide between 1 and 5 pros'
    }
  },
  cons: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 5;
      },
      message: 'Please provide between 1 and 5 cons'
    }
  },
  advice: {
    type: String,
    maxlength: 500
  },
  // Department/Major this review is focused on
  department: {
    type: String,
    required: true
  },
  // Year of study
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  // Moderation flags
  isFlagged: {
    type: Boolean,
    default: false
  },
  flags: [{
    type: String,
    enum: ['inappropriate', 'spam', 'irrelevant', 'hate_speech', 'other']
  }],
  // AI Moderation results
  moderationResult: {
    isApproved: { type: Boolean, default: false },
    reason: String,
    moderatedAt: Date
  },
  // For the anonymous chat feature
  allowContact: {
    type: Boolean,
    default: false
  },
  // Trust score (0-100)
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
reviewSchema.index({ college: 1, department: 1, createdAt: -1 });
reviewSchema.index({ userHash: 1, college: 1 }, { unique: true });

// Update the updatedAt timestamp on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for overall rating (can be calculated if needed)
reviewSchema.virtual('overallRating').get(function() {
  const { academics, mentalHealth, placements, infrastructure, faculty } = this.ratings;
  return (academics + mentalHealth + placements + infrastructure + faculty) / 5;
});

module.exports = mongoose.model('Review', reviewSchema);
