import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  Alert,
  Modal,
  Accordion,
  Card
} from "react-bootstrap";
import jwt from "jwt-decode";

const Help = () => {

  // Form State
  const [question, setQuestion] = useState("");

  // Status State
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Toggle Ticket Modal
  const [ticketScreen, setTicketScreen] = useState(false);

  // Tickets
  const [answeredTickets, setAnsweredTickets] = useState([]);
  const [pendingTickets, setPendingTickets] = useState([]);

  // GET /tickets/:username
  async function getTickets(username) {
    try {
      const response = await fetch(`/tickets/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${localStorage.getItem("CHT-tokens")}`
        }
      });
      const data = await response.json();
      if (response.status === 200) {
        return [true, data.tickets];
      } else {
        return [false, data.message];
      }
    } catch (error) {
      return [false, 'Error occurred when fetching tickets'];
    }
  }

  // PUT /tickets/:username
  async function putTicket(username, args) {
    try {
      const response = await fetch(`/tickets/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${localStorage.getItem("CHT-tokens")}`
        },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      if (response.status === 200) {
        return [true];
      } else {
        return [false, data.message];
      }
    } catch (error) {
      return [false, 'Error occurred when submitting ticket'];
    }
  }

  // Fill out Placeholder Values
  async function populateTickets() {
    const currentUser = jwt(localStorage.getItem("CHT-tokens")).user.user;
    const [status, data] = await getTickets(currentUser);
    if (status) {
      setErrorMessage("");
      setAnsweredTickets(data.answered);
      setPendingTickets(data.pending);
    } else {
      setErrorMessage(data);
    }
  }

  // Validate Question
  function validateQuestion() {
    return question.replace(/\s/g, '').length !== 0;
  }

  // Verify Form Submission
  async function submitTicket() {
    let errorMsg = null;
    if (!validateQuestion()) {
      errorMsg = 'Question cannot be blank';
    }
    if (!errorMsg) {
      const currentUser = jwt(localStorage.getItem("CHT-tokens")).user.user;
      const args = {
        question
      };
      await putTicket(currentUser, args);
      await populateTickets();
      setTicketScreen(false);
    } else {
      setErrorMessage(
        <p>{errorMsg}</p>
      );
    }
  }

  useEffect(() => {
    populateTickets();
  }, []);

  return (
    <>
      {/* Help Page */}
      <Container fluid className="d-flex flex-column align-items-center">
        <Row>
          <Col>
            <Button
              style={{
                background: "#007BFF",
                color: "white",
                marginTop: '2em',
                padding: '2em'
              }}
              onClick={() => {
                setQuestion("");
                setErrorMessage("");
                setSuccess(false);
                setTicketScreen(true);
              }}>
              <h1>Submit New Ticket</h1>
            </Button>
            {success && <Alert variant='success'>Ticket successfully submitted!</Alert>}
          </Col>
        </Row>
        <Row>
          <Col>
            <Row style={{ marginTop: '2em', textAlign: 'center' }} class="align-items-center">
              <h1>Answered Tickets</h1>
            </Row>
            <Row>
              {answeredTickets.length === 0
                ? <h4>No answered tickets</h4>
                : <>
                  <Accordion style={{ width: '100%' }}>
                    {answeredTickets.map((t, i) => <>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle
                            as={Button}
                            variant="link"
                            eventKey={`${i}`}
                            style={{ color: 'black' }}
                          >
                            {`${t.date.substring(0, 10)} ${t.question.substring(0, 50)}`}
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={`${i}`}>
                          <Card.Body>
                            {'Answer: ' + t.answer}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </>)}
                  </Accordion>
                </>}
            </Row>
            <Row style={{ marginTop: '2em', textAlign: 'center' }} class="align-items-center">
              <h1>Pending Tickets</h1>
            </Row>
            <Row>
              {pendingTickets.length === 0
                ? <h4>No pending tickets</h4>
                : <>
                  <Accordion style={{ width: '100%' }}>
                    {pendingTickets.map((t, i) => <>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle
                            as={Button}
                            variant="link"
                            eventKey={`${i}`}
                            style={{ color: 'black' }}
                          >
                            {`${t.date.substring(0, 10)} ${t.question.substring(0, 50)}`}
                          </Accordion.Toggle>
                        </Card.Header>
                      </Card>
                    </>)}
                  </Accordion>
                </>}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Ticket Submit Modal */}
      <Modal
        show={ticketScreen}
        onHide={() => setTicketScreen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Submit Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="question" type="textarea">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                onChange={(e) => setQuestion(e.target.value)} />
            </Form.Group>
            {errorMessage !== "" && <Alert variant='danger'>{errorMessage}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setTicketScreen(false)}
          >
            Close
          </Button>
          <Button
            style={{ background: "#5340b3", border: "#5340b3" }}
            onClick={() => {
              submitTicket();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Help;
