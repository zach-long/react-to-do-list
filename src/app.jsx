import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// include css for webpack inline bundle
// import '../scss/main.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    getData = () => {
        console.log(`getData()`);
        // fetch('data/data.json', {
        // }).then((response) => {
        //     this.setState({
        //         categories: ctgJsonArr[0],
        //         itemList: ctgJsonArr[1].data,
        //         sortedList: ctgJsonArr[1].data,
        //         displayList: ctgJsonArr[1].data
        //     });
        // });
    }

    componentDidMount() {
        console.log(`componentDidMount()`);
        this.getData();
    }

    render() {
        return (
            <div id="app-container">
                Test React App
            </div>
            
        );
    }
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
