import React, {Component} from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
export default class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {
                _id: '',
                comments: []

            },
            upvote: false,
            downvote: false

        }
        this.submitComment = this.submitComment.bind(this);
        this.handleUpvote = this.handleUpvote.bind(this);
        this.handleDownvote = this.handleDownvote.bind(this);

    }

    componentWillMount() {
        this.props.getPostById(this.props.id)
            .then((data) => {
                data.comments.sort(function(a,b){
                    let c = new Date(a.date);
                    let d = new Date(b.date);
                    return c-d;
                });
                this.setState({post: data})

            })
    }

    submitComment(comment){
        const self = this;
        fetch(process.env.REACT_APP_API_URL+'/post/'+self.state.post._id+'/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify({
                author: comment.author,
                body: comment.body,
                date: comment.date,
                upvotes: comment.upvotes,
                downvotes: comment.downvotes
            })

        })
            .then(function(response){
                console.log(response);
                return response.json()
            }).then(function(body){
                console.log(body);
                let joined = self.state.post;
                joined = joined.comments.push(comment);
                let newPost = self.state.post;
                newPost.comments = joined;
                self.setState({ post: body.data})
                return true;
            });


    }

    handleDownvote() {
        let self = this;
        if(this.state.downvote === true){
            return false;
        }
        this.props.downvotePost(this.state.post._id)
            .then((data) => {
                if(data.success === 'true'){
                    self.setState({
                        upvote: false,
                        downvote: true,
                        post: data.post,
                    })
                }
            });
    }

    handleUpvote() {
        let self = this;
        if(this.state.upvote === true){
            return false;
        }
        this.props.upvotePost(this.state.post._id)
            .then((data) => {
                console.log(data);
                if(data.success === 'true'){
                    self.setState({
                        upvote: true,
                        downvote: false,
                        post: data.post,
                    })
                }
            });
    }


    render() {
        const comments = this.state.post.comments;
        return (
            <div className="full-post-item">
                <div className={"flex-wrap"}>
                    <div className="vote">
                        <span className="upvote" onClick={this.handleUpvote}>+</span>
                        <span className="vote-number">
                            {this.state.post.upvotes - this.state.post.downvotes}
                        </span>
                        <span className="downvote" onClick={this.handleDownvote}>-</span>
                    </div>
                    <div className="post-content-wrap">

                        <h1>{this.state.post.title}</h1>
                        <i className={"author"}>By: {this.state.post.author}</i>
                        <p>Posted: {this.props.formatDate(this.state.post.date)}</p>
                        <p>{this.state.post.body}</p>

                    </div>
                </div>

                <ul className={"comments"}>
                    {comments.map((el) =>
                        <React.Fragment>
                            <Comment
                                comment={el}
                                pid={this.state.post._id}
                                formatDate={this.props.formatDate}
                            />
                        </React.Fragment>
                    )}
                </ul>
                <h3>Post an answer</h3>
                <CommentForm submitComment={this.submitComment}/>

            </div>
        );
    }
}


