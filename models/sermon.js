var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')
var marked =require('marked')
var slugify  =require('slugify')
var createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//blog schema
const sermonSchema = mongoose.Schema({

	title: {
		type: String,
		required: true
	},


	eventname: {
		type: String,
		 required: true
		
	},

  	eventdate: {
		type: Date,
		required: true

	},
	 
	speaker: {
		type: String,
		required: true

	},

	
	description: {
		type: String,
		required: true
	},

	audio: {
    type: Buffer,
    required:true
   
 	 },
  
  	audioType: {
    type: String,
    required: true
    
  	},

  	coverImage: {
    type: Buffer,
    required: true
  },
  
  coverImageType: {
    type: String,
    required: true
  },
	
	createdAt:{
		type: Date,
		default: Date.now
	},

	sermonslug: {
		type: String,
		required: true,
		unique: true
	},
	
})

sermonSchema.pre('validate', function(next){
	if (this.title){
		this.sermonslug =slugify(this.title, {lower:true, strict:true})
	}
	next()
})

sermonSchema.virtual('audioPath').get(function() {
  if (this.audio != null && this.audioType != null) {
    return `data:${this.audioType};charset=utf-8;base64,${this.audio.toString('base64')}`
  }
})
sermonSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})
//BlogSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Sermon', sermonSchema);