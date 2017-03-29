const express = require('express');
const ObjectID = require('mongodb').ObjectID;

require('./database/database');
const Topic = require('./models/Topic');
const Category = require('./models/Category');

const app = express();
const port = process.env.PORT || 3000;

app.get('/seed', (request, response) => {
	if (!request.query.password || request.query.password != 'امسح كل حاجة :D') {
		return response.status(401).send({
			error: 'Wrong password',
			status: 'UNAUTHORIZED'
		});
	}
	let Data = require('./seed');
	Category.remove().then(() => Topic.remove().then()).catch((err) => {
		response.status(500).send({
			error: 'Internal Server Error',
			status: 'Internal Server Error'
		});
		console.log('[GET /seed]', err);
	});
	Category.create(Data.Categories, (err) => {
		if (err) {
			response.status(500).send({
				error: 'Internal Server Error',
				status: 'Internal Server Error'
			});
			console.log('[GET /seed]', err);
		}
		Topic.create(Data.Topics, (err) => {
			if (err) {
				response.status(500).send({
					error: 'Internal Server Error',
					status: 'Internal Server Error'
				});
				console.log('[GET /seed]', err);
			}
			response.send(Data);
		});
	});
});

app.get('/Categories', (request, response) => {
	Category.find().select({
		'subCategories.Topics': 0,
		__v: 0
	}).then(Categories => {
		if (Categories)
			response.send({
				Categories,
				status: 'OK'
			});
		else
			response.status(404).send({
				error: 'NO Categories',
				status: 'Not Found'
			});
	}).catch(error => {
		response.status(500).send({
			error: 'Internal Server Error',
			status: 'Internal Server Error'
		});
		console.log('[GET /Categories]', error);
	});
});

app.get('/Topics/:id', (request, response) => {
	if (!ObjectID.isValid(request.params.id)) {
		return response.status(400).send({
			error: 'Wrong ID format',
			status: 'Bad Request'
		});
	}
	Category.findOne({
		'subCategories': {
			'$elemMatch': {
				'_id': new ObjectID(request.params.id)
			}
		}
	}).populate({
		path: 'subCategories.Topics',
		select: '-__v'
	}).exec((error, result) => {
		if (error) {
			response.status(500).send({
				error: 'Internal Server Error',
				status: 'Internal Server Error'
			});
			return console.log(`[GET /Topics/${request.param.id}]`, error);
		} else if (!result) {
			response.status(404).send({
				error: 'ID NOT FOUND',
				status: 'Not Found'
			});
		} else {
			let topics = result.subCategories.find(subCategory => subCategory._id == request.params.id).Topics;
			if (request.query.short && request.query.short == 'true') {
				topics.map(topic => {
					if (topic.body.length > 100)
						topic.body = topic.body.slice(0, 100) + '...';
				});
			}
			response.send({
				topics,
				status: 'OK'
			});
		}
	});
});

app.get('/Topics', (request, response) => {
	Topic.find().then(topics => {
		if (topics) {
			response.send({
				topics,
				status: 'OK'
			});
		} else {
			response.status(404).send({
				error: 'No Topics',
				status: 'Not Found'
			});
		}
	}).catch((error) => {
		response.status(500).send({
			error: 'Internal Server Error',
			status: 'Internal Server Error'
		});
		console.log('[GET /Topics]', error);
	});
});

app.use((request, response) => {
	response.status(404).send({
		error: 'End point not found',
		status: 'Not Found'
	});
});

app.listen(port, () => {
	console.log(`Server is up at http://localhost:${port}`);
});
module.exports = app;
