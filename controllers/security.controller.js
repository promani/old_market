const bcrypt = require('bcryptjs');
const db = require('../models');

const securityController = {
  async login(req, res) {
    const user = await db.User.findOne({ where: { username: req.body.username } });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      if (req.body.remember_me) {
        res.cookie('userId', user.id);
      }
      req.flash('success', 'Welcome!');
      req.session.user = user;
    } else {
      req.flash('danger', 'Wrong user/password combination');
    }
    res.redirect(req.get('Referrer'));
  },
  register(req, res) {
    req.body.password = bcrypt.hashSync(req.body.password);
    db.User.create(req.body)
      .then(() => {
        req.flash('info', 'User register successful!');
        res.redirect('/');
      })
      .catch((error) => {
        req.flash('danger', 'Something went wrong');
        res.send(error);
      });
  },
  logout(req, res) {
    req.session.destroy();
    res.clearCookie('userId');
    return res.redirect('/');
  },
};
module.exports = securityController;
