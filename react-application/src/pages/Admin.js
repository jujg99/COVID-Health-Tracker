import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Card, Col, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import user from '../images/user.png';
import gears from '../images/gears.png';
import virus from '../images/virus.png';

const useFetch = () => {
  const [users, setUsers] = useState(null);
  const [counts, setCounts] = useState(null);
  const [isLoading, setLoading] = useState(true);

  function createUserData(name, username, age, atRisk, city, state) {
    return { name, username, age, atRisk, city, state };
  }

  function setupUsers(users) {
    const arr = [];
    for (let i = 0; i < users.length; i++) {
      arr.push(createUserData(users[i].first_name + ' ' + users[i].last_name, users[i].username, users[i].age, users[i].atRisk, users[i].city, users[i].state));
    }
    setUsers(arr);
  }

  useEffect(async () => {
    const userRes = await fetch('http://localhost:8080/admin/users');
    const userData = await userRes.json();
    setupUsers(userData);

    const countRes = await fetch('http://localhost:8080/admin/counts');
    const countData = await countRes.json();
    setCounts(countData);

    setLoading(false);
  }, []);

  return { users, counts, isLoading };
};

const Admin = () => {
  const { users, counts, isLoading } = useFetch();

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
                      <Card.Title style={{ textAlign: 'center' }}><h4>{counts[0][0].userCount} Total Users</h4></Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ background: 'white', width: '15rem', border: 'none' }}>
                    <Card.Img variant="top" src={gears} />
                    <Card.Body>
                      <Card.Title style={{ textAlign: 'center' }}><h4>{counts[1][0].adminCount} Website Admins</h4></Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ background: 'white', width: '15rem', border: 'none' }}>
                    <Card.Img variant="top" src={virus} />
                    <Card.Body>
                      <Card.Title style={{ textAlign: 'center' }}><h4>{counts[2][0].atRiskCount} At Risk Users</h4></Card.Title>
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

