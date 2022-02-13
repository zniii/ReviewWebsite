const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * @swagger
 * components:
 *  schemas:
 *      Review:
 *          properties:
 *              _id: 
 *                  type: ObjectID
 *                  description: Auto generated Id of review
 *              rating:
 *                  type: Number
 *                  description: Average rating provided by users
 *              count:
 *                  type: Number
 *                  description: Number of users who have rated
 *              comments:
 *                 properties:
 *                      _id:
 *                          type: ObjectId
 *                          description: Auto generated Id of comments
 *                      avgRating:
 *                          type: string
 *                          description: Average rating
 *                      count:
 *                          type: Number
 *                          description: Total number of people who have given the feedback
 *                      pendingCount:
 *                          type: Number
 *                          description: Number of counts that are pending
 *                      item:
 *                          type: ObjectId
 *                          description: Object Id of item
 *                      name:
 *                          type: string
 *                          description: Name of the user that have commented
 *                      comment:
 *                          type: string
 *                          description: Comment provided by the user
 *              list:
 *                  type: ObjectId
 *                  description: Id of the list
 *          example:
 *              _id: ObjectId(61a06b51915f12e5d613744e)
 *              rating: 4
 *              count: 1
 *              item: ObjectId(61a06b51915f12e5d613744e)
 *              comments:
 *                  _id: ObjectId(61a06b51915f12e5d613744e)
 *                  name: Brian
 *                  comment: This movie is great
 *              list: ObjectId(61a06b51915f12e5d613744e)
 */
const schema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        avgRating: {
            type: Number,
            required: true,
        },
        count: Number,
        pendingCount: Number,
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Item'
        },
        comments: [
            {
                _id : mongoose.Schema.Types.ObjectId,
                visitorId: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true,
                    validate: {
                        validator: (text) => {
                            return text.length > 0
                        },
                        message: "Please enter your name."
                    }
                },
                comment:{
                    //required: true,
                    type: String,
                    validate: {
                        validator: function (text) {
                        return text.length > 0
                    },
                    message: "Comment provided is too short."
                    }       
                },
                rating:{
                    required: true,
                    type: Number
                }, 
                status: {
                    type: String,
                    //required: true,
                    validate: {
                        validator: function(text) {
                        return text === 'pending' || 'active' || 'spam'
                        },
                        message: "State error."
                    }
                }
            }
        ],
        list: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'List'
        }
    },
    {versionKey: false}
);

schema.plugin(mongoosePaginate);

const Review = mongoose.model("Review", schema);

module.exports = Review;