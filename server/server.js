//server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const apkController = require('./controllers/apkController.js');
const versionRoutes = require('./routes/versionRoutes.js');

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const dbUri = process.env.DB_URI;

mongoose
	.connect(dbUri)
	.then(() => {
		console.log('MongoDB bağlantısı başarılı.');
		const port = process.env.PORT || 3001;
		app.listen(port, () => {
			console.log(`Uygulama ${port} portunda çalışıyor`);
		});
	})
	.catch((error) => {
		console.error('MongoDB bağlantı hatası:', error.message);
	});

app.use(cors());

app.use('/versions', versionRoutes);

app.get('/', async (req, res) => {
	try {
		const versions = await apkController.fetchAndSaveInstagramApks();
		res.status(200).json({
			versions,
		});
	} catch (error) {
		console.error('Server veri çekme hatası:', error.message);
		res.status(500).send('Veri çekme hatası');
	}
});
