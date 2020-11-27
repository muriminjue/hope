var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')
var marked =require('marked')
var slugify  =require('slugify')
var createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//blog schema
const blogSchema = mongoose.Schema({

	title: {
		type: String,
		required: true
	},

  author: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }],
  
	coverImage: {
    type: Buffer,
    required: true
  },
  
  coverImageType: {
    type: String,
    required: true
  },

	description: {
		type: String,
		
	},
	markdown: {
		type: String,
		required: true
	},
	createdAt:{
		type: Date,
		default: Date.now
	},

	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],


	slug: {
		type: String,
		required: true,
		unique: true,
	},
	
	sanitizedHtml: {
		type: String,
		required: true
	},
})

blogSchema.pre('validate', function(next){
	if (this.title){
		this.slug =slugify(this.title, {lower:true, strict:true})
	}
	if (this.markdown) {
		this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
	}
	next()
})

blogSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})
//BlogSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Blog', blogSchema);