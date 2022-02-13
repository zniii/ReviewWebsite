const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require('cors');
const {logger} = require('./service/logger');
const cookieParser = require('cookie-parser');

/**
 * options for swagger
 */
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Review.ListNepal",
            version: "1.0.0",
            description: "category -> list -> items -> reviews"
        },
        servers: [{
            url: "http://localhost:5000"
        }]
    },
    apis: ["./route/*.js","./model/*.js","./controller/*.js"]
}
const specs = swaggerJsDoc(options);
const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
const port = 5000 || process.env.PORT;
app.use(express.json());
/**
 * cors - Cross-origin resource sharing
 * origin * - api can be called from anywhere
 */
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions));
app.use(cookieParser());

//importing routes
const categoryRoute = require('./route/categoryRoute');
const itemRoute = require('./route/itemRoute');
const reviewRoute = require('./route/reviewRoute');
const listRoute = require('./route/listRoute');
const adminCategoryRoute = require('./route/admin.categoryRoute');
const adminReviewRoute = require('./route/admin.reviewRoute');
const adminListRoute = require('./route/admin.listRoute');
const adminItemRoute = require('./route/admin.itemRoute');
//setting up a cookie
// app.use((req,res)=>{
    //     res.cookies
    // })
    
//sitemap
const sitemapRouter = require('./route/sitemapRoute');

app.use('/api/sitemap.xml', sitemapRouter);

//passing through routes
app.use('/api/category', categoryRoute);
app.use('/api/item', itemRoute);
app.use('/api/review', reviewRoute);
app.use('/api/list', listRoute)

//passing through admin routes
app.use('/api/admin/category', adminCategoryRoute);
app.use('/api/admin/review', adminReviewRoute);
app.use('/api/admin/list', adminListRoute);
app.use('/api/admin/item', adminItemRoute);
//making connection with the database and starting the server...
app.listen(port,() => {
    logger.info(`Server started at port: ${port} ...`);
    mongoose.connect(process.env.MONGO_CONNECTION, (err) => {
        if(!err)
            logger.info('Connected to the database.');    
        //console.log('Connection made with the database.');
        else
            logger.error(`[${err}, Connection with the database could not be established.]`);
    });
});