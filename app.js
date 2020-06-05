const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const keys = require('./keys/keys.dev');

const mainRoutes = require('./routes/mainRoutes');
const courseRoutes = require('./routes/courseRoutes');
const editRoutes = require('./routes/editRoutes');

const app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(mainRoutes);
app.use('/courses', courseRoutes);
app.use(editRoutes);

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
