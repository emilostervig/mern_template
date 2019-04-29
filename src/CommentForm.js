import React, {Component} from 'react';
export default class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            author: "",
            body: "",
            upvotes: 0,
            downvotes: 0,
            date: new Date()

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    onFormSubmit(e){
        e.preventDefault();
        const comment = {};

        comment.author = this.state.author;
        comment.body = this.state.body;
        comment.upvotes = this.state.upvotes;
        comment.downvotes = this.state.downvotes;
        comment.date = new Date();
        this.props.submitComment(comment)
        this.setState({
            author: "",
            body: "",
            upvotes: 0,
            downvotes: 0,
            date: new Date(),
        })
    }

    render() {
        return (
            <form className={"comment-form"} onSubmit={this.onFormSubmit}>
                <input type={"text"} name={"author"} onChange={this.handleInputChange} placeholder={"Your name"} value={this.state.author}/>
                <textarea name={"body"} onChange={this.handleInputChange} placeholder={"Your comment"} value={this.state.body}/>
                <input type={"submit"} value={"submit"}/>
            </form>
        );
    }
}


