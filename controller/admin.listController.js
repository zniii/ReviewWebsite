const mongoose = require('mongoose');
const List = require('../model/List.model');
const Item = require('../model/Item.model');
const Category = require('../model/Category.model');
const Review = require('../model/Review.model');
const { slugMaker, slugToId } = require('../service/slugHandler');
const {logger} = require('../service/logger');

const updateListBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const name = req.body.name;
        const random = parseInt(Math.random()*100);
        const description = req.body.description;
        const coverImage = req.body.coverImage;
        let item = req.body.item;
        let list;
        let itemId = []
        let listId = await slugToId(slug ,'List');
        if(!(listId && await List.findOne({id: listId}))){
            logger.info(`List with slug: '${slug}' not found.`)
            res.status(400).send("list not found")
        }else{
            if(name){
                let newSlug = slugMaker(name);
                const checkName = await List.findOne({"name": name});
                if(checkName){
                    list = await List.findByIdAndUpdate(listId, {'name': name});
                }else{
                    newSlug = newSlug+`${random}`;
                    list = await List.findByIdAndUpdate(listId, {'name': name, 'slug': newSlug});
                }
            }
            if(description){
                list = await List.findByIdAndUpdate(listId, {'description': description});
            }
            if(coverImage){
                list = await List.findByIdAndUpdate(listId, {'coverImage': coverImage});
            }
            if(item){
                for(let i = 0; i<item.length; i++){
                    const check = await Item.findById(item[i]);
                    if(check){
                        itemId.push(item[i])
                    }else{
                        let invalidItem = []
                        invalidItem.push(item[i]);
                    }
                }
            }
            
            const findList= await List.findById(listId)
            let oldItem = []
            oldItem = findList.item
            for(let j = 0; j< oldItem.length; j++){
                await List.findByIdAndUpdate(listId, {$pull: {'item': oldItem[j]}});
            }
			

            await List.findByIdAndUpdate(listId, {$push: {'item': itemId}});
            list = await List.findById(listId);
            logger.info(`List with slug: "${slug}" updated.`);
            res.status(200).send(list);
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
        
    }
}

const deleteListBySlug = async (req, res) => {
    const slug = req.params.slug;
    try {
        const listId = await slugToId(slug, 'List');
        const oldList = await List.findById(listId);
        if(!(listId && await List.findOne({id: listId, status: 'active'}))){
            logger.info(`List with slug: '${slug} not found.'`);
            res.status(400).send(`List not present.`);
        }else{
            await List.findByIdAndUpdate(listId,{status: 'deactive'});
            oldList.status = "List deleted successfully."
            logger.info(`List with slug: "${slug} deleted.`);
            res.status(200).send(oldList);
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
}

//perform some push operation here
const addItemInList = async (req, res) => {
    try{
        const listSlug = req.params.slug;
        let itemSlug = req.body.item;
        let itemId = [];
        let invalidItem = [];
        const listId = await slugToId(listSlug, 'List');
        for(let i = 0; i<itemSlug.length; i++){
            let id = await slugToId(itemSlug[i], 'Item');
            const check = await Item.findById(id);
            if(check){
                const value = await List.findOne({'_id': listId, 'item': id})
                if(value){
                    await List.findByIdAndUpdate({'_id': listId}, {$pull: {'item': id}})
                    itemId.push(id)
                }else{
                    itemId.push(id)
                }
            }else{
                invalidItem.push(itemSlug[i]);
            }
        }
        if(listId){       
            await List.findByIdAndUpdate({'_id': listId, status: 'active'}, {$push: {'item': itemId}});
            let checkValue = await List.findById(listId)
            logger.info(`Item added in list slug: "${listSlug}"`);
            res.status(200).send(`Items added successfully with invalid items: ${invalidItem}`);
        }else{
            logger.info(`Item or List not found.`);
            res.status(400).send('item or list not found.');
        }
    }catch(error) {
        logger.error(error)
        res.status(400).send(error);
    }
}

const deleteItemInList = async (req, res) => {
    try{
        const listSlug = req.body.list;
        const itemSlug = req.body.item;
        const listId = await slugToId(listSlug, 'List');
        const itemId = await slugToId(itemSlug, 'Item');
        if(!(await List.findOne({"_id": listId, "item": itemId}))){
            res.status(200).send("Item or List not found");
        }else{
            await List.findByIdAndUpdate(listId, {$pull: {'item': itemId}});
            res.status(200).send('Item removed successfully');
        }
    }catch(error){
        logger.error(error);
        res.status(400).send(error);
    }
}


const getAllItemsByListSlug = async (req, res) => {
    const slug = req.params.slug;
    let page, limit;
    if (Object.keys(req.query).length === 0) {
        limit = 10;
        page = 1;
    } else {
        limit = parseInt(req.query.limit);
        page = parseInt(req.query.page);
    }
    try{
        const listId = await slugToId(slug,'List');
        const listItems = await List.findOne({'_id': listId}).populate({path: 'item', limit: limit, skip: ((page * limit) - limit) });
        const totalItems = await List.findById(listId);
        let totalDocument = totalItems.item;
        let totalPage = Math.ceil(totalDocument.length/limit);
        let hasNext = false;
        if((await List.findOne({'_id': listId}).populate({path: 'item', limit: limit, skip: (((page + 1) * limit) - limit) })).item.length !== 0){
            hasNext = true;
        }
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
                        comments.push(rev.comments)
                    }
                    const inner = {
                        item: item,
                        rating : review[0].rating,
                        comments:  comments
                    }
                    items.push(inner)
                }
                if(Object.keys(review).length === 0) {
                    const inner = {
                        item
                    }
                    items.push(inner)
                }
            }
            
            const list = await List.findById(listId);
            let data = {
                id: list.id,
                name: list.name,
                slug: list.slug,
                description: list.description,
                coverImage: list.coverImage,
                items: items,
                currentPage: page,
                totalPage: totalPage,
                totalDocument: totalDocument.length,
                hasNext
            };
            logger.info(`Getting items present in list slug: "${slug}"`);
            res.status(200).send(data);
        }
    } catch(error) {
        logger.error(error)
        res.status(400).send(error);
    }
}

