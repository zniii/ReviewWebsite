const mongoose = require('mongoose');
const List = require('../model/List.model');
const Item = require('../model/Item.model');
const Category = require('../model/Category.model');
const Review = require('../model/Review.model');
const { slugMaker, slugToId } = require('../service/slugHandler');
const {logger} = require('../service/logger');

//gets list by category id.
const getAllListByCategory = async (req, res) => {
    const slug = req.params.slug;
    const options = {};
    if(Object.keys(req.query).length === 0){
        options.limit = 5;
        options.page = 1;
    } else {
        options.limit = parseInt(req.query.limit);
        options.page = parseInt(req.query.page);
    }
    try{
        const categoryId = await  slugToId(slug,'Category');
        if(!categoryId){
            logger.info(`Category with slug: "${slug}" not found.`)
            res.status(400).send("category not found")
        }else{
            //gets paginated data
            const lists = await List.paginate({'category': categoryId, 'status': 'active'}, options);
            let data = [];
            //makes new object and puts it in as object in data array
            //done to isolate data from category and paginated datas
            lists.docs.map(e => {
                data.push({
                    id: e.id,
                    name:e.name,
                    description: e.description,
                    slug: e.slug,
                    coverImage: e.coverImage
                })
            });
            const category = await Category.findById(categoryId);
            //sent back to the user
            const responseData = {
                categoryId: category.id,
                categoryName: category.name,
                slug: category.slug,
                lists: data,
                "hasNext": lists.hasNextPage,
                "totalDocuments": lists.totalDocs,
                "page": lists.page,
                "totalPage": lists.totalPages
            };
            logger.info(`Getting list by category slug: "${slug}"`);
            res.status(200).send(responseData);
        }
    } catch (error){
        logger.error(error);
        res.status(400).send(error);
    }
}


module.exports = {
    getAllListByCategory 
}