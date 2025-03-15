import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
  category: {
    type: Schema.Types.ObjectId, // Referencing another model
    ref: 'Category', // Name of the model being referenced
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

export default mongoose.model("SubCategory", subCategorySchema);
