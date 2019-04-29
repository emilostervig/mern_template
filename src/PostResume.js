import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class PostResume extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post,
            _id: this.props._id,
            upvote: false,
            downvote: false,
        }
        this.handleDownvote = this.handleDownvote.bind(this);
        this.handleUpvote = this.handleUpvote.bind(this);
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
        return (
            <li className="post-item">
                <div class="vote">
                    <span class="upvote" onClick={this.handleUpvote}>+</span>
                    <span class="vote-number">
                        {this.state.post.upvotes - this.state.post.downvotes}
                    </span>
                    <span class="downvote" onClick={this.handleDownvote}>-</span>
                </div>
                <div className={"post-wrap"}>
                    <div className={"post-heading"}>
                        <Link to={"/questions/"+this.state.post._id}>
                            <h3>{this.state.post.title}</h3>
                        </Link>
                    </div>
                    <div className={"meta-info"}>
                        <i className={"author"}>
                            By: {this.state.post.author}
                        </i>
                        <span className={"date"}>
                            Posted: {this.props.formatDate(this.state.post.date)}
                        </span>
                    </div>
                    <span className={"read-more"}>
                        <Link to={"/questions/"+this.state.post._id}>Read more</Link>
                    </span>
                </div>

            </li>
        )
    }
}


