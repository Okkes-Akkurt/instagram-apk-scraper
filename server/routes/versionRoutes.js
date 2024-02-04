const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

router.get('/', versionController.versionList);
router.get('/:versionId', versionController.versionDetails);
router.delete('/:versionId', versionController.deleteVersion);
router.put('/:versionId', versionController.updateVersion);
router.post('/', versionController.checkRequestValidity, versionController.createNewVersion);


module.exports = router;
