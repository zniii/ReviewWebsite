const List = require('../model/List.model');
const Item = require('../model/Item.model');
const Review = require('../model/Review.model');
const Category = require('../model/Category.model');
const { slugToId } = require('../service/slugHandler');
const { logger } = require('../service/logger');

const getAllItems = async (req, res) => {
    const itemSlug = req.query.item;
    const itemId = await slugToId(itemSlug, 'Item');
    const item = await Item.findById(itemId);
    const value = await List.find({ 'item': itemId, 'status': 'active'});
    let rating = [];
    let list = [];
    for (let i = 0; i < value.length; i++) {
        let listId = await slugToId(value[i].slug, 'List');
        const category = await Category.findById(value[i].category)
        const ranking = await List.findById(listId);
        let rank = ranking.item;
        let position;
        for (let k = 0; k < rank.length; k++) {
            if (itemId == rank[k]) {
                position = k + 1;
            }
        }
        const review = await Review.find({ 'item': itemId, 'list': listId });
        if(review.length == 0){
            let detail = {
                'position': position,
                'rating': 0,
                'count': 0,
                'list': value[i].name,
                'listSlug': value[i].slug,
                'category': category.slug
            }
            rating.push(detail)
        }else{
            for (let j = 0; j < review.length; j++) {
                let detail = {
                    'position': position,
                    'rating': review[j].avgRating,
                    'count': review[j].count,
                    'list': value[i].name,
                    'listSlug': value[i].slug,
                    'category': category.slug
                }
                rating.push(detail)
            }
        }
    }

    let iDetail = {
        'title': item.title,
        'slug': item.slug,
        'body': item.body,
        'type': item.type,
        'image': item.image
    }

    let fDetail = {
        'item': iDetail,
        'standings': rating
    }
    list.push(fDetail)
    res.send(list)
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
    try {
        const listId = await slugToId(slug, 'List');
        const listItems = await List.findOne({ '_id': listId, status: 'active' }).populate({ path: 'item' });
        const idList = await List.findById(listId);
        let unsortedId
        if(idList){
            unsortedId = idList.item;
        }
        if (!(listId && listItems)) {
            logger.info(`List with slug: "slug: '${slug}' not found.`)
            res.status(400).send(`List with slug: "slug: '${slug}' not found.`);
        } else {
            let items = [];

            let Items = listItems.item

            Items.sort((a, b) => {
                let A = a.title.toUpperCase();
                let B = b.title.toUpperCase();
                if (A < B) {
                    return -1
                }
                if (A > B) {
                    return 1
                }
                return 0
            })

            for (let item of Items) {
                let review = await Review.find({ 'list': listId, 'item': item.id });
                let visitors = [];
                visitorReview = review;
                let comments = [];
                //if review exists.
                if (Object.keys(review).length !== 0) {
                    for (let rev of review) {
                        for (let i = 0; i < rev.comments.length; i++) {
                            visitors.push(rev.comments[i].visitorId);
                            if (rev.comments[i].status === 'active') {
                                comments.push(rev.comments[i]);
                            }
                        }
                    }
                    const inner = {
                        item: item,
                        rating: review[0].avgRating,
                        comments: comments,
                        visitors

                    }
                    items.push(inner)

                }

                //if there is no review.
                if (Object.keys(review).length === 0) {
                    const inner = {
                        item,
                        rating: 0,
                        comments
                        // visitors: []
                    }
                    items.push(inner)
                }
            }

            let sortedItems = items
            sortedItems.sort((x, y) => y.rating - x.rating);

            let checkItem = []
            let sortedId = []
            for (let i = 0; i < items.length; i++) {
                checkItem.push(sortedItems[i].item)
                sortedId.push(checkItem[i].id)
            }

            for (let i = 0; i < unsortedId.length; i++) {
                await List.findByIdAndUpdate(listId, { $pull: { 'item': unsortedId[i] } });
            }

            let unfilteredItems = sortedId;
            let filterItems = (unfilteredItems) => unfilteredItems.filter((v,i) => unfilteredItems.indexOf(v) === i);
            let filteredItems = filterItems(unfilteredItems);

            await List.findByIdAndUpdate(listId, { $push: { 'item': filteredItems } });

            let countList = await List.findById(listId).populate({path: 'item', match: { status: 'active'}});
            let countItem = countList.item
            const totalPage = Math.ceil(countItem.length/ limit);
            const list = await List.findOne({ '_id': listId, status: 'active' }).populate({ path: 'item', match: { status: 'active' }, limit: limit, skip: ((page * limit) - limit) });
            let hasNext = false;
            if ((await List.findOne({ '_id': listId, status: 'active' }).populate({ path: 'item', match: { status: 'active' }, limit: limit, skip: (((page + 1) * limit) - limit) })).item.length !== 0) {
                hasNext = true;
            }

            let allItem = []
            for(let i = 0; i<list.item.length; i++){
                allItem.push({item: list.item[i]})
            }
            let data = {
                id: list.id,
                name: list.name,
                slug: list.slug,
                description: list.description,
                coverImage: list.coverImage,
                item : sortedItems,
                currentPage: page,
                totalDocument: countItem.length,
                totalPage,
                hasNext
            };
            logger.info(`Getting items present in list slug: "${slug}"`);
            res.status(200).send(data);
        }
    } catch (error) {
        logger.error(error)
        res.status(400).send(error);
    }
}

module.exports = {
    getAllItems,
    getAllItemsByListSlug
}