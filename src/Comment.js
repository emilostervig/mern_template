import React, {Component} from 'react';
export default class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props._id,
            author: this.props.author,
            body: this.props.body,
            date: this.props.date,
            upvotes: this.props.upvotes,
            downvotes: this.props.downvotes,
        }
    }


    render() {
        return (
            <li className="post-comment-item">

                <i>{this.state.author}</i>
                <p>{this.state.date}</p>
                <p>Upvotes: {this.state.upvotes}</p>
                <p>Downvotes: {this.state.downvotes}</p>

                <p>{this.state.body}</p>
            </li>
        );
    }
}


