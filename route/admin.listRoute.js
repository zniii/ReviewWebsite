const express = require('express');
const app = express.Router();
const listController = require('../controller/admin.listController');

/**
 * @swagger
 * tags:
 *      name: adminList
 *      description: API route for admin list
 */

/**
 * @swagger
 * /api/admin/list/experimental/{slug}:
 *  put:
 *      summary: Adding item in list by list slug
 *      tags: [adminList]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/List'
 *                  example:
 *                      list: worst-ten-action-movies-of-all-time-6
 *                      item: fast-and-furious
 *                  require: true
 *      responses:
 *          200:
 *              description: Successfully Added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/List'
 *          400:
 *              description: Error
 */


app.post('/:slug', listController.addItemInList);



/**
 * @swagger
 * /api/admin/list/experimental/{slug}:
 *  get:
 *      summary: Get all items present in the list by admin
 *      tags: [adminList]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            default:  top-it-colleges-of-nepal
 *            required: true
 *            description: Slug of list to retreive items from the list
 *      responses:
 *          200:
 *              description: List of items 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/List'
 *                      example:
 *                          id: 61baf6ec4ac42802a721aa7d
 *                          name: Top IT Colleges Of Nepal
 *                          slug: top-it-colleges-of-nepal
 *                          description: We are just publishing the name of IT colleges.  The ranking is according to the ratings of users.
 *                          items:
 *                              - item:
 *                                  - _id: 61baf5004ac42802a721aa5d
 *                                    title: Nepal College of Information Technology (NCIT)
 *                                    body: Nepal College of Information Technology (NCIT) is located at Balkumari, Lalitpur. It was founded in 2001 A.D. with affiliation to Pokhara University and offers Bachelor's.
 *                                    status: active
 *                                    slug: nepal-college-of-information-technology--ncit-
 *                                    image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHB69gIOIfhr2DMZ2t10preQy9cgGST0JTBoYIFMbvbvj1BXCdHnRIeY907hRxgOvvwcQ&usqp=CAU
 *                              - comments:
 *                                  - _id: 61baffcccf1bb9439c952e62
 *                                    visitorId: 341643688
 *                                    name: Shuvam
 *                                    comment: Very good college
 *                                    rating: 3.5
 *                                    status: active
 *          400:
 *              description: Error
 */

app.get('/experimental/:slug', listController.getAllItemsByListSlug);


app.get('/experimental/pending/:slug', listController.getAllItemsWithPendingReviewsByListSlug); //moved to admin review controller /api/admin/review/pending/{list_slug}
//experimental end

app.put('/', listController.updateListStatus);

app.delete('/', listController.deleteItemInList);

/**
 * @swagger
 * /api/admin/list:
 *  get:
 *      summary: Get all the list
 *      tags: [adminList]
 *      responses:
 *          200:
 *              description: Showing all the list
 *              content:
 *                  application/json:
 *                      example:
 *                          lists:
 *                              - id: 61baf6ec4ac42802a721aa7d
 *                                name: Top IT Colleges Of Nepal
 *                                description: We are just publishing the name of IT colleges.  The ranking is according to the ratings of users.
 *                                slug: top-it-colleges-of-nepal
 *                                pendingCount: 6
 *                          hasNext: false
 *                          totalDocuments: 2
 *                          page: 1
 *                          totalPage: 1
 * 
 *          400:
 *              description: Error
 */
app.get('/', listController.getAllList);

/**
 * @swagger
 * /api/admin/list:
 *  post:
 *      summary: Insert new list
 *      tags: [adminList]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/List'
 *                  example:
 *                      name: Top 5 Universities of Nepal
 *                      description: This is the list for top 5 universities of nepal
 *                      category: education
 *      responses:
 *          200:
 *              description: List successfully added
 *              content:
 *                  application/json:
 *                      example:
 *                          categoryId: 61bac88e4ac42802a721a9a4
 *                          categoryName: Education
 *                          name: Top IT colleges of Nepal
 *                          slug: top-it-colleges-of-nepal
 *                          message: List inserted
 *          400:
 *              description: Error
 */
app.post('/', listController.insertNewList);

/**
 * @swagger
 * /api/admin/list/{slug}:
 *  delete:
 *      summary: Delete list by list slug
 *      tags: [adminList]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            required: true
 *            description: Slug to delete the list
 *      responses:
 *          200:
 *              description: Successfullly deleted
 *              content:
 *                  application/json:
 *                      example:
 *                          _id: 61c15c1274728ac36f420583
 *                          name: Top IT colleges of Nepal
 *                          description: List of top IT colleges of Nepal
 *                          category: 61bac88e4ac42802a721a9a4
 *                          item:
 *                              -
 *                          slug: top-it-colleges-of-nepal
 *                          status: List deleted successfully
 *          400:
 *              description: Error
 */
app.delete('/:slug', listController.deleteListBySlug);



/**
 * @swagger
 * /api/admin/list/{slug}:
 *  put:
 *      summary: Update the list by slug
 *      tags: [adminList]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            default: top-it-colleges-of-nepal
 *            required: true
 *            description: Slug to update list
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/List'
 *                  example:
 *                      name: Top IT Colleges of Nepal
 *      responses:
 *          200:
 *              description: Successfully updated
 *              content:
 *                  application/json:
 *                      example:
 *                          _id: 61baf6ec4ac42802a721aa7d
 *                          name: Top IT colleges of Nepal 2021
 *                          description: We are just publishing the name of IT colleges.  The ranking is according to the ratings of users.
 *                          item:
 *                              - 61baf5004ac42802a721aa5d
 *                              - 61baf5514ac42802a721aa63
 *                              - 61baf59b4ac42802a721aa69
 *                          slug: top-it-colleges-of-nepal-2021
 *                          status: active
 *          400:
 *              description: Error  
 */
app.put('/:slug', listController.updateListBySlug);


module.exports = app;