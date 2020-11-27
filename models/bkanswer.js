const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bkanswerSchema = new Schema({
name: {
		type: String,
		required: true
	},
	
email: {
		type: String,
		required: true
	},

bkcommentid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bkcomment'
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

module.exports = mongoose.model("Bkanswer", bkanswerSchema);