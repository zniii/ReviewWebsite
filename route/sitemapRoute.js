const express = require('express');
const app = express.Router();
const sitemapController = require('../controller/sitemapController');

app.get('/', sitemapController.siteMap);

module.exports = app;