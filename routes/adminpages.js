var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
var Comment = require('./../models/comment.js');
var Answer = require('./../models/answer.js');
var Request = require('./../models/request.js');
var Bkanswer = require('./../models/bkanswer.js');
var Bkcomment = require('./../models/bkcomment.js');
const { ensureAuthenticated, forwardAuthenticated } = require('./../config/auth');
var Blog = require('./../models/blog.js');
var Admin = require('./../models/admin.js');
var Author = require('./../models/author.js');
var Sermon = require('./../models/sermon.js');
var Event = require('./../models/event.js');
var Book = require('./../models/book.js');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const audioMimeTypes = ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/x-wav', 'audio/x-aac', 'audio/mp3']



router.get('/login', forwardAuthenticated, function (req, res) {
  res.render('admin/login')
})

router.post('/adminlogin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: 'login',
    failureFlash: true
  })(req, res, next);
});




router.get('/', ensureAuthenticated, async function (req, res) {
  const authors = await Author.find()
  const sermons = await Sermon.find()
  const blogs = await Blog.find()
  const books = await Book.find()
   const requests = await Request.find()
   const params = {
    requests: requests,
      authors: authors,
      blogs: blogs,
      sermons: sermons,
      books: books
    }
  res.render('admin/dashboard', params)
  console.log()
})

router.get('/addpost', ensureAuthenticated,  async function (req, res) {
  var authors = await Author.find({}).sort({ createdAt: 'desc'})

   const params = {
      authors: authors,
      blog: new Blog()
    }
  res.render('admin/upblog', params)
})

router.get('/register', ensureAuthenticated,  function (req, res) {
  res.render('admin/register')
})

router.get('/editblog', ensureAuthenticated, async function (req, res) {
   //var authors = await Author.find({'blog.author[]': req.params.id})
  const blogs = await Blog.find().sort({ createdAt: 'desc'}).populate('author')
  const params = {
      //authors: authors,
      blogs: blogs
    }
   res.render('admin/editblog', params)
})

router.get('/authoradd', ensureAuthenticated, function (req, res) {
  res.render('admin/authoradd', { author: new Author()})
})

router.get('/authoredit', ensureAuthenticated, async function (req, res) {
  const authors = await Author.find().sort({ createdAt: 'desc'})
   res.render('admin/authoredit', {authors: authors})
})

router.get('/sermonadd', ensureAuthenticated, function (req, res) {
  res.render('admin/sermonadd', { sermon: new Sermon()})
})

router.get('/sermonedit', ensureAuthenticated, async function (req, res) {
  const sermons = await Sermon.find().sort({ createdAt: 'desc'})
   res.render('admin/sermonedit', {sermons: sermons})
})

router.get('/eventadd', ensureAuthenticated, function (req, res) {
  res.render('admin/eventadd', { event: new Event()})
})

router.get('/eventedit', ensureAuthenticated, async function (req, res) {
  const events = await Event.find().sort({ createdAt: 'desc'})
   res.render('admin/eventedit', {events: events})
})

router.get('/blogcomments', ensureAuthenticated, async function (req, res) {
 var blogs = await Blog.find({}).sort({ createdAt: 'desc'}).populate('author').populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path:'answers',
        model: 'Answer',
      }})
   
   res.render('admin/blogcomments', {blogs: blogs})
})

router.delete('/bloged/:id/comments', ensureAuthenticated, async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  req.blog = await Blog.updateOne({ _id: req.params.id }, { $pull: { comments: req.body.commentid } })
 
    .then(comment => {
      return Comment.deleteOne({_id: req.body.commentid});
    })
    .then(answer => {
      return Answer.deleteMany({commentid: req.body.commentid} );
      })
    .then(blog => {
      res.redirect('/admin/blogcomments');
    })
    .catch(err => {
      console.log(err);
    });
    });

router.delete('/bloged/:id/replys', ensureAuthenticated, async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  req.comment = await Comment.updateOne({ _id: req.params.id }, { $pull: { answers: req.body.answerid } })
 
    .then(answer => {
      return Answer.deleteOne({_id: req.body.answerid});
    })
    .then(blog => {
      res.redirect('/admin/blogcomments');
    })
    .catch(err => {
      console.log(err);
    });
    });



