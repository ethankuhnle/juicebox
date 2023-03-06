const express = require('express');
const postsRouter = express.Router();
const morgan = require('morgan');
const { getAllPosts, createPost } = require('../db');
const { requireUser } = require('./utils');

postsRouter.use(morgan('dev'));
postsRouter.use(express.json())

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next();
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/);
    const postData = {
            authorId: req.user.id,
            title: title,
            content: content
        };
    if (tagArr.length) {
        postData.tags = tagArr;
    }
    try{
        const post = await createPost(postData);

        res.send( post );
    }catch({name, message}){
        next({name, message})
    }
  });


postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    });
});

module.exports = postsRouter;
