const express = require('express');
const app = express.Router();
const listController = require('../controller/listController');

/**
 * @swagger
 * tags:
 *      name: List
 *      description: List API
 */



/**
 * @swagger
 * /api/list/{slug}:
 *  get:
 *      summary: Get all list by category
 *      tags: [List]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            default:  education
 *            required: true
 *            description: Slug of category to show all the list present
 *      responses:
 *          200:
 *              description: List of items 
 *              content:
 *                  application/json:
 *                      example:
 *                          categoryId: 61bac88e4ac42802a721a9a4
 *                          categoryName: Education
 *                          slug: education
 *                          lists:
 *                              - id: 61bac88e4ac42802a721a9a4
 *                                name: Top Colleges of 2021
 *                                description: This is the list of the top ranked colleges of Nepal.
 *                                slug: top-colleges-of-2021
 *                          hasNext: false
 *                          totalDocuments: 1
 *                          page: 1
 *                          totalPage: 1
 *          400:
 *              description: Error
 */

app.get('/:slug', listController.getAllListByCategory);

module.exports = app;