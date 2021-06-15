const db = require('../models');

module.exports = {
  index(req, res, next) {
    db.Product.findAll({
      include: [
        { association: 'comments' },
      ],
    })
      .then((products) => {
        res.render('index', {
          products,
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  async show(req, res) {
    const product = await db.Product.findByPk(req.params.id, { include: [{ association: 'user' }] });
    const comments = await db.Comment.findAll(
      { where: { product_id: req.params.id }, include: [{ association: 'user' }] },
    );

    res.render('product/show', {
      product,
      comments,
    });
  },
  add(req, res) {
    if (req.method === 'POST') {
      req.body.user_id = req.session.user.id;
      if (req.body.url) req.body.image = req.body.url;
      if (req.file) req.body.image = (req.file.destination + req.file.filename).replace('public', '');
      db.Product.create(req.body)
        .then(() => {
          req.flash('success', 'Product saved successful');
          res.redirect('/');
        })
        .catch(() => {
          req.flash('danger', 'Something went wrong');
          res.redirect(req.get('Referrer'));
        });
    }

    if (req.method === 'GET') {
      res.render('product/add');
    }
  },
  async edit(req, res, next) {
    const product = await db.Product.findByPk(req.params.id);
    if (req.method === 'POST') {
      product.update(req.body)
        .then((product) => {
          req.flash('success', 'Product updated successful');
          res.redirect('/products/' + product.id);
        })
        .catch((error) => {
          next(error);
        });
    }

    if (req.method === 'GET') {
      res.render('product/edit', {
        product,
      });
    }
  },
  delete(req, res, next) {
    db.Product.destroy({ where: { id: req.params.id } })
      .then(() => {
        req.flash('warning', 'Product deleted');
        res.redirect('/');
      })
      .catch((error) => {
        req.flash('danger', 'Something went wrong');
        next(error);
      });
  },
  comment(req, res) {
    req.body.user_id = req.session.user ? req.session.user.id : 0;
    req.body.product_id = req.params.id;
    db.Comment.create(req.body)
      .then(() => {
        req.flash('success', 'Comment saved successful');
        res.redirect(req.get('Referrer'));
      })
      .catch((error) => {
        res.send(error);
        req.flash('danger', 'Something went wrong');
        res.redirect(req.get('Referrer'));
      });
  },
};
