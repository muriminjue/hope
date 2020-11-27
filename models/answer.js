const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
name: {
		type: String,
		required: true
	},
	
email: {
		type: String,
		required: true
	},

commentid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Comment'
  },

content: {
   type: String,
   required: true
},

	createdAt: {
		type: Date,
		default: Date.now
	},

});

module.exports = mongoose.model("Answer", answerSchema);