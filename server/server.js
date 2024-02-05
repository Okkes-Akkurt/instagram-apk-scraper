const express = require('express');
const versionRoutes = require('./routes/versionRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/versions', versionRoutes);

// Connect to MongoDB
const connectToDatabase = async () => {
	try {
		const dbUri = process.env.DB_URI;
		await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log('MongoDB bağlantısı başarılı.');
	} catch (error) {
		console.error('MongoDB bağlantı hatası:', error.message);
		throw error; // Re-throw the error to handle it in the caller function
	}
};

// Start the server
const startServer = async () => {
	try {
		await connectToDatabase();
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.error('Server başlatma hatası:', error.message);
	}
};

startServer();
