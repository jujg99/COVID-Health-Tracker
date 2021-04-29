import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Card, Col, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import user from '../images/user.png';
import gears from '../images/gears.png';
import virus from '../images/virus.png';

// Custom useFetch hook to call APIs needed for admin pages
const useFetch = () => {
  const [users, setUsers] = useState(null);
  const [counts, setCounts] = useState(null);
  const [pendingTickets, setPendingTickets] = useState(null);
  const [answeredTickets, setAnsweredTickets] = useState(null);
  const [isLoading, setLoading] = useState(true);

  function createUserData(name, username, age, atRisk, city, state) {
    return { name, username, age, atRisk, city, state };
  }

  function createTicketData(username, ticketId, date, question, answer) {
    return { username, ticketId, date, question, answer };
  }

  // Formats JSON data to users object
  function setupUsers(users) {
    const arr = [];
    for (let i = 0; i < users.length; i++) {
      arr.push(createUserData(users[i].first_name + ' ' + users[i].last_name, users[i].username, users[i].age, users[i].atRisk, users[i].city, users[i].state));
    }
    setUsers(arr);
  }

  // Formats JSON data to tickets object
  function setupTickets(tickets, answered) {
    const arr = [];
    for(let i = 0; i < tickets.length; i++) {
      arr.push(createTicketData(tickets[i].username, tickets[i].ticket_id, tickets[i].date, tickets[i].question, tickets[i].answer));
    }

    if (answered) {
      setAnsweredTickets(arr);
    } else {
      setPendingTickets(arr);
    }
  }

  // On page render, call all APIs to retrieve all data
  useEffect(() => {
    async function fetchData() {
      const userRes = await fetch('http://localhost:8080/admin/users');
      const userData = await userRes.json();
      setupUsers(userData);

      const countRes = await fetch('http://localhost:8080/admin/counts');
      const countData = await countRes.json();
      setCounts(countData);

      const pendingRes = await fetch('http://localhost:8080/admin/tickets/pending')
      const pendingData = await pendingRes.json();
      setupTickets(pendingData, false);

      const answeredRes = await fetch('http://localhost:8080/admin/tickets/answered')
      const answeredData = await answeredRes.json();
      setupTickets(answeredData, true);

      // After all API calls, setLoading to false to fully load page
      setLoading(false);
    }
    fetchData();
  }, []);

  return { users, counts, pendingTickets, answeredTickets, isLoading };
};

const Admin = () => {
  const { users, counts, pendingTickets, answeredTickets, isLoading } = useFetch();

  // Displays counts (# of users, # of admins, # of atRisk users) in jumbotron
  // Displays two boxes that links to Users page and Tickets page
  return (
    <>
      {isLoading ? <div>Loading...</div> :
        <div style={{ backgroundColor: '#408cb3', height: '120vh' }}>
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
                    <Link to={{ pathname: '/admin/tickets', state: [pendingTickets, answeredTickets], }}><h5>Tickets</h5></Link>
                    <Card.Text>View, manage, and respond to user tickets.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
          <br></br><br></br>
        </div>
      }
    </>
  );
}

export default Admin;

