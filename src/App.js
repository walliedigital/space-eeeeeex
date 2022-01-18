import React, {useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'
import {DateTime} from 'luxon';
import './App.scss';

function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [launches, setLaunches] = useState([]);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        const requestOptions = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                query: {}, options: {
                    "populate": [{
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
                    setLaunches(result.docs);
                }, // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                })
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <Container>
                <Row>
                    <Col>
                        <Table responsive striped  hover>
                            <thead>
                            <tr>
                                <th>Flight</th>
                                <th>Year</th>
                                <th>Name</th>
                                <th>Rocket</th>
                                <th>Details</th>
                                <th>Press Kit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {launches.map(launch => (<tr id={launch.id}>
                                <td><img width="48px" height="48px" src={launch.links.patch.small}/>&nbsp;{launch.flight_number}</td>
                                <td>{DateTime.fromISO(launch.date_utc).get("year")}</td>
                                <td>{launch.name}</td>
                                <td>{launch.rocket.name}</td>
                                <td>{launch.details}</td>
                                <td><a href={launch.links.presskit} target="_blank" rel="noreferrer"
                                       title={launch.name + " press kit"}><i
                                    className="bi bi-file-pdf-fill"></i></a></td>
                            </tr>))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>);
    }
}

export default App;
