const express = require('express');
const app = express.Router();
const categoryController = require('../controller/categoryController');

/**
 * @swagger
 *  tags:
 *      name: Category
 *      description: Category API.
*/

/**
 * @swagger
 * /api/category:
 *  get:
 *      summary: Get all category
 *      tags: [Category]
 *      parameters:
 *          - in: query
 *            name: page
 *            type: string
 *            description: Page number
 *            default: 1
 *          - in: query
 *            name: limit
 *            type: string
 *            description: Item limit
 *            default: 4
 *      responses:
 *          200:
 *              description: List of all category
 *              content:
 *                   application/json:
 *                         example:
 *                              categories:
 *                                  - id: 61bac88e4ac42802a721a9a4
 *                                    name: Education
 *                                    slug: education
 *                              hasNext: false
 *                              totalDocuments: 1
 *                              page: 1
 *                              totalPage: 1
 *          400:
 *              description: Error
 */
app.get('/', categoryController.getAllCategory);

module.exports = app;