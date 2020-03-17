const express = require('express')
const posts = require('../data/db');

const router = express.Router()

// This handles the route /api/posts
router.get('/', (req, res) => {

  posts.find()
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The posts information could not be retrieved.",
    });
  });
});


router.get('/:id', (req, res) => {
  posts.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post information could not be retrieved.",
    });
  });
});

// This handles POST /api/posts
router.post('/', (req, res) => {
  const { title, contents } = req.body
  if (!title || !contents) {
    return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
  posts.insert(req.body)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the post to the database",
    });
  });
});

// This handles PUT /api/posts/:id
router.put('/:id', (req, res) => {
  const { title, contents } = req.body
  if (!title || !contents) {
    return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
  const changes = req.body;
  posts.update(req.params.id, changes)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post information could not be modified.",
    });
  });
});

// This handles DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  posts.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'EXTERMINATE!' });
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post could not be removed",
    });
  });
});

// A route for listing out a post's comments
// This handles GET /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
  posts.findPostComments(req.params.id)
  .then(comments => {
    if (comments) {
      res.json(comments)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    // or just res.json(comment) since express defaults to a 200
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The comments information could not be retrieved.",
    });
  });
})
// A route for specific comment by ID
// This handles GET /api/posts/:postId/comments/:commentsId
router.get("/:postId/comments/:commentId", (req, res) => {
  posts.findCommentById(req.params.postId, req.params.commentId)
  .then(comment => {
    if (comment) {
      res.json(comment)
    } else {
      res.status(404).json({ comment: "comment was not found" })
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post information could not be retrieved.",
    });
  });
})

// A route for creating a comment
// This handles POST /api/posts/:id/comments
router.post("/:id/comments", (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ errorMessage: "Please provide text for the comment." })
  }

  posts.insertComment({ ...req.body, post_id: req.params.id }) // you can also say { text, post }
  .then(newComment => {
      if (newComment) {
        res.status(201).json(newComment)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the comment to the database",
    });
  });
})

module.exports = router
