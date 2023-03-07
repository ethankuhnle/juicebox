const express = require('express');
const tagsRouter = express.Router();

const morgan = require('morgan');
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use(morgan('dev'));
tagsRouter.use(express.json())

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
  
    next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params
    try {
      // use our method to get posts by tag name from the db X
      const postsWithTagName = await getPostsByTagName(tagName);
      console.log(posts)

      const posts = postsWithTagName.filter(post => {
        if (post.active) {
          return true;
        }

        if (req.user && post.author.id === req.user.id) {
          return true;
        }
        
        return false;
      });
      // send out an object to the client { posts: // the posts }
        res.send(posts)
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next({name, message})
    }
  });

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

module.exports = tagsRouter;