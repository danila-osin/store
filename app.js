const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');

const keys = require('./keys/index');

const mainRoutes = require('./routes/mainRoutes');
const courseRoutes = require('./routes/courseRoutes');
const editRoutes = require('./routes/editRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const app = express();

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.DBURI,
});

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csurf());

app.use(varMiddleware);
app.use(userMiddleware);

app.use(mainRoutes);
app.use('/courses', courseRoutes);
app.use(editRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

function start() {
  try {
    mongoose.connect(keys.DBURI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(keys.PORT, () =>
      console.log(`Server is runnig on port: ${keys.PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
}

start();
