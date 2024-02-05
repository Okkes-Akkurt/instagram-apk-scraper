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
		const url = `https://www.apkmirror.com/apk/instagram/instagram-instagram/instagram-instagram-${modifiedVersion}-release/`;
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const variants = [];

		const variantContainers = $('div.table-cell.rowheight.addseparator.expand.pad.dowrap');

		variantContainers.each((index, element) => {
			const variant = {};

			variant.architecture = $(element).next('.table-cell').text().trim();
			variant.minAndroidVersion = $(element).nextAll('.table-cell').eq(1).text().trim();
			variant.dpi = $(element).nextAll('.table-cell').eq(2).text().trim();

			const spans = $(element).find('span.colorLightBlack');
			variant.variantId = $(spans[0]).text().trim();

			if (variant.variantId !== '') {
				variants.push(variant);
			}
		});

		return variants;
	} catch (error) {
		console.error('Error fetching variant data:', error.message);
		return null;
	}
};

const updateVariantsForApks = async () => {
	try {
		const latestApks = await Apk.find({});

		for (const apk of latestApks) {
			const variantDataArray = await fetchVariantData(apk.version);

			if (variantDataArray && variantDataArray.length > 0) {
				const uniqueVariants = variantDataArray.filter((variant) => {
					// Return true if no existing variant with the same variantId is found
					return !apk.variants.some((existingVariant) => existingVariant.variantId == variant.variantId);
				});

				if (uniqueVariants.length > 0) {
					// Use $push to insert the unique variants into the variants array
					await Apk.updateOne(
						{ _id: apk._id },
						{
							$push: { variants: { $each: uniqueVariants } },
							$inc: { variantCount: uniqueVariants.length },
						},
					);
				}
			}
		}

		console.log('Variant data successfully updated for all APKs.');
	} catch (error) {
		console.error('Error updating variant data:', error.message);
	}
};

fetchAndSaveInstagramApks();
