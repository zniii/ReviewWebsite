const express = require('express');
const app = express.Router();
const categoryController = require('../controller/admin.categoryController');

/**
 * @swagger
 * tags:
 *      name: adminCategory
 *      description: Category API for admin
 */


/**
 * @swagger
 * /api/admin/category:
 *  get:
 *      summary: Get all category
 *      tags: [adminCategory]
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
 *                         schema:
 *                             $ref: '#/components/schemas/Category'
 *                         example:
 *                              categories:
 *                                  - id: 61bac88e4ac42802a721a9a4
 *                                    name: Education
 *                                    slug: education
 *                                    status: active
 *                                  - id: 61bd77234f16e0962130e909
 *                                    name: Sports
 *                                    slug: sports
 *                                    status: active
 *                              hasNext: false
 *                              totalDocuments: 2
 *                              page: 1
 *                              totalPage: 1
 *          400:
 *              description: Error
 */
app.get('/', categoryController.getAllCategory);

/**
 * @swagger
 * /api/admin/category:
 *  post:
 *      summary: Creates new category
 *      tags: [adminCategory]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
 *                  example:
 *                      name: News
 *      responses:
 *          200:
 *              description: Successfully inserted new Category
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *                      example:
 *                          _id: 61c16f42cde9f0f92e1b35f9
 *                          name: News
 *                          slug: news
 *                          status: active
 *          400:
 *              description: Error
 */
app.post('/', categoryController.insertNewCategory);

/**
 * @swagger
 * /api/admin/category:
 *  put:
 *      summary: Update category status
 *      tags: [adminCategory]
 *      content:
 *          application/json:
 */
app.put('/', categoryController.updateCategoryStatus);

/**
 * @swagger
 * /api/admin/category/{slug}:
 *  put:
 *      summary: Update category by slug
 *      tags: [adminCategory]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            default: education
 *            required: true
 *            description: Slug of category that need to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
 *                  example:
 *                      name: Education
 *      responses:
 *          200:
 *              description: Successfullly updated category
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *                      example:
 *                          _id: 61c16fc1848c748d5da13063
 *                          name: Education
 *                          slug: education
 *                          status: active
 *          400:
 *              description: Category not found
 */
app.put('/:slug', categoryController.updateCategory);


module.exports = app;