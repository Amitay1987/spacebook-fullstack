class EventsHandler {
    constructor(postsRepository, postsRenderer) {
        this.postsRepository = postsRepository;
        this.postsRenderer = postsRenderer;
        this.$posts = $(".posts");
    }

    registerAddPost() {
        $('#addpost').on('click', () => {
            let $input = $("#postText");
            if ($input.val() === "") {
                alert("Please enter text!"); 
            } else {
                let current = this;
                current.postsRepository.addPost($input.val())
                    .then(() => {
                            current.postsRenderer.renderPosts(current.postsRepository.posts);
                    }
                    )
                    .catch((err) => {throw err;})

                $input.val("");
            }
            });
    }

    registerRemovePost() {
        this.$posts.on('click', '.remove-post', (event) => {
            let index = $(event.currentTarget).closest('.post').index();
            let postId = $(event.currentTarget).closest('.post').data().id;
            this.postsRepository.removePost(index,postId)
                .then(() => {
                    this.postsRenderer.renderPosts(this.postsRepository.posts);
                })
                .catch((err) => {throw err})
          });

    }

    registerToggleComments() {
        this.$posts.on('click', '.toggle-comments', (event) => {
            let $clickedPost = $(event.currentTarget).closest('.post');
            $clickedPost.find('.comments-container').toggleClass('show');
          });
    }

    registerAddComment() {
        this.$posts.on('click', '.add-comment', (event) => {
            let $comment = $(event.currentTarget).siblings('.comment');
            let $user = $(event.currentTarget).siblings('.name');
          
            if ($comment.val() === "" || $user.val() === "") {
              alert("Please enter your name and a comment!");
              return;
            }
            let postId = $(event.currentTarget).closest('.post').data().id;
            let postIndex = $(event.currentTarget).closest('.post').index();
            let newComment = { text: $comment.val(), user: $user.val() };

            let current = this;
            current.postsRepository.addComment(newComment,postIndex,postId)
                .then(()=> {
                        current.postsRenderer.renderComments(current.postsRepository.posts, postIndex);
                    }
                )
                .catch( (err) => {throw err;})
            $comment.val("");
            $user.val("");
          });

    }

    registerRemoveComment() {
        this.$posts.on('click', '.remove-comment', (event) => {
            let $commentsList = $(event.currentTarget).closest('.post').find('.comments-list');
            let postIndex = $(event.currentTarget).closest('.post').index();
            let commentIndex = $(event.currentTarget).closest('.comment').index()
            let commentId = $(event.currentTarget).closest('li').data().id;
            let postId = $(event.currentTarget).closest('.post').data().id;
            this.postsRepository.deleteComment(postIndex,commentIndex,postId,commentId)
                 .then(() => {
                    this.postsRenderer.renderComments(this.postsRepository.posts, postIndex);
                 })
                 .catch((err) => {throw err;})
        });
    }

}

export default EventsHandler