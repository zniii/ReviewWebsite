const Category = require('../model/Category.model');
const Item = require('../model/Item.model');
const List = require('../model/List.model');
const {logger} = require('../service/logger')

/**
 * 
 * @param {String} title name or title for which you want the slug of
 * @returns {String} slug
 */
const slugMaker = (title) =>{
    return title.toLowerCase().replace(/([ ?:(){}.=,_\[\]])/g,'-');
}

/**
 * 
 * @param {String} slug slug of the object
 * @param {String} modelName model name [ Category | List | Item] 
 * @returns {String} id of the corresponding slug. 
 */
const slugToId = async (slug, modelName) => {
    try{
        switch (modelName) {
            case 'Category':
                const category = await Category.findOne({slug:slug});
                if(!category){
                    id = null;
                    break;
                }else{
                    id = category.id;
                    break;
                }
            case 'List':
                const list = await List.findOne({slug: slug});
                if(!list){
                    id = null;
                    break;
                }else{
                    id = list.id;
                    break;
                }
            case 'Item':
                const item = await Item.findOne({slug: slug});
                if(!item){
                    id = null;
                    break;
                }else{
                    id = item.id;
                    break;
                }
            default:
                logger.error(`Possible inputs: [Category, Item, List]. Iserted input.-> ${modelName}`)
                break;
        }return id;

    } catch(error) {
        logger.error(error);
        console.log(error);
    }
}


module.exports = {
    slugMaker,
    slugToId
}