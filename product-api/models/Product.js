const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    },
    price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    },
    description: {
        type: String,
        trim: true,
        default: 'No description provided',
    },
    category: {
        type: String,
        required: [true, 'category is required'],
        enum: {
            values: ['electronics', 'clothing', 'food', 'furniture', 'instruments','other'],
            message: '{VALUE} is not a valid category'
        },
        lowercase: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
},
  {timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);