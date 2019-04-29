import React, {Component} from 'react';
import { Redirect }  from "react-router-dom";

export default class PostForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shouldRedirect: false,
            redirectId: '',
            author: "",
            title: "",
            body: "",
            upvotes: 0,
            downvotes: 0,
            date: new Date()

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
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
        let self = this;
        e.preventDefault();
        const post = {};
        post.title = this.state.title;
        post.author = this.state.author;
        post.body = this.state.body;
        post.upvotes = this.state.upvotes;
        post.downvotes = this.state.downvotes;
        post.date = new Date();
        this.props.addPost(post).then((response) => {
            console.log(response)
            let id = response._id;
            self.setState({
                shouldRedirect: true,
                redirectId: id,
            })


        })
    }

    render() {
        if(this.state.shouldRedirect === true){
            return <Redirect to={"/questions/"+this.state.redirectId} push />
        }
        return (
            <form className={"post-form"} onSubmit={this.onFormSubmit}>
                <input type={"text"} name={"title"} onChange={this.handleInputChange} placeholder={"Your question"}/>
                <input type={"text"} name={"author"} onChange={this.handleInputChange} placeholder={"Your name"}/>
                <textarea name={"body"} onChange={this.handleInputChange} placeholder={"Your comment"}/>
                <input type={"submit"} value={"submit"}/>
            </form>
        );
    }
}


