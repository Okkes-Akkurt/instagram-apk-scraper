
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
	variantId: String,
	architecture: String,
	minAndroidVersion: String,
	dpi: String,
});

const apkSchema = new mongoose.Schema({
	version: String,
	releaseDate: String,
	variants: [variantSchema],
});

const Apk = mongoose.model('Apk', apkSchema);

module.exports = Apk;
