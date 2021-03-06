import React from 'react';
import Highlighter from 'react-highlight-words';
import { useMediaQuery } from 'react-responsive'

function ListItem(props) {
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
    const titleContainerClassList = isMobile ? 'task-title-container mobile-list-bg' : 'task-title-container';

    function handleChange(e) {
        e.stopPropagation();
        // console.log(`handleChange()`);
        let newItem = {
            userId: props.i.userId,
            id: props.i.id,
            title: props.i.title,
            completed: !props.i.completed
        };
        props.updateTask(newItem);
    }

    function toggleModal() {
        props.toggleModal(props.i);
    }

    return (
        <li key={props.i.id} onClick={toggleModal} className="list-item">
            <div className="task-checkbox-container">
                <input type="checkbox" checked={props.i.completed} onClick={handleChange} />
            </div>
            <div className={titleContainerClassList}>
                <Highlighter
                    highlightClassName="matched-text"
                    searchWords={[props.searchText]}
                    textToHighlight={props.i.title}
                />
            </div>
        </li>
    );
}

export default ListItem;