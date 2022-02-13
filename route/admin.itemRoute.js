const express = require('express');
const app = express.Router();
const itemController = require('../controller/admin.itemController');

/**
 * @swagger
 * tags:
 *      name: adminItem
 *      description: Item API for admin
 */

/**
 * @swagger
 * /api/admin/item:
 *  post:
 *      summary: Inserting new item
 *      tags: [adminItem]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Item'
 *                  example:
 *                      title: Emirates Stadium
 *                      body: The Emirates Stadium  is a football stadium in Holloway, London, England, and the home of Arsenal. With a capacity of 60,260 it is the fourth-largest football stadium in England after Wembley Stadium, Old Trafford and Tottenham Hotspur Stadium.
 *                      list: the-top-stadium
 *                      image: https://media.gettyimages.com/photos/arsenal-football-clubs-new-home-the-emirates-stadium-in-holloway-25-picture-id73696200?s=612x612
 *      responses:
 *          200:
 *              description: Item successfully added
 *              content:
 *                  application/json:
 *                      example:
 *                          Item added successfully
 *          400:
 *              description: Error
 */
app.post('/', itemController.insertItem);

/**
 * @swagger
 * /api/admin/item:
 *  get:
 *      summary: Get all items
 *      tags: [adminItem]
 *      parameters:
 *          - in: path
 *            name: slug
 *            required: true
 *            schema:
 *              type: string
 *            default: the-top-stadium
 *            description: List slug to show the item present in the list
 *      responses:
 *          200:
 *              description: Items present in list
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Item'
 *                      example:
 *                          items:
 *                              - id: 61baf5004ac42802a721aa5d
 *                                title: Nepal College of Information Technology (NCIT)
 *                                body: Nepal College of Information Technology (NCIT) is located at Balkumari, Lalitpur. It was founded in 2001 A.D. with affiliation to Pokhara University and offers Bachelor's.
 *                                slug: nepal-college-of-information-technology--ncit-
 *                                image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHB69gIOIfhr2DMZ2t10preQy9cgGST0JTBoYIFMbvbvj1BXCdHnRIeY907hRxgOvvwcQ&usqp=CAU
 *                                status: active
 *                                type: place
 *                          hasNext: false
 *                          totalDocuments: 1
 *                          page: 1
 *                          totalPage: 1
 *          400:
 *              description: Error
 */
app.get('/', itemController.getAllItems);

/**
 * @swagger
 * /api/admin/item/{slug}:
 *  put:
 *      summary: Updating item by slug
 *      tags: [adminItem]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            default: naaya-aayam-multi-disciplinary-institute--nami--college
 *            required: true
 *            description: Slug of item which is going to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Item'
 *                  example:
 *                      title: Naaya Aayam Multi-Disciplinary Institute (NAMI) College
 *                      body: Naaya Aayam Multi-Disciplinary Institute (NAMI) College is one of the college operating in Nepal.NAMI (Naaya Aayam Multi-disciplinary Institute) has been initiated by a group of like minded distinguished and committed Nepali citizens, who have established it with a view to contribute to the social and economic growth of Nepal through the established of a center of excellence for education
 *                      image: https://www.collegenp.com/uploads/2018/02/Nami-College-784.jpg
 *                      type: place
 *      responses:
 *          200:
 *              description: Successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Item'
 *                      example:
 *                          _id: 61c17b2c62e15e94f75d8986
 *                          title: Naaya Aayam Multi-Disciplinary Institute (NAMI) College
 *                          body: Naaya Aayam Multi-Disciplinary Institute (NAMI) College is one of the college operating in Nepal.NAMI (Naaya Aayam Multi-disciplinary Institute) has been initiated by a group of like minded distinguished and committed Nepali citizens, who have established it with a view to contribute to the social and economic growth of Nepal through the established of a center of excellence for education
 *                          status: active
 *                          slug: naaya-aayam-multi-disciplinary-institute--nami--college
 *                          image: https://www.collegenp.com/uploads/2018/02/Nami-College-784.jpg    
 *                          type: place  
 *          400:
 *              description: Unable to update item
 */
app.put('/:slug', itemController.updateItemBySlug);

/**
 * @swagger
 * /api/admin/item/{slug}:
 *  delete:
 *      summary: Delete items by slug
 *      tags: [adminItem]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            default: naaya-aayam-multi-disciplinary-institute--nami--college
 *            required: true
 *            description: Slug of item with which the item is going to be deleted
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Item'
 *                  example:
 *                      list: "top-10-horror-movies"
 *                  description: List slug where the item is present
 *      responses:
 *          200:
 *              description: Item successfully deleted
 *              content:
 *                  application/json:
 *                      example:
 *                          Item with ID : 61c17b2c62e15e94f75d8986 deleted successfully.
 *          400:
 *              description: Unable to delete item
 */
app.put('/', itemController.updateStatusOfItemBySlug);

//app.put('/:slug', itemController.updateItemStatus)

module.exports = app;