const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model("Product", productSchema, "products")