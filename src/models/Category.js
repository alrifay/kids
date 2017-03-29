const mongoose = require('mongoose');

const Category = mongoose.model('Category', {
	title: {
		type: String,
		required: [true, 'You must enter a Category title'],
		trim: true
	},
	subCategories: [{
		title: {
			type: String,
			required: [true, 'You must enter a Category title'],
			trim: true
		},
		Topics: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Topic',
			required: false
		}]
	}]
});

module.exports = Category;
