// db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToDatabase = async () => {
	try {
		const dbUri = process.env.DB_URI;
		await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log('MongoDB bağlantısı başarılı.');
	} catch (error) {
		console.error('MongoDB bağlantı hatası:', error.message);
		throw error;
	}
};

const disconnectFromDatabase = async () => {
	await mongoose.disconnect();
	console.log('MongoDB bağlantısı kapatıldı.');
};

module.exports = {
	connectToDatabase,
	disconnectFromDatabase,
};
