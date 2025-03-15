import mongoose, { Schema } from "mongoose";

const StockSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item', // Reference to the Item model
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0, // Stock quantity must be a non-negative number
    },
    lowStock: {
        type: Boolean,
        default: false, // Will be true if stock is below minimumStock of the related item
    },

})

export default mongoose.model("Stock", StockSchema);
