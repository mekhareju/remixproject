import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
});

export default mongoose.model('Product', productSchema);