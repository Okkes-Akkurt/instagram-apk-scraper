
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Apk = require('../models/apkModel');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
mongoose.connect(process.env.DB_URI);

const isAlphaOrBeta = (versions) => versions.toLowerCase().includes('alpha') || versions.toLowerCase().includes('beta');

const fetchAndSaveInstagramApks = async () => {
	try {
		const appPageUrl = 'https://www.apkmirror.com/apk/instagram/instagram-instagram';
		const appPageResponse = await axios.get(appPageUrl);

		if (!appPageResponse.data) {
			throw new Error('Could not retrieve HTML content.');
		}

		const $ = cheerio.load(appPageResponse.data);
		const versionElements = $('a.fontBlack');
		const versionReleaseDate = $('span.dateyear_utc');

		const latestVersions = [];

		for (let index = 0; index < versionElements.length; index++) {
			const elements = versionElements[index];
			const $elements = $(elements);

			const version = $elements.text().trim();
			const releaseDate = $(versionReleaseDate[index]).attr('data-utcdate');

			const versionInfo = {
				version,
				releaseDate,
			};

			if (version.toLowerCase().includes('instagram') && !isAlphaOrBeta(version)) {
				latestVersions.push(versionInfo);
			}
		}

		for (const version of latestVersions) {
			const existingApk = await Apk.findOne({ version: version.version });

			if (!existingApk) {
				await saveApk(version);
			} else {
				console.log(`Version ${version.version} already exists. Skipping save.`);
			}
		}

		console.log('Data successfully retrieved and saved to MongoDB.');
		await updateVariantsForApks();
		mongoose.disconnect();
	} catch (error) {
		console.error('Error fetching data:', error.message);
	}
};

const saveApk = async (versionInfo) => {
	try {
		const apk = new Apk(versionInfo);
		await apk.save();
	} catch (error) {
		console.error('Error saving APK:', error.message);
	}
};

const fetchVariantData = async (version) => {
	try {
		const modifiedVersion = version.match(/\d+/g).join('-').replace(/\./g, '-');
		console.log(modifiedVersion);
		const url = `https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-instagram-${modifiedVersion}-release/`;
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const divs = $('div.table-cell.rowheight.addseparator.expand.pad.dowrap');
		const spans = $('span.colorLightBlack');
		const variantId = $(spans[0]).text();
		const architecture = $(divs[1]).text();
		const minAndroidVersion = $(divs[2]).text();
		const dpi = $(divs[3]).text();

		return {
			variantId,
			architecture,
			minAndroidVersion,
			dpi,
		};
	} catch (error) {
		console.error('Error fetching variant data:', error.message);
		return null;
	}
};

const updateVariantsForApks = async () => {
	try {
		const latestApks = await Apk.find({});

		for (const apk of latestApks) {
			const variantData = await fetchVariantData(apk.version);

			if (variantData) {
				apk.variants.push(variantData);
				await apk.save();
			}
		}

		console.log('Variant data successfully updated for all APKs.');
	} catch (error) {
		console.error('Error updating variant data:', error.message);
	}
};

fetchAndSaveInstagramApks();
