const Item = require('../model/Item.model');
const Review = require('../model/Review.model');
const List = require('../model/List.model')
const mongoose = require('mongoose');
const slugHandler = require('../service/slugHandler');
const {logger} = require('../service/logger');

const insertReview = async (req,res) => {
    const listSlug = req.body.list;
    const itemSlug = req.body.item;
    const visitorId = req.body.visitorId;
    const currentRating = parseFloat(req.body.rating);
    if(currentRating <= 0 || currentRating > 5) {
        logger.eror(`Invalid rating value posted.`);
        return res.status(400).send('Rating between 1 - 5');
    }
        let comment = {
            "_id": new mongoose.Types.ObjectId,
            "visitorId": visitorId,
            "name": req.body.name,
            "comment": req.body.comment,
            "rating": currentRating,
            "visitorId": req.body.visitorId,
            "status": 'pending'
        }
        try{
            const listId = await slugHandler.slugToId(listSlug,'List');
            const itemId = await slugHandler.slugToId(itemSlug, 'Item');
            if(!(listId && itemId && await List.findOne({id: listId, item: itemId, status: 'active'}))){
                logger.info(`Item with slug: '${itemSlug} or List with slug: '${listSlug} not found.'`);
                return res.status(400).send(`Item or List not found.`);
            }
            const itemExistsInList = await List.find({'_id': listId, 'item': itemId, 'status': 'active'});
            if(itemExistsInList){
                const previousRating = await Review.findOne({"item": itemId, "list": listId});
                if(previousRating){
                    const newPending = previousRating.pendingCount + 1;
                    await Review.findOneAndUpdate({"item": itemId, "list": listId}, {"pendingCount": newPending ,$push: { "comments" : comment }});
                    logger.info(`New review inserted in list with slug: "${listSlug}" of item with slug: "${itemSlug}"`);
                    return res.status(200).send({message: "review inserted succesfully."});
                } else {
                    const newReview = {
                        "_id": new mongoose.Types.ObjectId,
                        "avgRating" : 0,
                        "count" : 0,
                        "pendingCount": 1,
                        "item" : itemId,
                        "list": listId,
                        "comments": comment                    
                    }
                    let review = new Review(newReview);
                    await review.save();
                    logger.info(`New review inserted in list with slug: "${listSlug}" of item with slug: "${itemSlug}"`);
                    return res.status(200).send({message: "review inserted succesfully."});
                }
            } else {
                logger.info(`Item with slug: '${itemSlug}' not found inside list with slug: '${listSlug}'`);
                res.status(400).send(`The item doesn't exist on the list.`)
            }
        }
        catch(error) {
            logger.error(error)
            res.status(400).send(error);
        }
}

//ask if it is used or not ...
const getReviewByListAndItemSlug = async(req,res)=>{
    const listSlug = req.query.list;
    const itemSlug = req.query.item;
    if(Object.keys(listSlug).length === 0 && Object.keys(itemSlug).length === 0){
        logger.info(`List slug: '${listSlug}' or Item slug: '${itemSlug}' not present.`);
        res.status(400).send(`List slug: '${listSlug}' or Item slug: '${itemSlug}' not present.`);
    }else{
        try{
            const listId = await slugHandler.slugToId(listSlug, 'List');
            const itemId = await slugHandler.slugToId(itemSlug, 'Item');
            if(!(listId && itemId)){
                logger.info(`Item with slug: '${itemSlug} or List with slug: '${listSlug} not found.'`);
                res.status(400).send(`Item or List not found.`)
            }
            const itemExistsInList = await List.find({'_id': listId, 'item':itemId, status: 'active'});
            if(itemExistsInList){ 
                let items = await Review.find({'list':listId, 'item':itemId, status: 'active'});
                logger.info(`Get review of item with slug: "${itemSlug}" on list with slug: "${listSlug}"`);
                res.status(200).send(items);
            }else{
                logger.info(`Item with slug: '${itemSlug} or List with slug: '${listSlug} not found.'`);
                res.status(400).send('item does not exist');
            }
        }catch(error){
            logger.error(error)
            res.status(400).send(error);
        }
    }
}


module.exports = {
    getReviewByListAndItemSlug,
    insertReview,
}