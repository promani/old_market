const db = require('../models');

module.exports = {
  show(req, res) {
    res.render('cart', {
      products: req.session.cart,
    });
  },
  async add(req, res) {
    const product = await db.Product.findByPk(req.params.id);
    if (product) {
        req.session.cart ? req.session.cart.push(product) : req.session.cart = [product];
        req.flash('success', 'Product added');
    } else {
        req.flash('warning', 'Product not found');
    }
    res.redirect(req.get('Referrer'));
  },
  remove(req, res) {
    req.session.cart.splice(req.params.order, 1);
    req.flash('warning', 'Product removed');
    res.redirect(req.get('Referrer'));
  },
  clear(req, res) {
    req.session.cart = [];
    res.redirect(req.get('Referrer'));
  },
  buy(req, res) {
    res.render('default');
  },
};