router.get('/bookcomments', ensureAuthenticated, async function (req, res) {
  var books = await Book.find({}).sort({ createdAt: 'desc'}).populate({
      path: 'bkcomments',
      model: 'Bkcomment',
      populate: {
        path:'bkanswers',
        model: 'Bkanswer',
      }})
   
   res.render('admin/bookcomments', {books: books})
});

router.delete('/booked/:id/comments', ensureAuthenticated, async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  req.book = await Book.updateOne({ _id: req.params.id }, { $pull: { bkcomments: req.body.bkcommentid } })
 
    .then(comment => {
      return Bkcomment.deleteOne({_id: req.body.bkcommentid});
    })
    .then(answer => {
      return Bkanswer.deleteMany({commentid: req.body.bkcommentid} );
      })
    .then(blog => {
      res.redirect('/admin/bookcomments');
    })
    .catch(err => {
      console.log(err);
    });
    });


router.delete('/booked/:id/replys', ensureAuthenticated, async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  req.bkcomment = await Bkcomment.updateOne({ _id: req.params.id }, { $pull: { bkanswers: req.body.bkanswerid } })
 
    .then(answer => {
      return Bkanswer.deleteOne({_id: req.body.bkanswerid});
    })
    .then(blog => {
      res.redirect('/admin/bookcomments');
    })
    .catch(err => {
      console.log(err);
    });
    });


router.post('/approve', ensureAuthenticated, async function (req, res) {
await Request.updateOne({ _id: req.body.requestid }, { $set: { approval: req.body.approve }})
  res.redirect('/admin/requests')
})

router.get('/reviewadd', ensureAuthenticated, async function (req, res) {
  var authors = await Author.find({}).sort({ createdAt: 'desc'})
   const params = {
      authors: authors,
      book: new Book()
    }
  res.render('admin/reviewadd', params)
})

router.get('/requests', ensureAuthenticated, async function (req, res) {
  var requests = await Request.find({}).sort({ createdAt: 'desc'})
   const params = {
      requests : requests
    }
  res.render('admin/requests', params)
})


router.get('/reviewedit', ensureAuthenticated, async function (req, res) {
  const books = await Book.find().sort({ createdAt: 'desc'}).populate('writers')
  const params = {
      books: books
    }
   res.render('admin/reviewedit', params)
})

//display adn remove admins

router.get('/admins', ensureAuthenticated, async function (req, res) {
  const admins = await Admin.find().sort({ createdAt: 'desc'})
  
  res.render('admin/admins', {admins : admins,} )
})

router.delete('/admins/:id', ensureAuthenticated, async (req, res) => {

    req.admin = await Admin.findByIdAndDelete(req.params.id)
    res.redirect('/admin/admins')
})


//add admin
//

router.post('/addadmin', ensureAuthenticated, async function (req, res, next) {
req.admin = new Admin()
  next()
}, saveAdminAndRedirect('register'))

// admin function
function saveAdminAndRedirect(path){
    return async (req, res) =>{
       if (req.body.blimage == null) return
  const blimage = JSON.parse(req.body.blimage)
  if (blimage != null && imageMimeTypes.includes(blimage.type)) {
    var admin = req.admin
    const hashedPassword = await bcrypt.hash(req.body.InputPassword, 10)
    admin.firstname = req.body.FirstName
    admin.lastname = req.body.LastName
    admin.email = req.body.Email
    admin.password = hashedPassword
    admin.coverImage = new Buffer.from(blimage.data, 'base64')
    admin.coverImageType = blimage.type
  try {
   admin = await admin.save()
   admin.then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
    res.redirect('/admins')
      })} catch(e) {
        res.render(`admin/${path}`)
      }
    }
}}

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
});
//

//do not edit

