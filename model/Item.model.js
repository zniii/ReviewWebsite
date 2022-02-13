const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * @swagger
 * components:
 *  schemas:
 *      Item:
 *          properties:
 *              _id:
 *                  type: ObjectId
 *                  description: Auto-generated Id of item
 *              title:
 *                  type: string
 *                  description: Name of the item
 *              body:
 *                  type: string
 *                  description: Description of the title
 *              slug:
 *                  type: string
 *                  description: Auto-generated unique characters whic identifies the resource being served
 *              status:
 *                  type: string
 *                  description: Status of the item - active, deactive or pending
 *              image:
 *                  type: string
 *                  description: URL of the image
 *              type:
 *                  type: string
 *                  description: Type of the item
 *          example:
 *              _id: ObjectId(61baf5514ac42802a721aa63)
 *              title: Everest Engineering College
 *              body: Everest Engineering College (formerly known as Everest Engineering and Management College), established in 2001, is one of the reputed and leading institutes, under the affiliation of Pokhara University. It is presently located at a picturesque location of Sanepa, Lalitpur (Shuvatara School, Old premises) , a quiet and serene environment, suitable for studies.
 *              slug: everest-engineering-college
 *              status: active
 *              image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAJOJduht69bx4EnNXpkoa_hI7Ny_3Z5l_3NfiuLIF9-gP9w0IxNqeVPG6Cv_OlbwvQaU&usqp=CAU
 *              type: place
 */ 

const schema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        title: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return text.length > 3
                },
                message: "Title provided for item is too short"
            }
        },
        //description of the item
        body: {
            type: String,
            required: true,
            validate: {
                validator: function (text) {
                    return text.length > 20
                },
                message: "description provided for item is too short"
            }
        },
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
        slug: String,
        image: String,
        type: {
            type: String
        }
    },
    {versionKey: false}
);

schema.index("title");
schema.index("slug");
schema.plugin(mongoosePaginate);
const Item = mongoose.model("Item", schema);

module.exports = Item;