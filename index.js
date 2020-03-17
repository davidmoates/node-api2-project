const express = require('express');

const postRouter = require('./posts/post-router');
const welcomeRouter = require('./posts/welcome-router');
const server = express();
const port = 6060

server.use(express.json());
server.use('/api/posts', postRouter)
server.use('/', welcomeRouter)



// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
