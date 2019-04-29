import React, {Component} from 'react';
import Post from './Post';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Switch} from "react-router-dom";


class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

        this.state = {
            posts:  []
        };

        this.getPosts = this.getPosts.bind(this);
    }

    componentDidMount() {

    }


    getPosts() {
        console.log(`${this.API_URL}/posts`);
        fetch(`${this.API_URL}/posts`)
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                console.log(data);
                if(data.length > 0){
                    this.setState({
                        posts: data
                    })
                }
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    }

    render() {
        const posts = this.state.posts;
        return (
            <div className="container">
                <h1>MERN Deployment Example</h1>


                <button
                    onClick={this.getPosts}
                    >
                    click me for posts
                </button>
                {posts.map((post) =>
                    <Post
                        id={post._id}
                        author={post.author}
                        title={post.title}
                        body={post.body}
                        date={post.date}
                        comments={post.comments}
                        upvotes={post.upvotes}
                        downvotes={post.downvotes}
                    />
                )}
            </div>
        );
    }
}

export default App;
