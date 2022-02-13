const express = require('express');
const app = express.Router();
const itemController = require('../controller/itemController');



/**
 * @swagger
 * tags:
 *      name: Item
 *      description: Item API
 */

/**
 * @swagger
 * /api/item:
 *  get:
 *      summary: Get all items
 *      tags: [Item]
 *      responses:
 *          200:
 *              description: Getting all the active items
 *              content:
 *                  application/json:
 *                      example:
 *                          id: 61c1b9c5f917bb5d1d38df82
 *                          name: Top Colleges of 2021
 *                          slug: top-colleges-of-2021
 *                          description: This is the list of top ranked colleges of Nepal.
 *                          items:
 *                              - item:
 *                                  - _id: 61baf5004ac42802a721aa5d
 *                                    title: Nepa; College of Information Technology (NCIT)
 *                                    body: Nepal College of Information Technology (NCIT) is located at Balkumari, Lalitpur. It was founded in 2001 A.D. with affiliation to Pokhara University and offers Bachelor's and Master's programs - BE, BCA, ME, MSc, and MCIS.
 *                                    status: active
 *                                    slug: nepal-college-of-information-technology--ncit-
 *                                    image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHB69gIOIfhr2DMZ2t10preQy9cgGST0JTBoYIFMbvbvj1BXCdHnRIeY907hRxgOvvwcQ&usqp=CAU
 *                                    type: Place
 *                                rating: 5
 *                                comments:
 *                                  - _id: 61c2f0ea54c97a09668ccae8
 *                                    visitorId: 1831877852
 *                                    name: User
 *                                    comment: Comment about this college.
 *                                    rating: 5
 *                                    status: active
 *                          currentPage: 1
 *                          totalPage: 1
 *                          hasNext: false
 *          400:
 *              description: Code Error    
 */

app.get('/', itemController.getAllItems);

/**
 * @swagger
 * /api/item/{slug}:
 *  get:
 *      summary: Get all items by list slug
 *      tags: [Item]
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
 *                   application/json:
 *                       example:
 *                          id: 61c1b9c5f917bb5d1d38df82
 *                          name: Top Colleges of 2021
 *                          slug: top-colleges-of-2021
 *                          description: This is the list of top ranked colleges of Nepal.
 *                          items:
 *                              - item:
 *                                  - _id: 61baf5004ac42802a721aa5d
 *                                    title: Nepa; College of Information Technology (NCIT)
 *                                    body: Nepal College of Information Technology (NCIT) is located at Balkumari, Lalitpur. It was founded in 2001 A.D. with affiliation to Pokhara University and offers Bachelor's and Master's programs - BE, BCA, ME, MSc, and MCIS.
 *                                    status: active
 *                                    slug: nepal-college-of-information-technology--ncit-
 *                                    image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHB69gIOIfhr2DMZ2t10preQy9cgGST0JTBoYIFMbvbvj1BXCdHnRIeY907hRxgOvvwcQ&usqp=CAU
 *                                    type: Place
 *                                rating: 5
 *                                comments:
 *                                  - _id: 61c2f0ea54c97a09668ccae8
 *                                    visitorId: 1831877852
 *                                    name: User
 *                                    comment: Comment about this college.
 *                                    rating: 5
 *                                    status: active
 *                          currentPage: 1
 *                          totalPage: 1
 *                          hasNext: false
 *          400:
 *              description: Code Error
 */                        
app.get('/:slug', itemController.getAllItemsByListSlug);


module.exports = app;