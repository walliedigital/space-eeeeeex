import React, {useEffect, useState} from 'react';
import './App.scss';

function SortableTableHeader(props) {

    if (props.sort == props.sortName) {
        return (<th onClick={() => props.handleSortClick(props.sortName)}>{props.displayName} < i
            className={props.sortAsc ? "bi bi-sort-" + props.sortType + "-up" : "bi bi-sort-" + props.sortType + "-down"}> < /i>
        </th>);
    } else {
        return (<th onClick={() => props.handleSortClick(props.sortName)}>{props.displayName}</th>);
    }
}

export default SortableTableHeader;

