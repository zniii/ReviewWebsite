const Category = require('../model/Category.model');
const List = require('../model/List.model');
const mongoose = require('mongoose');
const Item = require('../model/Item.model');
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
const { Readable } = require('stream')


let sitemap

const siteMap = async(req,res)=>{
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    

    if(sitemap){
        res.send(sitemap)
        return
    }

    try{
        const smStream = new SitemapStream({hostname: 'https://review.listnepal.com/'});
        const pipeline = smStream.pipe(createGzip());

        let items = [];
        
        let homepage = {
            'url': '',
            'name': 'Home Page',
            'changefreq': 'daily',
            'priority': 0.3,
            'date': Date.now()
        }
        items.push(homepage)
        const category = await Category.find({'status':'active'});
        const list = await List.find({'status':'active'}).populate({path: 'category'});
        const detail = await Item.find({'status':'active'})
        for(let i = 0; i < category.length; i++){
            let item = {
                'url': category[i].slug,
                'name': category[i].name,
                'changefreq': 'daily',
                'priority': 0.3,
                'date': Date.now()
            }
            items.push(item)   
        }
        for(let i = 0; i < list.length; i++){
            let Category = list[i].category
            let item = {
                'url': `${Category.slug}/${list[i].slug}`,
                'name': list[i].name,
                'changefreq': 'daily',
                'priority': 0.3,
                'date': Date.now()
            }
            items.push(item);
        }
        
        for(let i = 0; i<detail.length; i++){
            let item = {
                'url': `details/${detail[i].slug}`,
                'name': detail[i].title,
                'changefreq': 'daily',
                'priority': 0.3,
                'date': Date.now()
            }
            items.push(item);
        }

        for(let i = 0; i<items.length; i++){
            (smStream.write(items[i]));
        }
        streamToPromise(pipeline).then(sm => sitemap = sm);
        smStream.end();
        pipeline.pipe(res).on('error', (e) => {throw e});
        // res.send(items)
    }catch(error){
        res.status(400).send(error)
    }
}

module.exports = {
    siteMap,
}