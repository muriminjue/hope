var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')
var marked =require('marked')
var slugify  =require('slugify')
var createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//blog schema
const authorSchema = mongoose.Schema({

	name: {
		type: String,
		required: true
	},

	description: {
		type: String,
		
	},

	createdAt: {
		type: Date,
		default: Date.now
		
	},
	
	authslug: {
		type: String,
		required: true,
		unique: true,
	},


	coverImage: {
    type: Buffer,
   	required: true
  },
 
  
  	coverImageType: {
    type: String,
    required: true
  },


	
})

authorSchema.pre('validate', function(next){
	if (this.name){
		this.authslug =slugify(this.name, {lower:true, strict:true})
	}
	next()
})

authorSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})
//BlogSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Author', authorSchema);