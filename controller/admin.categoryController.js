const Category = require('../model/Category.model');
const List = require('../model/List.model');
const mongoose = require('mongoose');
const { slugToId, slugMaker } = require('../service/slugHandler');
const {logger} = require('../service/logger');
const Review = require('../model/Review.model');

const insertNewCategory = async (req,res) => {
    try {
        const name = req.body.name;
        let slug =  slugMaker(name);
        const id = new mongoose.Types.ObjectId;
        const categoryId = await slugToId(slug, 'Category');
        let newCategory;
        //if category already exists with the same slug
        if(categoryId){
            res.status(200).send("Category with that name already exists");
        }else{
            newCategory = {
                "_id": id,
                "name": name,
                "slug": slug,
                "status": 'active' //status are of three states [ active | deactive | pending ]
            }
            let category = new Category(newCategory);
            const savedCategory = await category.save();
            logger.info(`New category made: [id: ${id}, name: ${name}, slug: ${slug}]`);
            res.status(200).send(savedCategory);
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
}


const updateCategory = async (req, res) => {
    const random = parseInt(Math.random()*100);
    try {
        const slug = req.params.slug;
        const name = req.body.name;
        let newSlug = slugMaker(name);
        const categoryId = await slugToId(slug,'Category');
        // checks if the category sent for updation is present or not.
        if(!(categoryId && await Category.findOne({id: categoryId, status: 'active'}))){
            logger.info(`Category with slug: "${slug}" not found or is deleted.`);
            res.status(400).send("category not found");
        }else{
            //checks if new made slug exists or not and changes accordingly.
            if(await slugToId(newSlug)){
                newSlug = newSlug+`-${random}`
            }
            await Category.findByIdAndUpdate(categoryId, {'name': name, slug: newSlug});
            let category = await Category.findById(categoryId);
            logger.info(`Category with slug: "${slug}" updated.`);
            res.status(200).send(category);
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
        
    }
}

const deleteCategory = async (req ,res) => {
    try {
        const slug = req.params.slug;
        let categoryId = await slugToId(slug,'Category');
        //if category or active category not found
        if(!(categoryId && await Category.findOne({id: categoryId, status: 'active'}))){
            logger.info(`Category with slug: "${slug}" not found or already removed.`)
            res.status(400).send("category not found")
        }else{
            const category = await Category.findByIdAndUpdate(categoryId,{status: 'deactive'})
            category.status = "Deleted successfully."
            logger.info(`Category with slug: "${slug}" deleted.`)
            res.status(200).send(category);
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
}

//gets category except category that has been disabled.
const getAllCategory = async (req, res) => {
    try{
        const categories = await Category.find({});
        let data = [];
        categories.map(e => {
            data.push({
                id: e.id,
                name:e.name,
                slug: e.slug,
                 status: e.status
            })
        });
        const resData = {
            "categories":  data,
            "hasNext": false,
            "totalDocuments": categories.length,
            "page": 1,
            "totalPage": 1,
        }
        logger.info(`Get all categories.`);
        res.status(200).send(resData);

    }catch(error) {
        logger.error(error);
        res.status(400).send(error);
    }
}

const updateCategoryStatus = async (req, res) => {
    try{
        const slug = req.query.slug;
        const status = req.query.status;
        const categoryId = await  slugToId(slug,'Category');
        //changes the category status to new sent status    
        await Category.findByIdAndUpdate(categoryId, {'status': status});
        logger.info(`Status updated to ${status}`);
        res.status(200).send("Status updated");
    }catch(error){
        logger.error(error);
        res.status(400).send(error);
    }
}

module.exports = {
    insertNewCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    updateCategoryStatus,
}
