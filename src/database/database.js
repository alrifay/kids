const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const databaseConnections = {
	local: 'mongodb://localhost:27017/Kids',
	online: 'mongodb://kids-database:kids-database@mongodb-online-cluster-shard-00-00-yeewx.mongodb.net:27017,mongodb-online-cluster-shard-00-01-yeewx.mongodb.net:27017,mongodb-online-cluster-shard-00-02-yeewx.mongodb.net:27017/Kids?ssl=true&replicaSet=mongodb-online-cluster-shard-0&authSource=admin'
};
mongoose.connect(databaseConnections.online, (error) => {
	if (error) {
		console.log('[database] error', error);
		process.exit(1);
	}
});

module.exports = mongoose;
