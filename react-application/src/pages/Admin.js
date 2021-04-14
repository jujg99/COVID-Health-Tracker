import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Card, Col, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import user from '../images/user.png';
import gears from '../images/gears.png';
import virus from '../images/virus.png';

const useFetch = url => {
  const [users, setUsers] = useState(null);
  const [isLoading, setLoading] = useState(true);

  function createData(name, username, age, atRisk, city, state) {
    return { name, username, age, atRisk, city, state };
  }

  useEffect(async () => {
    const response = await fetch(url);
    const data = await response.json();
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(createData(data[i].first_name + ' ' + data[i].last_name, data[i].username, data[i].age, data[i].atRisk, data[i].city, data[i].state));
    }
    setUsers(arr);
    setLoading(false);
  }, []);

  return { users, isLoading };
};

const Admin = () => {
  const { users, isLoading } = useFetch('http://localhost:8080/admin/users');

  return (
    <>
      {isLoading ? <div>Loading...</div> :
        <div style={{ backgroundColor: '#408cb3', height: '100vh' }}>
          <Jumbotron fluid style={{ background: 'white' }}>
            <Container>
              <Row>
                <Col>
                  <Card style={{ background: 'white', width: '15rem', border: 'none' }}>
                    <Card.Img variant="top" src={user} />
                    <Card.Body>
                      <Card.Title style={{textAlign: 'center'}}><h4># Users</h4></Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ background: 'white', width: '15rem', border: 'none' }}>
                    <Card.Img variant="top" src={gears} />
                    <Card.Body>
                      <Card.Title style={{textAlign: 'center'}}><h4># Admins</h4></Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ background: 'white', width: '15rem', border: 'none' }}>
                    <Card.Img variant="top" src={virus} />
                    <Card.Body>
                      <Card.Title style={{textAlign: 'center'}}><h4># At Risk</h4></Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Jumbotron>
          <Container>
            <Row style={{ paddingTop: '50px' }}>
              <Col>
                <Card border="dark" style={{ width: '18rem', padding: '20px' }}>
                  <Card.Body>
                    <Link to={{ pathname: '/admin/users', state: users, }}><h5>User List</h5></Link>
                    <Card.Text>View and manage all Covid Health Tracker users.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card border="dark" style={{ width: '18rem', padding: '20px' }}>
                  <Card.Body>
                    <Link to={{ pathname: '/admin/tickets' }}><h5>Tickets</h5></Link>
                    <Card.Text>View, manage, and respond to user tickets.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      }
    </>
  );
}

export default Admin;

