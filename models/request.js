var mongoose = require('mongoose')
var mongoooseUniqueValidator = require('mongoose-unique-validator')


//blog schema
const requestSchema = mongoose.Schema({

	fname: {
		type: String,
		required: true
	},

	lname: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	message: {
		type: String,
		required: true
		
	},

	approval: {
		type: String,
		
		
	},

	createdAt:{
		type: Date,
		default: Date.now
		},
})


//BlogSchema.plugin(mongoooseUniqueValidator);
module.exports = mongoose.model('Request', requestSchema);