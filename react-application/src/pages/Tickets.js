import React from 'react';
import { useState } from 'react';
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from "axios";

const Tickets = () => {
  const { state } = useLocation();
  const [response, setResponse] = useState('');
  const [pendingTickets, setPendingTickets] = useState(state[0]);
  const [answeredTickets, setAnsweredTickets] = useState(state[1]);

  // Updates frontend and moves newly answered ticket to Answered Tickets section
  function updateTickets(index) {
    const newPending = pendingTickets.filter((ticket, cur) => {
      if (cur === index) {
        const newAnswered = [...answeredTickets];
        newAnswered.push(ticket);
        setAnsweredTickets(newAnswered);
      } else {
        return ticket;
      }
    });
    setPendingTickets(newPending);
  }

  // When admin clicks 'Respond to Ticket', send request to backend and call updateTickets()
  async function handleRespond(event, index) {
    event.preventDefault();
    if (window.confirm('Are you sure you want to respond to this ticket?')) {
      updateTickets(index);
      setResponse('');

      const ticket = pendingTickets[index];
      ticket.answer = response;
      const data = {
        answer: response,
        username: ticket.username,
        question: ticket.question,
      };

      // API call to backend to update ticket
      return axios
        .post("/admin/tickets/update", data)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <div style={{ backgroundColor: '#408cb3', height: '100vh' }}>
      <br></br>
      <Container>
        <h3 style={{ color: 'white' }}>Unanswered Tickets</h3>
        <Accordion>
          {pendingTickets.map((ticket, index) => {
            // For every unanswered ticket, display ticket in accordion where it can be answered
            return (
              <Card style={{
                background: '#316A87',
                color: 'white',
                border: 'white',
                marginBottom: '2px',
              }}>
                <Card.Header style={{ padding: '0' }}>
                  <Accordion.Toggle as={Card.Header} variant='link' eventKey={index.toString()}>
                    <Row md={3}>
                      <Col>{ticket.question}</Col>
                      <Col>{ticket.username}</Col>
                      <Col>{ticket.date.substring(0, 10)}</Col>
                    </Row>
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index.toString()}>
                  <Card.Body style={{ background: '#F3F9FF' }}>
                    <Container>
                      <Form>
                        <Form.Group controlId='control'>
                          <Form.Label style={{ color: '#408cb3' }}>Question: </Form.Label>
                          <Form.Control style={{ background: '#f7f9fc' }} type='text' placeholder={ticket.question} readOnly />
                          <br></br>
                          <Form.Label style={{ color: '#408cb3' }}>Response: </Form.Label>
                          <Form.Control as='textarea' value={response} onChange={(e) => setResponse(e.target.value)} />
                        </Form.Group>
                        <Button variant='primary' type='submit' onClick={(e) => handleRespond(e, index)}>
                          Respond to Ticket
                        </Button>
                      </Form>
                    </Container>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

            )
          })}
        </Accordion>
      </Container>
      <br></br><br></br>
      <Container>
        <h3 style={{ color: 'white' }}>Answered Tickets</h3>
        <Accordion>
          {answeredTickets.map((ticket, index) => {
            // For every answered ticket, display ticket in accordion which can be viewed by admin
            return (
              <Card style={{
                background: '#316A87',
                color: 'white',
                border: 'white',
                marginBottom: '2px',
              }}>
                <Card.Header style={{ padding: '0' }}>
                  <Accordion.Toggle as={Card.Header} variant='link' eventKey={index.toString()}>
                    <Row md={3}>
                      <Col>{ticket.question}</Col>
                      <Col>{ticket.username}</Col>
                      <Col>{ticket.date.substring(0, 10)}</Col>
                    </Row>
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index.toString()}>
                  <Card.Body style={{ background: '#F3F9FF' }}>
                    <Container>
                      <Form>
                        <Form.Group controlId='control'>
                          <Form.Label style={{ color: '#408cb3' }}>Question: </Form.Label>
                          <Form.Control style={{ background: '#f7f9fc' }} type='text' placeholder={ticket.question} readOnly />
                          <br></br>
                          <Form.Label style={{ color: '#408cb3' }}>Response: </Form.Label>
                          <Form.Control style={{ background: '#f7f9fc' }} type='text' placeholder={ticket.answer} readOnly />
                        </Form.Group>
                      </Form>
                    </Container>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            )
          })}
        </Accordion>
      </Container>
    </div >
  );
}

export default Tickets;

