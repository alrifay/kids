const mongoose = require('mongoose');

const Topic = mongoose.model('Topic', {
	title: {
		type: String,
		required: [true, 'You should enter a title'],
		trim: true
	},
	body: {
		type: String,
		required: [true, 'You must enter the body'],
		trim: true
	},
	images: [{
		link: String
	}],
	videos: [{
		link: String
	}],
	subCategoryID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	}
});

module.exports = Topic;
