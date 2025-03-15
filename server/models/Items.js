import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category', // Assuming there's a Category model
        required: true
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory', // Assuming there's a Subcategory model
        required: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true // Trims whitespace
    },
    itemPrice: {
        type: Number,
        required: true,
        min: 0 // Ensures price is non-negative
    },
    gst: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    minimumStock: {
        type: Number
    },
    itemDiscount: {
        type: Number
    },
    image: {
        type: String
    },
    supplierName: {
        type: String,
        required: true
    },
    supplierEmail: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt fields
});

export default mongoose.model("Item", ItemSchema);
