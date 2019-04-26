import React, {Component} from 'react';

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
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    }

    render() {
        return (
            <div className="container">
                <h1>MERN Deployment Example</h1>


                <button
                    onClick={this.getPosts}
                    >
                    click me for posts
                </button>
            </div>
        );
    }
}

export default App;
