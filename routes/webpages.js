var express = require('express')
var router = express.Router()
var Blog = require('./../models/blog.js');
var Comment = require('./../models/comment.js');
var Answer = require('./../models/answer.js');
var Bkanswer = require('./../models/bkanswer.js');
var Bkcomment = require('./../models/bkcomment.js');
var Request = require('./../models/request.js');
var Author = require('./../models/author.js');
var Sermon = require('./../models/sermon.js');
var Event = require('./../models/event.js');
var Book = require('./../models/book.js');
const { check, validationResult, matchedData } = require("express-validator");

router.get('/', async function (req, res) {
   const events = await Event.find({"eventdate" : { $gte : Date.now() }}).sort({ eventdate: 'asc'}).limit(2)
  const sermons = await Sermon.find({}).sort({ createdAt: 'desc'}).limit(1)
  const articles = await Blog.find().sort({ createdAt: 'desc'}).limit(3)
  const params = {
    events:events,
    sermons: sermons,
    articles: articles
  }
  res.render('index', params)
})


router.get('/about', function (req, res) {
  res.render('about')
})

router.get('/blog', async function (req, res) {
   res.redirect(`/blog/1`)
})


router.get('/blog/:page', async function (req, res) {
  var random = Math.floor(Math.random()*3);
  const articles = await Blog.find().skip(random).limit(8)
  const postPerPage = 6;
  const page = req.params.page || 1;

    
     const posts = await Blog.find().sort({ createdAt: 'desc'}).populate("author").skip((postPerPage * page) - postPerPage).limit(postPerPage);
      const recents = await Blog.find().sort({ createdAt: 'desc'}).limit(6)
     
     const blogs = await Blog.find().sort({ createdAt: 'desc'}).limit(3)
     const numOfPosts = await Blog.countDocuments({})
     const pages = Math.ceil(numOfPosts / postPerPage)
   const params = {
    posts: posts,
    currentPage: page,
    pages: pages,
      blogs: blogs,
      articles: articles,
      recents: recents,
      numOfPosts: numOfPosts
    }
  res.render('blog', params)
 
})






router.get('/bookreview', async function (req, res) {
  res.redirect(`/bookreview/1`)
})

router.get('/bookreview/:page', async function (req, res) {
   const postPerPage = 9;
   const page = req.params.page || 1;    
  const books = await Book.find().sort({ createdAt: 'desc'}).populate("writer").skip((postPerPage * page) - postPerPage).limit(postPerPage);
   const numOfPosts = await Book.countDocuments({})
   const pages = Math.ceil(numOfPosts / postPerPage)
   const params = {
    currentPage: page,
    pages: pages,
    numOfPosts: numOfPosts,
      books: books
    }
  res.render('bookreview', params)
})

router.get('/resources', function (req, res) {
  res.render('resources')
})


router.get('/history', function (req, res) {
  res.render('history')
})

router.get('/faith', function (req, res) {
  res.render('faith')
})
router.get('/leaders', function (req, res) {
  res.render('pastors')
})

router.get('/sermons', async function (req, res) {
    res.redirect(`/sermons/1`)
})

router.get('/sermons/:page', async function (req, res) {
    const postPerPage = 9;
   const page = req.params.page || 1; 
   const sermons = await Sermon.find({}).sort({ createdAt: 'desc'}).skip((postPerPage * page) - postPerPage).limit(postPerPage);
   const numOfPosts = await Sermon.countDocuments({})
   const pages = Math.ceil(numOfPosts / postPerPage)
   const params = {
    currentPage: page,
    pages: pages,
    numOfPosts: numOfPosts,
      sermons: sermons
    }
  res.render('sermons', params)
})

router.get('/give', function (req, res) {
  res.render('give')
})
router.get('/contact', (req, res) => {
  res.render('contact')
})



