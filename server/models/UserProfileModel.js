const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, required: true },  
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