//make new list and inserts items in it...
const insertNewList = async (req, res) => {
    try{
        const categoryId = await slugToId(req.body.category, 'Category');
        let category = await Category.find({'_id': categoryId, status: 'active'});
        const checkList = await List.findOne({'name': req.body.name});
        category = category[0]
        const name = req.body.name;
        let list = {};
        const random = parseInt(Math.random()*100);
        const id = new mongoose.Types.ObjectId
        if(!category){
            logger.info(`category with slug: "${req.body.category}"`);
            res.status(400).send('category not found');
        }else if(checkList){
            res.status(400).send('List with that name already exists.');
        }
        else{
            let slug = slugMaker(name);
            const itemId = await slugToId(slug, 'List');
            if(itemId) slug = slug+ `${random}`
            list = {
                '_id': id,
                'name': req.body.name,
                'description': req.body.description,
                'category': category.id,
                'item': req.body.item,
                'slug': slug,
                'status': 'active',
                'coverImage': req.body.coverImage
            }
            const newList = new List(list);
            await newList.save();
            const resData = {
                categoryId: category.id,
                categoryName: category.name,
                name: req.body.name,
                description: req.body.body,
                slug: slug,
                coverImage: req.body.coverImage,
                message: "List inserted."
            }
            logger.info(`New list inserted.`);
            res.status(200).send(resData);
        }
    } catch (error) {
        logger.error(error)
        res.status(400).send(error);
    }
}

const getAllItemsWithPendingReviewsByListSlug = async (req, res) => {
    const slug = req.params.slug;
    try{
        const listId = await slugToId(slug,'List');
        const listItems = await List.findOne({id: listId}).populate({path: 'item'});
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
                        if(rev.comments[0].status === 'pending'){
                            comments.push(rev.comments)
                        }
                    }
                    logger.info(comments)
                    if(comments.length != 0){
                        const inner = {
                            item: item,
                            rating : review[0].rating,
                            comments:  comments
                        }
                        items.push(inner)
                    }
                }
            }
            const list = await List.findById(listId);
            let data = {
                id: list.id,
                name: list.name,
                slug: list.slug,
                description: list.description,
                coverImage: list.coverImage,
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

//sends all the list with pending count to admin
//!remove the filter for category...
// http://localhost:5000/api/list/admin/new
const getAllList = async (req, res) => {
    const slug = req.params.slug;
    try{
        const lists = await List.find({});
        
        let data = [];
        let reviews;
        for(let list of lists){
            let items = await List.findById(list.id)
            // .populate({path: 'item'}
            let itemDetail
            let fullDetail = []
            let listItems = items.item
            for(let i = 0; i<listItems.length; i++){
                let getItems = await Item.findById(listItems[i])
                itemDetail = {
                    'id': getItems.id,
                    'title': getItems.title,
                    'slug': getItems.slug
                }
                fullDetail.push(itemDetail)
            }
            let pendingCount = 0;
            reviews = await Review.find({list: list.id})
            for(let item of reviews){
               pendingCount += item.pendingCount;
            }
            data.push({
                    id: list.id,
                    name: list.name,
                    description: list.description,
                    slug: list.slug,
                    coverImage: list.coverImage,
                    items: fullDetail,
                    status: list.status,
                    pendingCount: pendingCount
                })
        }
        const responseData = {
            lists: data,
            "hasNext": false,
            "totalDocuments": lists.length,
            "page": 1,
            "totalPage": 1,
        };
        logger.info(`Getting list by category slug: "${slug}"`);
        res.status(200).send(responseData);
    } catch (error){
        logger.error(error);
        res.status(400).send(error);
    }
}

const updateListStatus = async (req,res) => {
    const status = req.query.status;
    const list = req.query.list;
    const listId = await slugToId(list,'List');
    const value = await List.findById(listId);
    if(value){
        await List.findByIdAndUpdate(listId, {'status': status});
        const data = await List.findById(listId);
        res.status(200).send(data);
    }else{
        res.status(200).send('Invalid list slug.');
    }
}

module.exports = {
    insertNewList,
    updateListBySlug,
    addItemInList,
    deleteItemInList,
    getAllList,
    getAllItemsByListSlug,
    getAllItemsWithPendingReviewsByListSlug,
    deleteListBySlug,
    updateListStatus
}