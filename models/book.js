var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')
var marked =require('marked')
var slugify  =require('slugify')
var createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//blog schema
const bookSchema = mongoose.Schema({

	title: {
		type: String,
		required: true
	},

	author: {
		type: String,
		required: true
	},

	publisher: {
		type: String,
		required: true
	},

	description: {
		type: String,
		
	},

  writer: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }],
  
	coverImage: {
    type: Buffer,
    required: true
  },

  bkcomments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],


  coverImageType: {
    type: String,
    required: true
  },

	markdown: {
		type: String,
		required: true
	},
	createdAt:{
		type: Date,
		default: Date.now
	},
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

bookSchema.pre('validate', function(next){
	if (this.title){
		this.slug =slugify(this.title, {lower:true, strict:true})
	}
	if (this.markdown) {
		this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
	}
	next()
})

bookSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})
//BlogSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Book', bookSchema);