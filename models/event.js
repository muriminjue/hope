var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')
var marked =require('marked')
var slugify  =require('slugify')
var createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//blog schema
const eventSchema = mongoose.Schema({


	eventname: {
		type: String,
		 required: true
		
	},

	starttime: {
		type: String,
		required: true
	},

	eventImage: {
    type: Buffer,
   
  },
  
  eventImageType: {
    type: String,
    required: true
    
  },

  eventdate:{
		type: Date,
		required: true

	},

	description: {
		type: String,
		required: true
		
	},
	createdAt:{
		type: Date,
		default: Date.now
	},
	eventslug: {
		type: String,
		required: true,
		unique: true,
	},
	
})

eventSchema.pre('validate', function(next){
	if (this.eventname){
		this.eventslug =slugify(this.eventname, {lower:true, strict:true})
	}
	next()
})

eventSchema.virtual('eventImagePath').get(function() {
  if (this.eventImage != null && this.eventImageType != null) {
    return `data:${this.eventImageType};charset=utf-8;base64,${this.eventImage.toString('base64')}`
  }
})
//BlogSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Event', eventSchema);