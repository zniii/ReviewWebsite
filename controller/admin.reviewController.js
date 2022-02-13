const Item = require('../model/Item.model');
const Review = require('../model/Review.model');
const List = require('../model/List.model')
const mongoose = require('mongoose');
const slugHandler = require('../service/slugHandler');
const {logger} = require('../service/logger');


const updateReviewStatus = async (req,res) => {
    try{
        const {reviewId, commentId, status} = req.query;
        let review = await Review.findById(reviewId);
        let comments = review.comments;
        let comment;
        let aggrigate, count;
        const holder = [];
        [comment, _] = comments.filter(e => e.id === commentId);
        await Review.findByIdAndUpdate(reviewId, {$pull: { "comments" : comment } } );
        if(comment.status == 'pending'){
            comment.status = status;
            const previousRating = await Review.findById(reviewId);
            let allComments = previousRating.comments;
            let activeComments = allComments.filter(e => e.status === 'active');
            switch (status) {
                case 'active' :
                    activeComments.map(e => holder.push(e.rating));
                    holder.push(comment.rating);
                    sum = holder.reduce((tot,e) => tot+=e, 0);
                    aggrigate = sum/holder.length;
                    count = previousRating.count + 1;
                    pendingCount = previousRating.pendingCount - 1;             
                    break;
                default:
                    logger.info(`Status could not be updated.`);
                    return res.status(200).send('Status updation failed.');
                }
        }else{
            comment.status = status;
            const previousRating = await Review.findById(reviewId);
            let allComments = previousRating.comments;
            let activeComments = allComments.filter(e => e.status === 'active');
            switch (status) {
                case 'pending' :
                    activeComments.map(e => holder.push(e.rating));
                    holder.push(comment.rating)
                    sum = holder.reduce((tot,e) => tot += e, 0);
                    let length = holder.length-1;
                    if(length == 0){
                        length = 1;
                        aggrigate = (sum - comment.rating)/length;
                        count = previousRating.count - 1;
                        pendingCount = previousRating.pendingCount + 1;
                        break;
                    }else{
                        aggrigate = (sum - comment.rating)/length;
                        count = previousRating.count - 1;
                        pendingCount = previousRating.pendingCount + 1;
                        break;
                    }
                default:
                    logger.info(`Status could not be updated.`);
                    return res.status(200).send('Status updation failed.');
                }
        }   
        await Review.findByIdAndUpdate(reviewId, { "avgRating": aggrigate, "count": count, "pendingCount": pendingCount, $push: { "comments" : comment } } );
        res.status(200).send('Status updated');
        logger.info(`Status updated to ${req.query.status}}`);
    }catch(error){
        logger.error(error)
        res.status(400).send(error);
    }
}

const getReviewByListAndItemSlug = async(req,res) => {
    const listSlug = req.query.list;
    const itemSlug = req.query.item;
    try{
        const listId = await slugHandler.slugToId(listSlug, 'List');
        const itemId = await slugHandler.slugToId(itemSlug, 'Item');
        let items = await Review.find({'list':listId, 'item':itemId});
        logger.info(`Get review of item with slug: "${itemSlug}" on list with slug: "${listSlug}"`);
        res.status(200).send(items);
    }catch(error){
        logger.error(error);
        res.status(400).send(error);
    }
}

const getAllItemsWithPendingReviewsByListSlug = async (req, res) => {
    const slug = req.params.slug;
    try{
        const listId = await slugHandler.slugToId(slug,'List');
        const listItems = await List.findOne({'_id': listId}).populate({path: 'item'});
        if(!(listId && listItems)){
            logger.info(`List with slug: "slug: '${slug}' not found.`)
            res.status(400).send(`List with slug: "slug: '${slug}' not found.`);
        } else{
            let items = [];
            for(let item of listItems.item){
                let review = await Review.find({'list':listId, 'item': item.id});
                let comments = [];
                if(Object.keys(review).length !== 0){
                    for(let rev of review){
                        for(let comment of rev.comments){
                            let newComment;
                            if(comment.status === 'pending'){
                                newComment = {
                                    "reviewId": review[0].id,
                                    "commentId": comment.id,
                                    "visitorId": comment.visitorId,
                                    "name": comment.name,
                                    "comment": comment.comment,
                                    "rating": comment.rating,
                                    "status": comment.status
                                }
                                comments.push(newComment)
                            }
                        }
                    }
                    if(comments.length != 0){
                        item.comments = comments;
                        item = {
                            _id: item._id,
                            title: item.title,
                            body: item.body,
                            status: item.status,
                            image: item.image,
                            comments: comments
                        };
                        const inner = {
                            item
                            // comments:  comments
                            //rating : review[0].rating,
                        }
                        items.push(inner);
                    }
                }
            }
            const list = await List.findById(listId);
            let data = {
                id: list.id,
                name: list.name,
                slug: list.slug,
                description: list.description,
                items: items
            };
            logger.info(`Getting items present in list slug: "${slug}"`);
            res.status(200).send(data);
        }
    } catch(error) {
        logger.error(error)
        res.status(400).send(error);
    }
}

const deleteReview = async (req,res) => {
    const {reviewId, commentId} = req.query;
    let review = await Review.findById(reviewId);
    if(review){
        let comments = review.comments;
        let comment = [];
        [comment, _] = comments.filter(e => e.id === commentId);
        if(comment){
            if(comment.status == 'active'){
                await Review.findByIdAndUpdate(reviewId, {$pull: { "comments" : comment }});
                comment.status = 'spam'
                let activeComments = comments.filter(e => e.status === 'active');
                let holder = []
                activeComments.map(e => holder.push(e.rating));
                holder.push(comment.rating)
                sum = holder.reduce((tot,e) => tot += e, 0);
                let length = holder.length-1;
                if(length == 0){
                    length = 1;
                    aggrigate = (sum - comment.rating)/length;
                }else{
                    aggrigate = (sum - comment.rating)/length;
                }

                let count = review.count - 1;
                await Review.findByIdAndUpdate(reviewId, {"avgRating":aggrigate , "count": count, $push: { "comments" : comment }});

            }
            if(comment.status == 'pending'){
                await Review.findByIdAndUpdate(reviewId, {$pull: { "comments" : comment }} );
                comment.status = 'spam'
                let pendingCount = review.pendingCount -1;
                await Review.findByIdAndUpdate(reviewId, {"pendingCount": pendingCount, $push: {"comments": comment}});
            }
            res.status(200).send("Comment moved to spam");
        }else{
            res.status(400).send("Invalid Comment Id");
        }
    }else{
        res.status(400).send("Invalid Review Id");
    }
}



module.exports = {
    updateReviewStatus,
    getReviewByListAndItemSlug,
    getAllItemsWithPendingReviewsByListSlug,
    deleteReview
}