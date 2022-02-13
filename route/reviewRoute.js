const express = require('express');
const app = express.Router();
const reviewController = require('../controller/reviewController');

/**
 * @swagger
 * tags:
 *      name: Review
 *      description: Review API
 */

/**
 * @swagger
 * /api/review:
 *  get:
 *      summary: Get review of item
 *      tags: [Review]
 *      parameters:
 *          - in: query
 *            name: list
 *            type: string
 *            description: List slug
 *            default: top-15-best-movies-of-century
 *          - in: query
 *            name: item
 *            type: string
 *            description: Item slug
 *            default: superman-man-of-steel
 *      responses:
 *          200:
 *              description: List of review
 *              content:
 *                  application/json:
 *                      example:
 *                          _id: 61c2f0ea54c97a09668ccaee
 *                          avgRating: 5
 *                          count: 1
 *                          pendingCount: 2
 *                          item: 61c2f0ea54c97a09668ccaee
 *                          comments:
 *                              - _id: 61c2f0ea54c97a09668ccaee
 *                                visitorId: 1831877852
 *                                name: User
 *                                comment: This is comment.
 *                                rating: 5
 *                                status: active
 *                          list: 61c1b9c5f917bb5d1d38df82
 *          400:
 *              description: Error
 */
app.get('/',reviewController.getReviewByListAndItemSlug); //ask if used .....

/**
 * @swagger
 * /api/review:
 *  post:
 *      summary: Inserting new review
 *      tags: [Review]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Review'
 *                  example:
 *                      list: top-10-comedy-movies-of-all-time
 *                      item: forrest-gump
 *                      name: Bryan
 *                      comment: Great movie I think
 *                      rating: 4
 *                  required: true
 *      responses:
 *          200:
 *              description: New review added
 *              content:
 *                  application/json:
 *                      example:
 *                          message: review inserted successfully.
 *          400:
 *              description: Error
 */

app.post('/', reviewController.insertReview);


module.exports = app;
