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

mongoose.connect('mongodb+srv://emil:emil123@cluster0-pmpbu.mongodb.net/mandatory?retryWrites=true', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected to database!!');
});


var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
let CommentSchema = new Schema({
    _id: {type: mongoose.Schema.ObjectId, auto: true},
    author: String,
    date: Date,
    body: String,
    upvotes: Number,
    downvotes: Number,
});

let PostSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
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
    Post.find().sort({date: -1})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => console.log(err));
});


// get single post by id
app.get("/api/post/:id", (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
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

});


// create post
app.post("/api/post", (req, res) => {

    const newPost = new Post({
        author: req.body.author,
        title: req.body.title,
        body: req.body.body,
        date: req.body.date,
        upvotes: req.body.upvotes,
        downvotes: req.body.downvotes,
    });
    newPost.save()
        .then(result => {
            console.log(result)
            return res.status(201).send({
                success: 'true',
                message: 'Post submitted',
                post: result
            });
        } )
        .catch(err =>
            res.status(500).send({
                success: 'false',
                message: err
            })
        );

});


// add comment to post
app.post('/api/post/:id/comment', (req, res) => {
    let comment = new PostComment({
        author: req.body.author,
        body: req.body.body,
        date: req.body.date,
        upvotes: req.body.upvotes,
        downvotes: req.body.downvotes,
    })
    //const id = mongoose.ObjectId.cast(req.params.id);
    const id = mongoose.Types.ObjectId(req.params.id);
    Post.update(
        {_id: id},
        { $push: {comments: comment}},
        {new: true}
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

// upvote post
app.put('/api/upvotepost/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    Post.findOneAndUpdate(
        {_id: id},
        {$inc: {upvotes: 1}},
        {new: true}
        )
        .then(result => {
            console.log(result)
            return res.status(201).send({
                success: 'true',
                message: 'Post upvoted',
                post: result,
            });
        } )
        .catch(err =>
            res.status(500).send({
                success: 'false',
                message: err
            })
        );



});
// downvote post
app.put('/api/downvotepost/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    Post.findOneAndUpdate(
        {_id: id},
        {$inc: {downvotes: 1}},
        {new: true}
    ).exec()
        .then(result => {
            console.log(result)
            return res.status(201).send({
                success: 'true',
                message: 'Post downvoted',
                post: result,
            });
        } )
        .catch(err =>
            res.status(500).send({
                success: 'false',
                message: err
            })
        );



});

// upvote comment
app.put('/api/post/:pid/upvotecomment/:id', (req, res) => {
    const pid = mongoose.Types.ObjectId(req.params.pid);
    const id = mongoose.Types.ObjectId(req.params.id);
    Post.findOneAndUpdate(
        { "_id": pid, "comments._id": id},
        {
            $inc: {
                "comments.$.upvotes": 1
            }
        },
        function(err,doc) {
            if(err){
                console.log(err)
            } else{
                console.log(doc)
            }
        })
        .then((doc) => {
            res.status(201).send({
                success: 'true',
                message: 'Post upvoted',
                post: doc
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: 'false',
                message: err
            })
        })

});
// downvote comment
app.put('/api/post/:pid/downvotecomment/:id', (req, res) => {
    const pid = mongoose.Types.ObjectId(req.params.pid);
    const id = mongoose.Types.ObjectId(req.params.id);
    Post.findOneAndUpdate(
        { "_id": pid, "comments._id": id},
        {
            $inc: {
                "comments.$.downvotes": 1
            }
        },
        function(err,doc) {
            if(err){
                res.status(500).send({
                    success: 'false',
                    message: err
                })
            } else{
                res.status(201).send({
                    success: 'true',
                    message: 'Post upvoted',
                    post: doc
                });
            }
        })

});


app.get('/api/deleteall', (req, res) => {
    Post.deleteMany({}, (data) => {
        res.status(200).json({msg: data})
    })
});
/**** Reroute all unknown requests to the React index.html ****/
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

/**** Start! ****/
app.listen(port, () => console.log(`${appName} API running on port ${port}!`));




