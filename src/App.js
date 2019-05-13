// Components
import React, {Component} from 'react';
import Post from './Post';
import PostResume from './PostResume';
import PostForm from './PostForm';

// Packages
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Switch} from "react-router-dom";
import io from "socket.io-client";



// styles
import "./styles.scss";

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    SOCKET_URL = 'http://localhost:8080/my_app';

    constructor(props) {
        super(props);

        this.state = {
            posts:  [],
            post: {},
        };

        this.getPosts = this.getPosts.bind(this);
        this.getPostById = this.getPostById.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.upvotePost = this.upvotePost.bind(this);
        this.downvotePost = this.downvotePost.bind(this);
        this.addPost = this.addPost.bind(this);
    }

    componentDidMount() {
        const self = this;
        this.getPosts();


        const socket = io(this.SOCKET_URL);
        socket.on('connect', () => {
            console.log('connected to socket.io!');
            socket.emit('hello', "Emil", "howdy!");
        });
        socket.on('new-data', (data) => {
            console.log(`server msg: ${data.msg}`);
            self.getPosts();
        })
    }

    getPostById(id) {

        return fetch(`${this.API_URL}/post/${id}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                if(data.length > 0){
                    this.setState({
                        post: data
                    })
                }
                return data;
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })

    }

    upvotePost(id){
        const self = this;

        return fetch(process.env.REACT_APP_API_URL+'/upvotepost/'+id, {
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
                    return body
                }


            });
    }

    downvotePost(id) {
        const self = this;

        return fetch(process.env.REACT_APP_API_URL+'/downvotepost/'+id, {
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

                return body
            }


        });
    }

    addPost(post){
        const self = this;

        return fetch(process.env.REACT_APP_API_URL+'/post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify({
                title: post.title,
                author: post.author,
                body: post.body,
                date: post.date,
                upvotes: post.upvotes,
                downvotes: post.downvotes
            })
        })
        .then(function(response){
            return response.json()
        }).then(function(body){
            if(body.success == 'true'){
                console.log(body);
                return body.post;
            }
        });
    }
    getPosts() {
        fetch(`${this.API_URL}/posts`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                if(data.length > 0){
                    console.log(data);
                    this.setState({
                        posts: data
                    })
                }
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    }
    formatDate(date) {
        if(date instanceof Date === false){
            date = new Date(date);
        }

        let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

        let d = date.getDate();
        let m = months[date.getMonth()];
        let y = date.getFullYear();
        let h = date.getHours();
        let min = date.getMinutes();

        if(h < 10){
            h = '0'+h;
        }
        if(min < 10){
            min = '0'+min;
        }
        return `${d}. ${m} ${y} at ${h}:${min}`;
    }
    render() {
        let posts = this.state.posts;
        return (
            <main>
                <Router>
                    <div className={"container"}>
                    <nav className="main-nav">

                        <ul>
                            <li>
                                <Link to={"/"}>Home</Link>
                            </li>
                            <li>
                                <Link to={"/question"}>Ask a question</Link>
                            </li>
                        </ul>

                    </nav>
                    </div>
                    <div className={"container"} id={"main-content"}>
                        <Switch>

                            <Route exact path="/" render={() =>
                                <React.Fragment>
                                <h1>Latest questions</h1>
                                <ul className={"post-list"}>
                                    {this.state.posts.map((post) =>
                                        <PostResume
                                            post={post}
                                            upvotePost={this.upvotePost}
                                            downvotePost={this.downvotePost}
                                            formatDate={this.formatDate}
                                        />
                                    )}
                                </ul>
                                </React.Fragment>
                            }/>
                            // route for single question page
                            <Route exact path="/questions/:id" render={(props) =>
                                <React.Fragment>
                                    <Post
                                        id={props.match.params.id}
                                        getPostById={this.getPostById}
                                        formatDate={this.formatDate}
                                        upvotePost={this.upvotePost}
                                        downvotePost={this.downvotePost}
                                    />
                                </React.Fragment>

                            }/>

                            <Route exact path={"/question"} render={(props) =>
                                <React.Fragment>
                                    <PostForm
                                        addPost={this.addPost}
                                    />
                                </React.Fragment>
                            }/>
                        </Switch>
                    </div>

                </Router>
            </main>

        );
    }
}

export default App;
