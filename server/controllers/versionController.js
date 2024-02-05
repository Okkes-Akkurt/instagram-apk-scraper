// versionController.js

const { connectToDatabase, disconnectFromDatabase } = require('../db'); // Eksik olan bağlantı ve bağlantıyı kapatma fonksiyonlarını ekledik
const Apk = require('../models/apkModel.js');

const versionList = async (req, res) => {
	try {
		await connectToDatabase();

		const versions = await Apk.find({});
		res.json({ versions });
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		await disconnectFromDatabase();
	}
};

const versionDetails = async (req, res) => {
	const { versionId } = req.params;

	try {
		await connectToDatabase();

		const version = await Apk.findById(versionId);

		if (version) {
			res.json(version);
		} else {
			res.status(404).json({ error: 'Sürüm bulunamadı.' });
		}
	} catch (error) {
		console.error('MongoDB bağlantı hatası veya sürüm bulunamadı:', error.message);
		res.status(500).json({ error: error.message });
	} finally {
		await disconnectFromDatabase();
	}
};

const deleteVersion = async (req, res) => {
	const { versionId } = req.params;

	try {
		await connectToDatabase();

		const deletedVersion = await Apk.findByIdAndDelete(versionId);

		if (deletedVersion) {
			res.json({ message: 'Sürüm başarıyla silindi.' });
		} else {
			res.status(404).json({ error: 'Sürüm bulunamadı.' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	} finally {
		await disconnectFromDatabase();
	}
};




module.exports = {
	versionList,
	versionDetails,
	deleteVersion,
};
