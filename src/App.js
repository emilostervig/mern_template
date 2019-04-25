import React, {Component} from 'react';

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

        this.state = {
            timer: 5,
            data: "not loaded"
        };

        this.handleCountdown = this.handleCountdown.bind(this);
        this.getData = this.getData.bind(this);
        this.getPosts = this.getPosts.bind(this);
    }

    componentDidMount() {
        setTimeout(this.handleCountdown, 1000);
    }

    handleCountdown() {
        if (this.state.timer > 0)
        {
            this.setState({
                timer: this.state.timer - 1
            });
            setTimeout(this.handleCountdown, 1000);
        } else {
            this.getData();
        }
    }

    getData() {
        fetch(`${this.API_URL}/hello`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data.msg
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    }
    getPosts() {
        fetch(`${this.API_URL}/posts`)
            .then(response => response.json())
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

                <p>Countdown to API call: {this.state.timer}</p>

                <p>Data: {this.state.data}</p>
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
