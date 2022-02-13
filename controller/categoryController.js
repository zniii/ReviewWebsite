const Category = require('../model/Category.model');
const List = require('../model/List.model');
const { slugToId } = require('../service/slugHandler');
const {logger} = require('../service/logger');

const getAllCategory = async (req, res) => {
    const options = {};
    if(Object.keys(req.query).length === 0) {
        options.limit = 10;
        options.page = 1;
    } else {
        options.limit = parseInt(req.query.limit);
        options.page = parseInt(req.query.page);
    }
    try{
        const categories = await Category.paginate({'status':'active'},options);
        let data = [];
        //isolating category from all the pagination data
        //making custom object
        categories.docs.map(e => {
            data.push({
                id: e.id,
                name:e.name,
                slug: e.slug
            })
        });
        const resData = {
            "categories":  data,
            "hasNext": categories.hasNextPage,
            "totalDocuments": categories.totalDocs,
            "page": categories.page,
            "totalPage": categories.totalPages
        }
        logger.info(`Get all active category.`);
        res.status(200).send(resData);

    }catch(error) {
        logger.error(error);
        res.status(400).send(error);
    }
}


module.exports = {
    getAllCategory,
}