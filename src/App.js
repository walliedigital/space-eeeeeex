import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'
import {Button} from "react-bootstrap";
import {DateTime} from 'luxon';
import SortableTableHeader from './SortableTableHeader';
import './App.scss';


function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("flight_number");
    const [sortAsc, setSortAsc] = useState(true);
    const [launches, setLaunches] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);


    const handleNextClick = () => setPage(page + 1);
    const handlePrevClick = () => setPage(page - 1);
    const handleSortClick = (e) => {
        if (e != sort) {
            // Change sorting to this column
            setSort(e);
            setPage(1);
        } else {
            // Change sort order
            setSortAsc(!sortAsc);
        }
    }

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        const requestOptions = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                query: {}, options: {
                    "page": page, "sort": sortAsc ? sort : "-" + sort, "populate": [{
                        "path": "rocket", "select": {
                            "name": 1
                        }
                    }]
                }
            })
        };
        fetch("https://api.spacexdata.com/v5/launches/query", requestOptions)
            .then(res => res.json())
            .then((result) => {
                    setIsLoaded(true);
                    setHasNext(result.hasNextPage);
                    setHasPrev(result.hasPrevPage);
                    setTotalPages(result.totalPages);
                    setLaunches(result.docs);
                }, // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                })
    }, [page, sortAsc])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (<Container>
            <Row>
                <Col className={"spx-page-title"}>SpaceX Launches</Col>
            </Row>
            <Row>
                <Col>
                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th></th>
                            <SortableTableHeader displayName={"Flight"} sortName={"flight_number"} sortType={"numeric"}
                                                 sort={sort} sortAsc={sortAsc} handleSortClick={handleSortClick}/>
                            <SortableTableHeader displayName={"Year"} sortName={"date_utc"} sortType={"numeric"}
                                                 sort={sort} sortAsc={sortAsc} handleSortClick={handleSortClick}/>
                            <SortableTableHeader displayName={"Name"} sortName={"name"} sortType={"alpha"} sort={sort}
                                                 sortAsc={sortAsc} handleSortClick={handleSortClick}/>
                            <SortableTableHeader displayName={"Rocket"} sortName={"rocket.name"} sortType={"alpha"}
                                                 sort={sort} sortAsc={sortAsc} handleSortClick={handleSortClick}/>
                            <th>Details</th>
                            <th>Press Kit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {launches.map(launch => (<tr id={launch.id}>
                            <td>{launch.links.patch.small != undefined ?
                                <img width="48px" height="48px" src={launch.links.patch.small}/> : ""}</td>
                            <td>{launch.flight_number}</td>
                            <td>{DateTime.fromISO(launch.date_utc).get("year")}</td>
                            <td>{launch.name}</td>
                            <td>{launch.rocket.name}</td>
                            <td>{launch.details}</td>
                            <td>{launch.links.presskit != undefined ?
                                <a href={launch.links.presskit} target="_blank" rel="noreferrer"
                                   title={launch.name + " press kit"}><i
                                    className="bi bi-file-pdf-fill"></i></a> : ""}</td>
                        </tr>))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className={"justify-content-md-center"}>
                <Col md="auto">{hasPrev ? <Button variant={"primary"} onClick={handlePrevClick}><i
                    className="bi bi-dash"></i> Previous</Button> : <Button variant={"primary"} disabled><i
                    className="bi bi-dash"></i> Previous</Button>}</Col>
                <Col md="auto">{page} / {totalPages}</Col>
                <Col md="auto">{hasNext ?
                    <Button variant={"primary"} onClick={handleNextClick}><i className="bi bi-plus"></i> Next</Button> :
                    <Button variant={"primary"} disabled><i
                        className="bi bi-plus"></i> Next</Button>}</Col>
            </Row>
            <Row className={"justify-content-md-center spx-page-footer"}>
                <Col><p className={"text-muted"}>We are not affiliated, associated, authorized, endorsed by, or in any
                    way officially connected with Space Exploration Technologies Corp (SpaceX), or any of its
                    subsidiaries or its affiliates. The names SpaceX as well as related names, marks, emblems and images
                    are registered trademarks of their respective owners.</p></Col>
            </Row>
        </Container>);
    }
}

export default App;
