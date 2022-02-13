const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * @swagger
 * components:
 *  schemas:
 *      List:
 *          properties:
 *              _id: 
 *                  type: ObjectId
 *                  description: Auto-generated Id of List
 *              name:
 *                  type: string
 *                  description: Name of the list
 *              description:
 *                  type: string
 *                  description: Description of the list
 *              category:
 *                  type: ObjectId
 *                  description: Id of category
 *              item:
 *                  type: array
 *                  items:
 *                      type: ObjectId
 *                      description: Id of items present in the list
 *              slug:
 *                  type: string
 *                  description: Auto-generated unique characters whic identifies the resource being served
 *              status:
 *                  type: string
 *                  description: 
 *          example:
 *                  _id: ObjectId(61baf6ec4ac42802a721aa7d)
 *                  name: Top IT Colleges Of Nepal
 *                  description: We are just publishing the name of IT colleges.  The ranking is according to the ratings of users.
 *                  category: ObjectId(61bac88e4ac42802a721a9a4)
 *                  item:
 *                      - 0: ObjecttId(61baf5004ac42802a721aa5d)
 *                        1: ObjecttId(61baf5514ac42802a721aa63)
 *                  slug: top-it-colleges-of-nepal
 */

const schema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
            validate: {
                validator: function(text) {
                    return text.length > 3
                },
                message: "Name provided is too short."
            }
        },
        description: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return text.length > 20
                },
                message: "description provided for item is too short"
            }
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        item: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
         slug: String,
        status: {
            type: String,
            //required: true,
            validate: {
                validator: function(text) {
                    return text === 'pending' || 'active' || 'deactive'
                },
                message: "State error."
            }
        },
        coverImage: String
    },
    {versionKey: false}
);

schema.plugin(mongoosePaginate);
schema.index("name");
schema.index("slug");
const List = mongoose.model("List", schema);
module.exports = List;