const List = require('../model/List.model');
const Item = require('../model/Item.model');
const mongoose = require('mongoose');
const { slugMaker, slugToId } = require('../service/slugHandler');
const { logger } = require('../service/logger');

const insertItem = async (req, res) => {
    const listSlug = req.body.list;
    const id = new mongoose.Types.ObjectId;
    const title = req.body.title;
    const type = req.body.type;
    let slug = slugMaker(title);
    let newItem = {};
    const random = parseInt(Math.random()*100);
    const value = await Item.findOne({'slug':slug});
    try{
        if(value){
            slug = slug+`-${random}`;
        } 
        newItem = {
            "_id":id,
            "title":req.body.title,
            "body":req.body.body,
            "slug": slug,
            "image": req.body.image,
            "type": req.body.type,
            "status": 'active'
        }
        let item = new Item(newItem);
        const listId = await slugToId(listSlug, 'List');
        await item.save();
        if(listId){
            await List.findByIdAndUpdate(listId, {$push: {'item': item.id}});
            logger.info(`Item added successfully.`);
            return res.status(200).send("Item added successfully");
        }
        res.status(200).send("Item added successfully");
    }catch(error){
        logger.error(error);
        res.status(400).send(error);
    }
}

const updateItemBySlug = async(req, res) => {
    const slug = req.params.slug;
    try{
        let itemId = await slugToId(slug, 'Item');
        if(!(itemId && await Item.findOne({id:itemId, status: 'active'}))){
            logger.info(`Item with slug: "${slug} not found or deleted."`)
            res.status(400).send("Invalid Slug.");
        }else{
            if(req.body.image){
                await Item.findByIdAndUpdate(itemId, {
                    "image": req.body.image
                })
            }
            if(req.body.title){
                const title = req.body.title;  
                const check = await Item.findOne({'id':itemId, 'title':title})
                if(!check){
                    const newSlug = slugMaker(title);
                    if(await slugToId(newSlug, 'Item')) newSlug = newSlug+`-${random}`
                    await Item.findByIdAndUpdate(itemId, {
                        "title":req.body.title,
                        "slug" : newSlug
                    })
                }
            }
            if(req.body.body){
                await Item.findByIdAndUpdate(itemId, {
                    "body":req.body.body,
                })
            }
            if(req.body.type){
                await Item.findByIdAndUpdate(itemId, {"type": req.body.type})
            }
            let item = await Item.findById(itemId);
            logger.info(`Item with slug: "${slug}" updated.`)
            res.status(200).send(item);
        }
    }catch(error){
        logger.error(error);
        res.status(400).send;
    }
}

const updateStatusOfItemBySlug = async (req, res) => {
    const itemSlug = req.query.slug;
    const status = req.query.status;
    try{
        const itemId = await slugToId(itemSlug, 'Item');
        if(!itemId){
            logger.info(`Item with slug -> ${itemSlug} not found.`)
            res.status(400).send(`Item with slug -> ${itemSlug} not found.`);
        }else{
            await Item.findByIdAndUpdate(itemId,{'status':status});
            let item =  await Item.findById(itemId);
            logger.info(`Status updated to ${status} of item with id ${itemId}`);
            res.status(200).send(item);
        }
    }catch(error){
        logger.error(error);
        res.status(400).send(error);
    }
}

const getAllItems = async (req, res) => {
    try{
        const items = await Item.find({});
        let data = [];
        items.map(e => {
            data.push({
                id: e.id,
                title: e.title,
                body: e.body,
                slug: e.slug,
                image: e.image,
                type: e.type,
                status: e.status
            })
        });
        const resData = {
            "items":  data,
            "hasNext": false,
            "totalDocuments": items.length,
            "page": 1,
            "totalPage": 1,
        }
        logger.info(`Get all Items.`);
        res.status(200).send(resData);
    }catch(error) {
        logger.error(error);
        res.status(400).send(error);
    }
}

module.exports = {
    insertItem,
    updateItemBySlug,
    updateStatusOfItemBySlug,
    getAllItems
}