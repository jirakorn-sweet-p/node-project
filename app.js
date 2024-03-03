require('dotenv').config();


const flash = require('connect-flash');

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
// const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');

// const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 8000;
  
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

// // Connect to DB
connectDB();

global.loggedIn = null;
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(methodOverride('_method'));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } 
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGODB_URI
  // }),
  // cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

//Midleware
app.use('*',(req,res,next) => {
  loggedIn = req.session.userId;
  next();
});

app.use('/logout',(req,res,next) => {
  next();
});


app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// app.locals.isActiveRoute = isActiveRoute; 


app.use('/', require('./server/routes/main'));
// app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});