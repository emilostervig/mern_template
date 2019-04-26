import React, {Component} from 'react';
import Comment from './Comment';
export default class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props._id,
            title: this.props.title,
            author: this.props.author,
            body: this.props.body,
            date: this.props.date,
            upvotes: this.props.upvotes,
            downvotes: this.props.downvotes,
            comments: this.props.comments,
        }
    }


    render() {
        return (
            <li className="post-item">

                <p>{this.state.title}</p>
                <i>{this.state.author}</i>
                <p>{this.state.date}</p>
                <p>Upvotes: {this.state.upvotes}</p>
                <p>Downvotes: {this.state.downvotes}</p>

                <p>{this.state.body}</p>
                <ul>
                    {this.state.comments.map((item) => (
                        <Comment
                            id={item._id}
                            author={item.author}
                            date={item.date}
                            body={item.body}
                            upvotes={item.upvotes}
                            downvotes={item.downvotes}>
                        </Comment>
                    ))}
                </ul>
            </li>
        );
    }
}


