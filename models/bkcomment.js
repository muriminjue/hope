const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bkcommentSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	
email: {
		type: String,
		required: true
	},

  reviewid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  },

  content: {
   type: String,
   required: true
},

bkanswers: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bkanswer'
  }],

	createdAt: {
		type: Date,
		default: Date.now
	},

});

module.exports = mongoose.model("Bkcomment", bkcommentSchema);