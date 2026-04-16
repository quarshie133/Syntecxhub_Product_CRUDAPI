const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct,
} = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .patch(patchProduct)
    .delete(deleteProduct);

module.exports = router;

