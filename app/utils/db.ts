import mongoose from 'mongoose';

const connectToDatabase = async () => {
  const mongoURI = 'mongodb+srv://mekhareju:user123@cluster0.gakd5.mongodb.net/giftShopDB?retryWrites=true&w=majority';

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

export default connectToDatabase;
