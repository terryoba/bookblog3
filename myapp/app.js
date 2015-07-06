var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/post');
var account = require('./routes/account');

var passport = require('passport') , FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

// mongoLAb db connect
mongoose.connect('mongodb://terryoba:740824@ds061308.mongolab.com:61308/bookblog3');

mongoose.connection.on('open' , function(){
console.log('mongoose.connect open');
});

mongoose.connection.on('error' , function(){
console.log('mongoose.connect error');
});

// define post schema table
var BlogPost = new mongoose.Schema({
    title     : { type: String}
  , content   : { type: String}
  , userId : { type: mongoose.Schema.Types.ObjectId , ref:'User'}
});

// define user schema table
var user = new mongoose.Schema({
    username     : { type: String , unique: true , select:false} ,
    displayname   : { type: String , unique: true } ,
    email : {type: String , unique: true , select:false} ,
	createtime : {type: Date , default : Date.now , select:false } ,
	facebook : {type: Object , select:false}
});

// set model
var BlogModel = mongoose.model('Post', BlogPost);
var User = mongoose.model('User', user);

app.db = {
    model: {
        Post: BlogModel ,
		Passport : passport ,
		User : User
    }
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));

//
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: "1514039178837526",
    clientSecret: "9bcd7a5aecdc7875f2a46e19284f92d6",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
	var instance = {
      "facebook._json.id" : profile._json.id
    };

    app.db.model.User.findOne(instance, function(err,user){
	   if(!user) {
	    var User = {
		    username : profile.username ,
            displayname : profile.displayName ,
	        email : "terryoba@gmail.com" ,
	        facebook : profile};
	        var doc = new app.db.model.User(User);
            doc.save();
		    user = doc;
	  }
	  return done(null, user);  
	});
  }
));

app.get('/auth/facebook', passport.authenticate('facebook',{ display: 'touch' }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user');
});

app.get('/logout', function(req, res){
  //req.logout();
  req.session.destroy(function(error){
	 res.send("¦¨¥\§R°£session");
  });
});

app.use('/', routes);
app.use('/users', users);
app.use('/', posts);
app.use('/', account);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
