import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import InfiniteScroll from 'react-infinite-scroll-component';
import MediaQuery from 'react-responsive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faYinYang, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import './styles/main.scss';

// components
import ListItem from './components/ListItem';

Modal.setAppElement('#app');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getMoreLimit: 10, // number of additional todos to fetch on
            initialLimit: 50, // number of todos to query on the first fetch
            infiniteWalkStart: 50, // incremented with function getMoreData()
            moreDataExists: true,
            todos: [], // this is the only dataset that should be passed to components to be viewed
            todosCached: [], // this dataset should only be changed (appended to) by additional GET requests
            todosMutated: [], // a copy of state.todos used to compare a string search against already sorted data
            isTaskSorted: {sorted: false, ascending: false},
            isDonenessSorted: {sorted: false, ascending: false},
            isTextSearched: {searched: false, text: ''},
            modalIsOpen: false,
            modalTask: {}, // an object from inside the state.todos array
            resetIsHovered: false
        }

        this.updateTask = this.updateTask.bind(this);

        this.handleTaskSort = this.handleTaskSort.bind(this);
        this.handleDonenessSort = this.handleDonenessSort.bind(this);
        this.resetSort = this.resetSort.bind(this);
        this.handleTextSearch = this.handleTextSearch.bind(this);

        this.toggleModal = this.toggleModal.bind(this);
        
        this.toggleResetHover = this.toggleResetHover.bind(this);
    }
    
    toggleResetHover() {
        this.setState({resetIsHovered: !this.state.resetIsHovered});
    }

    toggleModal(item) {
        console.log(`toggle modal`);
        if (!this.state.modalIsOpen) {
            document.body.classList.add('fixed');
            document.documentElement.classList.add('fixed-body');

        } else {
            document.body.classList.remove('fixed');
            document.documentElement.classList.remove('fixed-body');
        }
        this.setState({modalTask: item})
        this.setState({modalIsOpen: !this.state.modalIsOpen});
    }

    async handleTextSearch(e) {
        console.log(`handleTextSearch()`);
        let searchSubstr = e.target.value;
        
        let results = this.state.todosMutated.filter((item) => {
            let insensitiveSearchSubstr = searchSubstr.toLowerCase();
            let insensitiveItem = item.title.toLowerCase();

            let checkMatch = insensitiveItem.indexOf(insensitiveSearchSubstr);

            if (checkMatch != -1) {
                return item;
            }
        });

        console.log(results);
        this.setState({todos: results});
        this.setState({isTextSearched: {searched: true, text: searchSubstr}});
    }

    async resetSort() {
        console.log(`reset from cache*************************************`)
        console.log(this.state.todos)
        console.log(this.state.todosCached)
        console.log(`*************************************`)
        this.setState({todos: this.state.todosCached});
        this.setState({isDonenessSorted: {sorted: false, ascending: false}});
        this.setState({isTaskSorted: {sorted: false, ascending: false}});
        this.setState({isTextSearched: {searched: false, text: ''}});
    }

    async removeSort() {
        this.setState({isDonenessSorted: {sorted: false, ascending: false}});
        this.setState({isTaskSorted: {sorted: false, ascending: false}});
    }

    // **************************************************************************
    // sorting functions should be able to be combined into one abstract function
    // come back to this if there is time
    // **************************************************************************
    // async handleSort() {
    //     console.log(`handleSort()`);
    // }

    async handleDonenessSort() {
        console.log(`handleDonenessSort()`);
        if (!this.state.isDonenessSorted.sorted) {
            console.log(`First 'if' triggered, sorting unsorted array`);
            
            let tempTodosArr = [...this.state.todos];
            
            tempTodosArr.sort((a, b) => Number(a.completed) - Number(b.completed));

            console.log(`After sort, compare temp array to state:`);
            console.log(tempTodosArr);
            console.log(this.state.todos);
            this.setState({todos: tempTodosArr});
            this.setState({todosMutated: tempTodosArr});
            this.setState({isDonenessSorted: {sorted: true, ascending: true}});
        } else {
            console.log(`'else' triggered, reversing sorted array`);
            let tempTodosArr = [...this.state.todos];
            tempTodosArr.reverse();
            this.setState({todos: tempTodosArr});
            this.setState({todosMutated: tempTodosArr});
            this.setState({isDonenessSorted: {sorted: true, ascending: !this.state.isDonenessSorted.ascending}});
        }
    }

    async handleTaskSort() {
        console.log(`handleTaskSort()`);
        if (!this.state.isTaskSorted.sorted) {
            console.log(`First 'if' triggered, sorting unsorted array`);
            
            let tempTodosArr = [...this.state.todos];
            
            tempTodosArr.sort((a, b) => {
                let insensitiveA = a.title.toLowerCase(),
                    insensitiveB = b.title.toLowerCase();
    
                if (insensitiveA < insensitiveB) {
                    return -1;
                } else if (insensitiveA > insensitiveB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            console.log(`After sort, compare temp array to state:`);
            console.log(tempTodosArr);
            console.log(this.state);
            this.setState({todos: tempTodosArr});
            this.setState({todosMutated: tempTodosArr});
            this.setState({isTaskSorted: {sorted: true, ascending: true}});
        } else {
            console.log(`'else' triggered, reversing sorted array`);
            let tempTodosArr = [...this.state.todos];
            tempTodosArr.reverse();
            this.setState({todos: tempTodosArr});
            this.setState({todosMutated: tempTodosArr});
            this.setState({isTaskSorted: {sorted: true, ascending: !this.state.isTaskSorted.ascending}});
        }
        
    }

    async updateTask(task) {
        console.log(`updateTask()`);
        console.log(task);
        let tempTodos = [...this.state.todos];

        tempTodos = tempTodos.map(t => {
            console.log(`iterating over temp array`)
            if (t.id == task.id) {
                console.log(`found match, updating`);
                return task;
            }
            return t;
        });

        console.log(`updating state from temp:`)
        console.log(tempTodos)
        this.setState({todos: tempTodos});
    }

    setNextPagination = () => {
        let newStart = this.state.infiniteWalkStart += this.state.getMoreLimit;
        this.setState({infiniteWalkStart: newStart});
    }

    getMoreData = async () => {
        console.log(`getMoreData()`);
        let res = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${this.state.infiniteWalkStart}&_limit=${this.state.getMoreLimit}`);
        let json = await res.json();
        console.log(`new json:`)
        console.log(json);

        if (json.length > 0) {
            const newTodos = [...this.state.todos];
            const newTodosCached = [...this.state.todosCached];
            const newTodosMutated = [...this.state.todosMutated];
    
            json.forEach(o => {
                newTodos.push(o);
                newTodosCached.push(o);
                newTodosMutated.push(o);
            });
    
            this.setState({todos: newTodos});
            this.setState({todosCached: newTodosCached});
            this.setState({todosMutated: newTodosMutated});
            this.setState({isTaskSorted: {sorted: false, ascending: this.state.isTaskSorted.ascending}});
            this.setState({isDonenessSorted: {sorted: false, ascending: this.state.isDonenessSorted.ascending}});
            this.setState({isTextSearched: {searched: false, text: ''}});

            this.setNextPagination();
        } else {
            this.setState({moreDataExists: false});
        }
    }

    async getData() {
        console.log(`getData()`);
        let res = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=0&_limit=${this.state.initialLimit}`);
        let json = await res.json();
        this.setState({todosCached: json});
        return json;
    }

    async componentDidMount() {
        console.log(`componentDidMount()`);
        const todos = await this.getData();
        this.setState({todos: todos});
        this.setState({todosMutated: todos});
    }

    render() {
        console.log(`\n\n******************** state change ********************`);
        console.log(this.state);
        console.log(`******************************************************`);

        const listItems = this.state.todos.map((i) => {
            return <ListItem key={i.id} i={i} searchText={this.state.isTextSearched.text} updateTask={this.updateTask} toggleModal={this.toggleModal} />
        });

        const resetButton = this.state.resetIsHovered ?
            <button id="reset" onMouseEnter={this.toggleResetHover} onMouseLeave={this.toggleResetHover} onClick={this.resetSort}>
                <FontAwesomeIcon icon={faArrowRotateRight} className="rotating" />
            </button> :
            <button id="reset" onMouseEnter={this.toggleResetHover} onMouseLeave={this.toggleResetHover} onClick={this.resetSort}>
                <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>;

        const mobileResetButton = <button id="reset" onClick={this.resetSort}><FontAwesomeIcon icon={faArrowRotateRight} /></button>;

        return (
            <div className="flex-column align-items-center container">
                <a id="github-link" style={{display: "table-cell"}} href="https://github.com/zach-long/react-to-do-list" target="_blank"><FontAwesomeIcon icon={faGithub} /></a>
                <h1 class="title">Things to be done</h1>
                <h4 class="subtitle">While we wait for life, life passes.</h4>
                <div id="sort-control-box" className="flex-row justify-content-space-between">
                    <input id="text-search" placeholder="What are you searching for?" value={this.state.isTextSearched.text} onChange={this.handleTextSearch} />
                    {/* render reset button with hover & rotate animations */}
                    <MediaQuery minWidth={1024}>
                        {resetButton}
                    </MediaQuery>
                    {/* render reset button that will respond properly to touch */}
                    <MediaQuery maxWidth={1023}>
                        {mobileResetButton}
                    </MediaQuery>
                </div>
                {this.state.todosCached.length > 0 ?
                    <div id="todo-list-container">
                        {this.state.todos.length < 1 ?
                            <div className="no-results">
                                <h3>You did not find what you were searching for.</h3>
                            </div>
                        :
                            <ul>
                                <li>
                                    <div className="task-checkbox-container sort-control" onClick={this.handleDonenessSort}>
                                        {this.state.isDonenessSorted.ascending ?
                                            <FontAwesomeIcon icon={faAngleDown} flip="vertical" /> :
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        }                                    
                                    </div>
                                    <div className="task-title-container sort-control" onClick={this.handleTaskSort}>
                                        {this.state.isTaskSorted.ascending ?
                                            <FontAwesomeIcon icon={faAngleDown} flip="vertical" /> :
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        }
                                    </div>
                                </li>
                                <InfiniteScroll
                                    dataLength={this.state.todos.length}
                                    next={this.getMoreData}
                                    hasMore={this.state.moreDataExists}
                                    style={{display: 'flex', flexDirection: 'column'}}
                                    loader={<div className="loading-more"><FontAwesomeIcon icon={faYinYang} spin /></div>}
                                    endMessage={<div className="finished-scrolling"><h3>That's all, for now...</h3></div>}
                                >
                                    {listItems}
                                </InfiniteScroll>
                            </ul>
                        }
                        
                    </div>
                :
                    <div className="loading">
                        <FontAwesomeIcon icon={faYinYang} spin />
                    </div>
                 }
                
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.toggleModal}
                    className="Modal"
                    overlayClassName="Modal-overlay"
                    closeTimeoutMS={100}
                >
                    <p><b>Task ID:</b> {this.state.modalTask.id}</p>
                    <p><b>Title:</b> {this.state.modalTask.title}</p>
                    <p><b>Completed:</b> {this.state.modalTask.completed ? `yes` : `no`}</p>
                </Modal>
            </div>
        );
    }
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
