import React from "react";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Jumbotron,
  Row,
  Accordion,
  Card,
  Table,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/auth";
import jwt from "jwt-decode";

const Profile = () => {
  const { setAuthTokens } = useAuth();
  const currentUser = jwt(localStorage.getItem("CHT-tokens")).user.user;

  //modals
  const [showSymptom, setShowSymptom] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showAddInfo, setAddInfo] = useState(false);

  const [showTempAlert, setShowTempAlert] = useState(false);

  //possible symptoms to be logged
  const [temperature, setTemperature] = useState("");
  const [cough, setCough] = useState(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(false);
  const [fatigue, setFatigue] = useState(false);
  const [muscleBodyAches, setMuscleBodyAches] = useState(false);
  const [headaches, setHeadaches] = useState(false);
  const [lossOfTaste, setLossOfTaste] = useState(false);
  const [soreThroat, setSoreThroat] = useState(false);
  const [congestion, setCongestion] = useState(false);
  const [nausea, setNausea] = useState(false);
  const [diarrhea, setDiarrhea] = useState(false);

  //some dummy data
  const symptoms = [
    {
      date: "2/25/21",
      temperature: 98.6,
      cough: false,
      shortnessOfBreath: false,
      fatigue: false,
      muscleBodyAches: false,
      headaches: false,
      lossOfTaste: false,
      soreThroat: false,
      congestion: false,
      nausea: false,
      diarrhea: false,
    },
    {
      date: "2/26/21",
      temperature: 99.7,
      cough: true,
      shortnessOfBreath: false,
      fatigue: false,
      muscleBodyAches: false,
      headaches: false,
      lossOfTaste: true,
      soreThroat: false,
      congestion: false,
      nausea: false,
      diarrhea: false,
    },
    {
      date: "2/27/21",
      temperature: 100.1,
      cough: true,
      shortnessOfBreath: true,
      fatigue: true,
      muscleBodyAches: true,
      headaches: true,
      lossOfTaste: true,
      soreThroat: true,
      congestion: true,
      nausea: true,
      diarrhea: true,
    },
  ];

  function submitSymptoms() {
    if (!isNaN(temperature)) {
    } else {
      setShowTempAlert(true);
    }
  }

  return (
    <>
      <Jumbotron fluid style={{ background: "#20475A" }}>
        <Container style={{ color: "white" }}>
          <h1>Hello, {currentUser}</h1>
        </Container>
      </Jumbotron>
      <Container fluid>
        <Row>
          <Col>
            <Accordion>
              <Card
                style={{
                  background: "#316A87",
                  color: "white",
                  border: "white",
                }}
              >
                <Card.Header>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey="0"
                    style={{ color: "white" }}
                  >
                    Log Symptoms
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body style={{ background: "#87BAD4" }}>
                    Log your symptoms daily. People with COVID-19 have had a
                    wide range of symptoms reported – ranging from mild symptoms
                    to severe illness. Symptoms may appear 2-14 days after
                    exposure to the virus.
                    <br />
                    <br />
                    <Button
                      style={{
                        background: "#5340b3",
                        color: "white",
                        border: "#202C42",
                      }}
                      onClick={() => setShowSymptom(true)}
                    >
                      Log Symptoms
                    </Button>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card
                style={{
                  background: "#408cb3",
                  color: "white",
                  border: "white",
                }}
              >
                <Card.Header>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey="1"
                    style={{ color: "white" }}
                  >
                    Add Test Results
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body style={{ background: "#87BAD4" }}>
                    Who should get tested?
                    <li>People who have symptoms of COVID-19.</li>
                    <li>
                      People who have had close contact (within 6 feet for a
                      total of 15 minutes or more) with someone with confirmed
                      COVID-19.
                    </li>
                    <li>
                      People who have taken part in activities that put them at
                      higher risk for COVID-19 because they cannot socially
                      distance as needed, such as travel, attending large social
                      or mass gatherings, or being in crowded indoor settings.
                    </li>
                    <li>
                      People who have been asked or referred to get testing by
                      their healthcare provider, or state ​health department.
                    </li>
                    <br />
                    <Button
                      style={{
                        background: "#5340b3",
                        color: "white",
                        border: "#202C42",
                      }}
                      onClick={() => setShowTest(true)}
                    >
                      Add Test Results
                    </Button>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card
                style={{
                  background: "#69A9C9",
                  color: "white",
                  border: "white",
                }}
              >
                <Card.Header>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey="2"
                    style={{ color: "white" }}
                  >
                    Add More Information
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                  <Card.Body style={{ background: "#87BAD4" }}>
                    Some people are more likely than others to become severely
                    ill,
                    <li>older adults</li>
                    <li>people with medical conditions</li>
                    Understanding who is at risk can help determine the severity
                    and precautions you should take.
                    <br />
                    <br />
                    <Button
                      style={{
                        background: "#5340b3",
                        color: "white",
                        border: "#202C42",
                      }}
                      onClick={() => setAddInfo(true)}
                    >
                      Add More Information
                    </Button>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <br />
            <Card>
              <Card.Body>
                <strong>
                  Seek immediate medical attention if someone is showing signs
                  of:
                </strong>
                <li>Trouble breathing</li>
                <li>Persistent pain or pressure in the chest</li>
                <li>New Confusion</li>
                <li>Inability to wake or stay awake</li>
                <li>
                  Pale, gray, or blue-colored skin, lips, or nail beds,
                  depending on skin tone
                </li>
              </Card.Body>
            </Card>
            <br />
          </Col>
          <Col md={8}>
            <Row className="justify-content-center">
              <Card>
                <Card.Body>
                  <h4>Results:</h4>
                  <p>
                    <strong>Likelihood: </strong>
                  </p>
                  <p>
                    <strong>Severity:</strong>
                  </p>
                </Card.Body>
              </Card>
            </Row>
            <br />
            <Row>
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Temperature</th>
                    <th>Cough</th>
                    <th>Shortness of Breath</th>
                    <th>Fatigue</th>
                    <th>Muscle/Body Aches</th>
                    <th>Headaches</th>
                    <th>Loss of Taste</th>
                    <th>Sore Throat</th>
                    <th>Congestion/Runny Nose</th>
                    <th>Nausea</th>
                    <th>Diarrhea</th>
                  </tr>
                </thead>
                <tbody>
                  {symptoms.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.temperature}</td>
                      <td>{item.cough ? "Yes" : "No"}</td>
                      <td>{item.shortnessOfBreath ? "Yes" : "No"}</td>
                      <td>{item.fatigue ? "Yes" : "No"}</td>
                      <td>{item.muscleBodyAches ? "Yes" : "No"}</td>
                      <td>{item.headaches ? "Yes" : "No"}</td>
                      <td>{item.lossOfTaste ? "Yes" : "No"}</td>
                      <td>{item.soreThroat ? "Yes" : "No"}</td>
                      <td>{item.congestion ? "Yes" : "No"}</td>
                      <td>{item.nausea ? "Yes" : "No"}</td>
                      <td>{item.diarrhea ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showSymptom}
        onHide={() => setShowSymptom(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Log Symptoms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="temperature" type="number">
              <Form.Label>Temperature (&#176;Fahrenheit)</Form.Label>
              <Form.Control onChange={(e) => setTemperature(e.target.value)} />
            </Form.Group>
            <Alert show={showTempAlert} variant="danger">
              <p>Please input a valid temperature.</p>
            </Alert>
            <br />
            <p>Please select the symptoms you are experiencing.</p>
            <Form.Check label={"Cough"} onChange={(e) => setCough(true)} />
            <Form.Check
              label={"Shortness of breath"}
              onChange={(e) => setShortnessOfBreath(true)}
            />
            <Form.Check label={"Fatigue"} onChange={(e) => setFatigue(true)} />
            <Form.Check
              label={"Muscle or body aches"}
              onChange={(e) => setMuscleBodyAches(true)}
            />
            <Form.Check
              label={"Headache"}
              onChange={(e) => setHeadaches(true)}
            />
            <Form.Check
              label={"Loss of taste"}
              onChange={(e) => setLossOfTaste(true)}
            />
            <Form.Check
              label={"Sore throat"}
              onChange={(e) => setSoreThroat(true)}
            />
            <Form.Check
              label={"Congestion or runny nose"}
              onChange={(e) => setCongestion(true)}
            />
            <Form.Check label={"Nausea"} onChange={(e) => setNausea(true)} />
            <Form.Check
              label={"Diarrhea"}
              onChange={(e) => setDiarrhea(true)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => {
              setShowSymptom(false);
              setShowTempAlert(false);
            }}
          >
            Close
          </Button>
          <Button
            style={{ background: "#5340b3", border: "#5340b3" }}
            onClick={submitSymptoms}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showTest}
        onHide={() => setShowTest(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add Test Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control as="select">
              <option>Negative</option>
              <option>Positive</option>
            </Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setShowTest(false)}
          >
            Close
          </Button>
          <Button style={{ background: "#5340b3", border: "#5340b3" }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={showAddInfo}
        onHide={() => setAddInfo(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add More Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control />
            </Form.Group>
            <br />
            <p>Do you have any of the following:</p>
            <li>Cancer</li>
            <li>Chronic kidney disease</li>
            <li>COPD (chronic obstructive pulmonary disease</li>
            <li>Down Syndrome</li>
            <li>
              Heart conditions, such as heart failure, coronary artery disease,
              or cardiomyopathies
            </li>
            <li>
              Immunocompromised state (weakened immune system) from solid organ
              transplant
            </li>
            <li>
              Obesity (body mass index [BMI] of 30 kg/m<sup>2</sup> or higher
              but &#60; 40 kg/m<sup>2</sup>)
            </li>
            <li>
              Severe Obesity (BMI ≥ 40 kg/m<sup>2</sup>)
            </li>
            <li>Pregancy</li>
            <li>Sickle cell disease</li>
            <li>Smoking</li>
            <li>Type 2 diabetes mellitus</li>
            <br />
            <Form.Control as="select">
              <option>No</option>
              <option>Yes</option>
            </Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setAddInfo(false)}
          >
            Close
          </Button>
          <Button style={{ background: "#5340b3", border: "#5340b3" }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
