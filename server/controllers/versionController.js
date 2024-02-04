const Apk = require('../models/apkModel.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const versionList = async (req, res) => {
	try {
		const dbUri = process.env.DB_URI;
		mongoose
			.connect(dbUri)
			.then( async () => {
				console.log('MongoDB bağlantısı başarılı.');
				const port = process.env.PORT || 3001;
				const versions = await Apk.find({});
				res.json({ versions });

			})
			.catch((error) => {
				console.error('MongoDB bağlantı hatası:', error.message);
			});


	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const versionDetails = async (req, res) => {
	const { versionId } = req.params;
	const versionArray = versionId.split('-');
	const originalVersion = versionArray.join('.');

	try {
		await mongoose.connect(process.env.DB_URI);
		console.log('MongoDB bağlantısı başarılı.');

		const versions = await Apk.find({ version: 'Instagram' + ' ' + originalVersion });
		console.log("",versions);

		if (versions.length > 0) {
			res.json({ versions });
		} else {
			res.status(404).json({ error: 'Sürüm bulunamadı.' });
		}
	} catch (error) {
		console.error('MongoDB bağlantı hatası veya sürüm bulunamadı:', error.message);
		res.status(500).json({ error: error.message });
	} finally {
		await mongoose.disconnect();
	}
};


const deleteVersion = async (req, res) => {
	const { versionId } = req.params;

	try {
		const deletedVersion = await Apk.findOneAndDelete({ versionId });
		if (deletedVersion) {
			res.json({ message: 'Sürüm başarıyla silindi.' });
		} else {
			res.status(404).json({ error: 'Sürüm bulunamadı.' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateVersion = async (req, res) => {
	const { versionId } = req.params;
	const updatedData = req.body;

	try {
		const updatedVersion = await Apk.findOneAndUpdate({ versionId }, { $set: updatedData }, { new: true });
		if (updatedVersion) {
			res.json(updatedVersion);
		} else {
			res.status(404).json({ error: 'Sürüm bulunamadı.' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const validateRequest = (data) => {
	if (data && data.agent) {
		return true;
	}
	return false;
};

const checkRequestValidity = (req, res, next) => {
	const { agent } = req.body;

	if (validateRequest({ agent })) {
		next();
	} else {
		res.status(400).json({ error: 'Uygun olmayan istek.' });
	}
};

const createNewVersion = async (req, res) => {
	const { versionId, releaseDate, variants } = req.body;

	try {
		if (versionId && releaseDate && variants) {
			const newVersion = new Apk({
				versionId,
				releaseDate,
				variants,
			});

			await newVersion.save();
			res.status(201).json({ message: 'Yeni sürüm başarıyla oluşturuldu.' });
		} else {
			res.status(400).json({ error: 'Eksik veya hatalı veri.' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	versionList,
	versionDetails,
	deleteVersion,
	updateVersion,
	checkRequestValidity,
	createNewVersion,
};