router.get('/blog/:slug', ensureAuthenticated, async function (req, res){
	var blog = await Blog.findOne({slug: req.params.slug})
	if (blog == null) res.redirect("/admin/editblog")
	 res.render('admin/show', {blog: blog})

})

//post
router.post('/editblog',ensureAuthenticated, async function (req, res, next) {
  req.blog = new Blog()
  next()
}, saveArticleAndRedirect('upblog'))

//put
router.put('/blog/:id', ensureAuthenticated, async function (req, res, next) {
		req.blog  = await Blog.findById(req.params.id)
		next()
}, saveArticleAndRedirect('edit'))




router.delete('/blog/:id', ensureAuthenticated, async (req, res) => {

		req.blog = await Blog.findByIdAndDelete(req.params.id)
		res.redirect('/admin/editblog')
})



router.get('/edit/:id', ensureAuthenticated, async function (req, res) {
	var blog = await Blog.findById(req.params.id)
   var authors = await Author.find({})
  const params = {
      authors: authors,
      blog: blog
    }
  res.render('admin/edit', params)
})



function saveArticleAndRedirect(path){
   
   	return async (req, res) =>{
       if (req.body.blimage == null) return
  const blimage = JSON.parse(req.body.blimage)
  if (blimage != null && imageMimeTypes.includes(blimage.type)) {
		var blog = req.blog
  	blog.title = req.body.title
    blog.author = req.body.authors
  	blog.description = req.body.description
  	blog.markdown = req.body.markdown
     blog.coverImage = new Buffer.from(blimage.data, 'base64')
    blog.coverImageType = blimage.type
  try {
  	blog = await blog.save()
  	res.redirect(`/admin/blog/${blog.slug}`)
  	  } catch(e) {
  	  	res.render(`admin/${path}`, {blog: blog})
  	  }
  	}
}}
//temp

//authors


//do not edit

//post
router.post('/authoredit', ensureAuthenticated, async function (req, res, next) {
  req.author = new Author()
  next()
}, saveAuthorAndRedirect('authoradd'))

//put
router.put('/author/:id', ensureAuthenticated, async function (req, res, next) {
    req.author  = await Author.findById(req.params.id)
    next()
}, saveAuthorAndRedirect('authoreditor'))




router.delete('/author/:id', ensureAuthenticated, async (req, res) => {
   req.author = await Author.findByIdAndDelete(req.params.id)
    res.redirect('/admin/authoredit')
})



router.get('/authoreditor/:id', ensureAuthenticated, async function (req, res) {
  var author = await Author.findById(req.params.id)
  res.render('admin/authoreditor', { author: author})
})



function saveAuthorAndRedirect(path){
       return async (req, res) =>{
       if (req.body.authorimage == null) return
  const authorimage = JSON.parse(req.body.authorimage)
  if (authorimage != null && imageMimeTypes.includes(authorimage.type)) {
    var author = req.author
    author.name = req.body.name
    author.description = req.body.description
     author.coverImage = new Buffer.from(authorimage.data, 'base64')
    author.coverImageType = authorimage.type
  try {
    author = await author.save()
    res.redirect(`/admin/authoredit`)
      } catch(e) {
        res.render(`admin/${path}`, {author: author})
      }
    }
}}


//sermons


//post
router.post('/sermonedit', ensureAuthenticated, async function (req, res, next) {
  req.sermon = new Sermon()
  next()
}, saveSermonAndRedirect('sermonadd'))



router.delete('/sermon/:id', ensureAuthenticated, async (req, res) => {
    req.sermon = await Sermon.findByIdAndDelete(req.params.id)
    res.redirect('/admin/sermonedit')
})


