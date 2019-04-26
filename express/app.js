/**** External libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
/**** Configuration ****/
const appName = "Foobar";
const port = (process.env.PORT || 8080);
const app = express();
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static(path.join(__dirname, '../build')));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser
// Read more here: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      // respond with 200
      console.log("Allowing OPTIONS");
      res.send(200);
    }
    else {
      // move on
      next();
    }
});

mongoose.connect('mongodb+srv://emil:emilmongo@cluster0-pmpbu.mongodb.net/mandatory?retryWrites=true', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected to database!!');
});


var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let CommentSchema = new Schema({
    id:  mongoose.Schema.Types.ObjectId,
    author: String,
    date: Date,
    body: String,
    upvotes: Number,
    downvotes: Number,
});

let PostSchema = new Schema({
    id:  mongoose.Schema.Types.ObjectId,
    title: String,
    author: String,
    date: { type: Date, default: Date.now()},
    body: String,
    comments: [CommentSchema],
    upvotes: Number,
    downvotes: Number,
});

let PostComment = mongoose.model('PostComment', CommentSchema);
let Post = mongoose.model('Post', PostSchema);



/**** Routes ****/
// get all posts
app.get("/api/posts", (req, res) => {
    Post.find()
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => console.log(err));
});


// get single post by id
app.get("/api/post/:id", (req, res) => {
    const id = req.params;
    Post.findById(id)
        .exec()
        .then(result => {
            if(!result) {
                res.sendStatus(404).send({
                    success: 'false',
                    message: 'No post found',
                });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(err => console.log(err));
    next()
});


// create post
app.post("/api/post", (req, res) => {

    const newPost = new Post({
        //_id: new mongoose.Types.ObjectId(),
        author: req.body.author,
        title: req.body.title,
        body: req.body.body,
        date: req.body.date,
        upvotes: 0,
        downvotes: 0,
    });
    newPost.save()
        .then(result => console.log(result) )
        .catch(err =>
            res.status(500).send({
                success: 'false',
                message: err
            })
        );
    return res.status(201).send({
        success: 'true',
        message: 'Post submitted',
        post: newPost
    });
});


// add comment to post
app.post('/api/post/:id/comment', (req, res) => {
    let comment = new PostComment({
        author: req.body.author,
        body: req.body.body,
        date: req.body.date,
        upvotes: 0,
        downvotes: 0,
    })

    const id = req.params;
    Post.findOneAndUpdate(
        {_id: id},
        { $push: {comments: comment}}

        )
        .then(result => {
            if(!result) {
                res.sendStatus(404).send({
                    success: 'false',
                    message: 'Comment not added',
                });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(err => console.log(err));

});

/**** Reroute all unknown requests to the React index.html ****/
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

/**** Start! ****/
app.listen(port, () => console.log(`${appName} API running on port ${port}!`));




