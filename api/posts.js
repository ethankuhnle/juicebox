const express = require('express');
const postsRouter = express.Router();

const morgan = require('morgan');
const { getAllPosts } = require('../db');

postsRouter.use(morgan('dev'));
postsRouter.use(express.json())

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next();
});

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    });
});

module.exports = postsRouter;
