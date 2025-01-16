import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String }, 
}); 

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;