router.get('/events', async function (req, res) {
    const events = await Event.find({"eventdate" : { $gte : Date.now() }}).sort({ eventdate: 'asc'})
  res.render('event', ({events: events}))
})



router.get('/blogg/:slug' ,async function (req, res) {
     var blog = await Blog.findOne({slug: req.params.slug}).populate('author').populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path:'answers',
        model: 'Answer',
      }})
  
   const  recents = await Blog.find().sort({ createdAt: 'desc'}).limit(5)
   
     const params = {
      blog: blog,
      recents: recents
    }
  res.render('singleblog', params)
 
})


router.post('/blogs/:id/comments', async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const comment = new Comment({
    name: req.body.username,
    email: req.body.email,
    blogid: req.body.blog_id,
    content: req.body.comment
    });

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    .then(comment => {
      return Blog.findById(req.body.blog_id);
    })
    .then(blog => {
      blog.comments.unshift(comment);
      return blog.save();
    })
    .then(blog => {
      res.redirect(`/blogg/${blog.slug}`);
    })
    .catch(err => {
      console.log(err);
    });
    });

router.post('/comments/:id/replys', async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const answer = new Answer({
    name: req.body.username,
    email: req.body.email,
    commentid: req.body.comment_id,
    content: req.body.comment
    });

  // SAVE INSTANCE OF Comment MODEL TO DB
  answer
    .save()
    .then(answer => {
      return Comment.findById(req.body.comment_id);
      
    })

    .then(comment => {
      comment.answers.unshift(answer);
      return comment.save();
    })

    .then(comment => {
      return Blog.findById(req.body.blog_id);
    })

    .then(blog => {
      res.redirect(`/blogg/${blog.slug}`);
    })
    .catch(err => {
      console.log(err);
    });
    });


router.post('/books/:id/comments', async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const bkcomment = new Bkcomment({
    name: req.body.username,
    email: req.body.email,
    reviewid: req.body.book_id,
    content: req.body.comment
    });

  // SAVE INSTANCE OF Comment MODEL TO DB
  bkcomment
    .save()
    .then(bkcomment => {
      return Book.findById(req.body.book_id);
    })
    .then(book => {
      book.bkcomments.unshift(bkcomment);
      return book.save();
    })
    .then(book => {
      res.redirect(`/book/${book.slug}`);
    })
    .catch(err => {
      console.log(err);
    });
    });

router.post('/bkcomments/:id/bkreplys', async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const bkanswer = new Bkanswer({
    name: req.body.username,
    email: req.body.email,
    bkcommentid: req.body.comment_id,
    content: req.body.comment
    });

  // SAVE INSTANCE OF Comment MODEL TO DB
  bkanswer
    .save()
    .then(bkanswer => {
      return Bkcomment.findById(req.body.comment_id);
      
    })

    .then(bkcomment => {
      bkcomment.bkanswers.unshift(bkanswer);
      return bkcomment.save();
    })

    .then(bkcomment => {
      return Book.findById(req.body.book_id);
    })

    .then(book => {
      res.redirect(`/book/${book.slug}`);
    })
    .catch(err => {
      console.log(err);
    });
    });

router.post('/request', async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const request = new Request({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    message: req.body.message
    });

  // SAVE INSTANCE OF Comment MODEL TO DB
  request.save().catch(err => {
      console.log(err);});
  res.redirect('/leaders');
  
    
    });

   





router.get('/book/:slug', async function (req, res){

  var book = await Book.findOne({slug: req.params.slug}).populate('writer').populate({
      path: 'bkcomments',
      model: 'Bkcomment',
      populate: {
        path:'bkanswers',
        model: 'Bkanswer',
      }})
   const reviews = await Book.find().sort({ createdAt: 'desc'}).limit(5)
     const params = {
     // author: author,
      book: book,
      reviews: reviews
    }
   if (book == null) res.redirect("/bookreview")

   res.render('singlereview', params)
  

})
//temp


//Exports
module.exports =router

