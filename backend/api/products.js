const express = require('express');
const router = express.Router()

const Product = require('../models/product');

router.get('/', (req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => console.log(err))
})

router.post('/', (req, res) => {
        const { name, type, imageLink, price } = req.body;
        const newProduct = new Product({
            name: name, type: type, imageLink: imageLink, price: price
        })
        newProduct.save()
            .then(() => res.json({
                message: "Created product successfully"
            }))
            .catch(err => res.status(400).json({
                "error": err,
                "message": "Error creating product"
            }))
    })

module.exports = router