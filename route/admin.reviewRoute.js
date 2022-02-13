const express = require('express');
const app = express.Router();
const reviewController = require('../controller/admin.reviewController');

/**
 * @swagger
 * tags:
 *      name: adminReview
 *      description: API route for admin review
 */


/**
 * @swagger
 * /api/admin/review:
 *  get:
 *      summary: Get review by list and item slug
 *      tags: [adminReview]
 *      parameters:
 *          - in: query
 *            name: item
 *            type: string
 *            description: Slug of item
 *            default: nepal-college-of-information-technology--ncit-
 *          - in: query
 *            name: list
 *            type: string
 *            description: Slug of list
 *            default: top-it-colleges-of-nepal
 *      responses:
 *          200:
 *              description: Showing all the review by list and item slug
 *              content:
 *                  application/json:
 *                      example:
 *                          _id: 61baffcccf1bb9439c952e68
 *                          avgRating: 4
 *                          count: 3
 *                          item: 61baf5004ac42802a721aa5d
 *                          comments:
 *                              - _id: 61baffcccf1bb9439c952e62
 *                                visitorId: 34130378
 *                                name: Shuvam
 *                                comment: Very good
 *                                rating: 4
 *                                status: active
 *                          list: 61baf6ec4ac42802a721aa7d
 *                          pendingCount: 7
 *          400:
 *              description: Error
 */
app.get('/', reviewController.getReviewByListAndItemSlug);

/**
 * @swagger
 * /api/admin/review/pending/{slug}:
 *  get:
 *      summary: Getting all items with pending review by list
 *      tags: [adminReview]
 *      parameters:
 *          - in: path
 *            name: slug
 *            schema:
 *              type: string
 *            required: true
 *            description: List slug to get the pending reviews
 *            default: top-it-colleges-of-nepal
 *      responses:
 *          200:
 *              description: Pending reviews of the given list
 *              content:
 *                  application/json:
 *                    example:
 *                      id: 61baf6ec4ac42802a721aa7d
 *                      name: Top IT colleges of Nepal
 *                      slug: top-it-colleges-of-nepal
 *                      description: We are just publishing the name of IT colleges.  The ranking is according to the ratings of users.
 *                      items:
 *                          - item:
 *                              - _id: 61baf5004ac42802a721aa5d
 *                                title: Nepal College of Information Technology (NCIT)
 *                                body: Nepal College of Information Technology (NCIT) is located at Balkumari, Lalitpur. It was founded in 2001 A.D. with affiliation to Pokhara University and offers Bachelor's and Master's programs - BE, BCA, ME, MSc, and MCIS.
 *                                status: active
 *                                image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHB69gIOIfhr2DMZ2t10preQy9cgGST0JTBoYIFMbvbvj1BXCdHnRIeY907hRxgOvvwcQ&usqp=CAU
 *                                comments:
 *                                  - _id: 61bb0fe5cf1bb9439c95315e
 *                                    visitorId: 2487767912
 *                                    name: James
 *                                    comment: This is the best it college
 *                                    rating: 4
 *                                    status: pending
 *          400:
 *                  description: Error        
 */
app.get('/pending/:slug', reviewController.getAllItemsWithPendingReviewsByListSlug);

/**
 * @swagger
 * /api/admin/review:
 *  put:
 *      summary: Updating review status
 *      tags: [adminReview]
 *      parameters:
 *          - in: query
 *            name: reviewId
 *            type: string
 *            required: true
 *            default: 61bb01b2cf1bb9439c952ee3
 *            description: Id of the review
 *          - in: query
 *            name: commentId
 *            type: string
 *            required: true
 *            default: 61bc35f737fa79a27f7f25c7
 *            description: Id of the comment
 *          - in: query
 *            name: status
 *            type: string
 *            required: true
 *            default: active
 *            description: Status - active, pending, spam
 *      responses:
 *          200:
 *              description: Review Updated
 *              content:
 *                  application/json:
 *                      example:
 *                          Status updated.
 */
app.put('/', reviewController.updateReviewStatus);

/**
 * @swagger
 * /api/admin/review:
 *  delete:
 *      summary: Changes the status of the review to spam
 *      tags: [adminReview]
 *      parameters:
 *          - in : query
 *            name : reviewId
 *            require : true
 *            default : 61d6761bf4c056cfbaedef5c
 *            description: Review Id where spam review is present
 *          - in : query
 *            name: commentId
 *            require: true
 *            default: 61d6761bf4c056cfbaedef56
 *            description: Comment Id of spam review
 *      responses:
 *          200:
 *              description: Review moved to spam
 *              content:
 *                  application/json:
 *                      example:
 *                          Comment moved to spam
 */
app.delete('/', reviewController.deleteReview);


module.exports = app;