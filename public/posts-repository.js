/**
 * @class Responsible for storing and manipulating Spacebook posts, in-memory
 */
class PostsRepository {
    constructor() {
        this.posts = [];
    }

    addPost(postText) {
        let current = this;
        return current._ajaxAddPost(postText)
            .then(function (postAdd) {
                current.posts.push(postAdd)
            })
            .catch(function (err) {
                throw err;
            })
    }

    removePost(index,postID) {
        let current = this;
        return current._ajaxDeletePost(postID)
            .then(() => {
                current.posts.splice(index, 1);
            })
            .catch((err) => {
                throw err;
            })

    }

    addComment(newComment, postIndex ,postId) {
        let current = this;
        return current._ajaxAddComment(postId,newComment)
            .then( (comment) => {
                current.posts[postIndex].comments.push(comment);
            })
            .catch((err) => {
                throw err;
            })
    };

    deleteComment(postIndex, commentIndex,postId,commentId) {
        this.deleteComment = this.deleteComment.bind(this);
        //let current = this;
        return this._ajaxDeleteComment(postId,commentId)
            .then(() => {
                this.posts[postIndex].comments.splice(commentIndex, 1);
            })
            .catch( (err) => {
                throw err;
            })

    };

    getFromDataBase() {
        return this._ajaxGetAllData();
    }

    _ajaxGetAllData(){
         return $.ajax({url: '/posts', method: 'GET'});
    }

    _ajaxAddPost(post){
       return $.ajax({
            type:'POST',
            url:'/posts',
            data: {text : post}
        });
    }

    _ajaxAddComment(postId,comment){
        return $.ajax({
            type:'POST',
            url:'/posts/' + postId +'/comments',
            data: comment
        });
    }

    _ajaxDeletePost(postID){
        return $.ajax({
            type:'DELETE',
            url:'/posts/' + postID
        })
    }
    _ajaxDeleteComment(postId,commentId){
        return $.ajax({
            type:'DELETE',
            url:'/posts/' + postId + '/' + commentId + '/'
        })
    }


}

export default PostsRepository