var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const SERVER_PORT = 8070;

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/posts', function(req, res){
    Post.find(function (err,posts) {
        if(err) {throw err;}
        else{res.send(posts);}
    })
});

app.post('/posts' , function (req,res) {
    let newPost = {text: req.body.text, comments:[]};
    let post = new Post(newPost);
    post.save(function (err,post) {
        if(err) throw err;
        res.send(post);
    })
})

app.post('/posts/:postId/comments' , (req,res) => {
    let newComment = {text: req.body.text , user: req.body.user};
    Post.findOne({_id: req.params.postId}, function (err, post) {ז
        if(err) throw err;
        post.comments = post.comments.concat(newComment);
        post.save(function (err,post) {
            if(err) throw err;
            res.send(post.comments.pop());
        });
    });

})

app.delete('/posts/:postId/' , (req,res) =>{
    let id = req.params.postId;
    Post.findByIdAndRemove({_id : id} , function (err,post) {
        if(err) {throw err};
        res.send(post);
    })
})

app.delete('/posts/:postId/:commentId/' , (req,res) => {
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    Post.update({_id: postId} , {$pull: {comments: {_id: commentId}}} , function (err,updatePost) {
        if(err){throw err};
        res.send(updatePost);
    })
})

// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(SERVER_PORT, () => {
  console.log("Server started on port " + SERVER_PORT);
});