function saveSermonAndRedirect(path){
   
    return async (req, res) =>{
       if (req.body.sermonaudio == null && req.body.blimage == null) return
  const sermonaudio = JSON.parse(req.body.sermonaudio)
  const blimage = JSON.parse(req.body.blimage)
  if (sermonaudio != null && audioMimeTypes.includes(sermonaudio.type)) {
     if (blimage != null && imageMimeTypes.includes(blimage.type)) {
    var sermon = req.sermon
    sermon.title = req.body.title
    sermon.eventname = req.body.eventname
    sermon.eventdate = new Date(req.body.eventdate)
   sermon.speaker = req.body.speaker
   sermon.description = req.body.description
   sermon.audio = new Buffer.from(sermonaudio.data, 'base64')
   sermon.audioType = sermonaudio.type
   sermon.coverImage = new Buffer.from(blimage.data, 'base64')
   sermon.coverImageType = blimage.type
  try {
   sermon = await sermon.save()
    res.redirect(`/admin/sermonedit`)
      } catch(e) {
        res.render(`admin/${path}`, {sermon:sermon})
      }
    }
}}}




// Events

//post
router.post('/eventedit', ensureAuthenticated, async function (req, res, next) {
  req.event = new Event()
  next()
}, saveEventAndRedirect('eventadd'))

//put
router.put('/event/:id', ensureAuthenticated, async function (req, res, next) {
    req.event  = await Event.findById(req.params.id)
    next()
}, saveEventAndRedirect('eventeditor'))




router.delete('/event/:id', ensureAuthenticated, async (req, res) => {
    req.event = await Event.findByIdAndDelete(req.params.id)
    res.redirect('/admin/eventedit')
})



router.get('/eventeditor/:id', ensureAuthenticated, async function (req, res) {
  var event = await Event.findById(req.params.id)
  res.render('admin/eventeditor', {event: event})
})



function saveEventAndRedirect(path){
   
    return async (req, res) =>{
       if (req.body.coverImage == null) return
  const coverImage = JSON.parse(req.body.coverImage)
  if (coverImage != null && imageMimeTypes.includes(coverImage.type)) {
    var event = req.event
    event.eventname = req.body.eventname
    event.eventdate = new Date(req.body.eventdate)
   event.starttime = req.body.starttime
    event.description = req.body.description
     event.eventImage = new Buffer.from(coverImage.data, 'base64')
    event.eventImageType = coverImage.type
  try {
    event = await event.save()
    res.redirect(`/admin/eventedit`)
      } catch(e) {
        res.render(`admin/${path}`, {event: event})
      }
    }
}}

// book reviews
router.get('/book/:bookslug', ensureAuthenticated, async function (req, res){
  var book = await Book.findOne({bookslug: req.params.bookslug})
  if (book == null) res.redirect("/admin/reviewedit")
   res.render('admin/reviewshow', {book: book})

})

//post
router.post('/reviewedit', ensureAuthenticated, async function (req, res, next) {
  req.book = new Book()
  next()
}, saveBookAndRedirect('reviewadd'))

//put
router.put('/book/:id', ensureAuthenticated, async function (req, res, next) {
    req.book  = await Book.findById(req.params.id)
    next()
}, saveBookAndRedirect('revieweditor'))




router.delete('/book/:id', ensureAuthenticated, async (req, res) => {

    req.book = await Book.findByIdAndDelete(req.params.id)
    res.redirect('/admin/reviewedit')
})



router.get('/revieweditor/:id', ensureAuthenticated, async function (req, res) {
  var book = await Book.findById(req.params.id)
   var authors = await Author.find({})
  const params = {
      authors: authors,
      book: book
    }
  res.render('admin/revieweditor', params)
})



function saveBookAndRedirect(path){
   
    return async (req, res) =>{
       if (req.body.coverImage == null) return
  const coverImage = JSON.parse(req.body.coverImage)
  if (coverImage != null && imageMimeTypes.includes(coverImage.type)) {
    var book = req.book
    book.title = req.body.title
    book.author = req.body.bkauthor
    book.publisher = req.body.publisher
    book.description = req.body.description
    book.writer = req.body.writers
    book.markdown = req.body.markdown
    book.coverImage = new Buffer.from(coverImage.data, 'base64')
    book.coverImageType = coverImage.type
  try {
    book = await book.save()
    res.redirect(`/admin/book/${book.bookslug}`)
      } catch(e) {
        res.render(`admin/${path}`, {book: book})
      }
    }
}}


//Exports
module.exports = router

