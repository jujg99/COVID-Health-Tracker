import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Card, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';

const useFetch = url => {
  const [users, setUsers] = useState(null);
  const [isLoading, setLoading] = useState(true);

  function createData(name, username, age, atRisk, city, state) {
    return { name, username, age, atRisk, city, state };
  }

  useEffect(async () => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
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
  const { users, isLoading } = useFetch("http://localhost:8080/admin/");

  return (
    <Container fluid>
      {isLoading ? <div>Loading...</div> :
        <Col md={3} style={{ padding: 100 }}>
          <Card style={{ background: "#40B3A0" }}>
            <Card.Body>
              <Card.Title><Link to={{
                pathname: '/admin/users',
                state: users,
              }}> User List </Link></Card.Title>
            </Card.Body>
          </Card>
        </Col>
      }
    </Container>
  );
}

export default Admin;

