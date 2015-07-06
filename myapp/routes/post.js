var express = require('express');
var router = express.Router();

router.get('/1/post', function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/facebook')
});

/* GET all post. 
router.get('/1/post', function(req, res, next) {
  req.app.db.model.Post.find({}, function (err, docs) {
     res.json(docs);
  });
  console.log('get all post');
});
*/

/* GET all post. */
router.get('/1/post', function(req, res, next) {
  req.app.db.model.Post
  .find({})
  .populate('userId')
  .exec(function (err, docs) {
     res.json(docs);
  });
  console.log('get all post');
});


/* GET post by id */
router.get('/1/post/:id', function(req, res, next) {
  var id = req.user._id; 

  req.app.db.model.Post.findById(id, function (err, docs) {
    res.json(docs);
  });
 
  console.log('get post by id : ' + id);
});

/* GET post by subject */
router.get('/1/post/subject/:subject', function(req, res, next) {
  res.render('index', { title: 'GET post by subject' });
  console.log('GET post by subject');
});

router.post('/1/post', function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/facebook')
});

/* POST post */
router.post('/1/post', function(req, res, next) {
  
  var post = req.app.db.model.Post;
  
  var instance = new post({
    title : req.query.title,
    content : req.query.content,
	userId : req.user._id
  });
  
  instance.save( function(err, user){
    res.send(user);
  });
  console.log('POST post');
});

/* put post */
router.post('/1/post/:id', function(req, res, next) {
  var myId = req.params.id; 

  var instance = {
     title : req.query.title ,
	 content : req.query.content ,
  };
  req.app.db.model.Post.findByIdAndUpdate(myId, instance, function (err, post) {
     res.json(post);
  });
});

/* put subject publish */
router.put('/1/post/:subject/publish', function(req, res, next) {
  res.render('index', { title: 'put subject publish' });
  console.log('put subject publish');
});

/* put subject unpublish */
router.put('/1/post/:subject/unpublish', function(req, res, next) {
  res.render('index', { title: 'put subject unpublish' });
  console.log('put subject unpublish');
});

/* delete post by id */
router.delete('/1/post/:id', function(req, res, next) {
  var myId = req.params.id; 
  req.app.db.model.Post.findByIdAndRemove(myId, function (err, post) {
     res.json(post);
  });
  console.log('delete post by id');
});
module.exports = router;