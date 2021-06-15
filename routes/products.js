const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'public/images/' });

const productController = require('../controllers/product.controller');

router.all('/add', upload.single('image'), productController.add);
router.get('/:id', productController.show);
router.all('/:id/delete', productController.delete);
router.all('/:id/edit', productController.edit);
router.all('/:id/comment', productController.comment);

module.exports = router;
