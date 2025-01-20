import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  price: { type: Number, required: true }, 
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default mongoose.model('Product', productSchema);