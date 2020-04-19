const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    ImagePath:{
        type: String,
    },
    Title:{
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    Quantity: {
        type: String,
        required: true,
    },
    Bestseller:{
        type: Boolean,
        default: false,
    },
    DateAdded: {
        type: Date,
        default: Date.now,
    },
    DateLastModified: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Products',ProductSchema);