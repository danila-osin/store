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

const varMiddleware = require('./middleware/variables');

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
app.use(flash());

app.use(mainRoutes);
app.use('/courses', courseRoutes);
app.use(editRoutes);
app.use('/auth', authRoutes);

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
