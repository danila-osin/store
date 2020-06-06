const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const keys = require('./keys/keys.dev');

const mainRoutes = require('./routes/mainRoutes');
const courseRoutes = require('./routes/courseRoutes');
const editRoutes = require('./routes/editRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes.js');

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

app.use(varMiddleware);
app.use(userMiddleware);
app.use(flash());

app.use(mainRoutes);
app.use('/courses', courseRoutes);
app.use(editRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

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
