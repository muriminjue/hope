const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	
email: {
		type: String,
		required: true
	},

  blogid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Blog'
  },

  content: {
   type: String,
   required: true
},

answers: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Answer'
  }],

	createdAt: {
		type: Date,
		default: Date.now
	},

});

module.exports = mongoose.model("Comment", CommentSchema);