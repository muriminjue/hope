var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')


//admin schema
const adminSchema = mongoose.Schema({

	firstname: {
		type: String,
		required: true
	},

	lastname: {
		type: String,
		required: true
	},


  email: {
    type: String,
    required: true
  },
  
  password: {
		type: String,
		required: true
	},
		createdAt:{
		type: Date,
		default: Date.now
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



adminSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

//adminSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Admin', adminSchema);