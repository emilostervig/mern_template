import React, {Component} from 'react';
export default class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            upvote: false,
            downvote: false,
            comment: this.props.comment
        }
        this.upvoteComment = this.upvoteComment.bind(this);
        this.downvoteComment = this.downvoteComment.bind(this);

    }

    upvoteComment(){
        const self = this;
        if(this.state.upvote == true){
            return false;
        }
        fetch(process.env.REACT_APP_API_URL+'/post/'+self.props.pid+'/upvotecomment/'+this.props.comment._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(function(response){
                console.log(response);
                return response.json()
            }).then(function(body){
                if(body.success == 'true'){
                    let upvotes = self.state.comment.upvotes+1
                    let comment = self.state.comment;
                    comment.upvotes = upvotes;
                    self.setState({
                        upvote: true,
                        downvote: false,
                        comment: comment
                    })
                }


        });
    }

    downvoteComment(){
        const self = this;
        if(this.state.downvote == true){
            return false;
        }
        fetch(process.env.REACT_APP_API_URL+'/post/'+self.props.pid+'/downvotecomment/'+this.props.comment._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(function(response){
                console.log(response);
                return response;
            }).then(function(body){
                if(body.success == 'true'){
                    let downvotes = self.state.comment.downvotes+1
                    let comment = self.state.comment;
                    comment.downvotes = downvotes;
                    self.setState({
                        upvote: false,
                        downvote: true,
                        comment: comment
                    })
                }


        });
    }

    render() {
        let upvoteClass = (this.state.upvote === true) ? 'selected' : '';
        let downvoteClass = (this.state.downvote=== true) ? 'selected' : '';
        return (
            <li className="post-comment-item">
                <div className="vote">
                    <span className={"upvote "+upvoteClass} onClick={this.upvoteComment}>+</span>
                    <span className="vote-number">
                        {this.state.comment.upvotes - this.state.comment.downvotes}
                    </span>
                    <span className={"downvote "+downvoteClass} onClick={this.downvoteComment}>-</span>
                </div>
                <div className={"comment-content"}>
                    <div className={"comment-meta"}>
                        <i>By: {this.props.comment.author}</i>
                        <p>Posted: {this.props.formatDate(this.props.comment.date)}</p>
                    </div>
                    <div className={"comment-body"}>
                        <p>{this.props.comment.body}</p>
                    </div>
                </div>
            </li>
        );
    }
}


