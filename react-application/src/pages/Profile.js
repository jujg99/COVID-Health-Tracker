import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Col,
  Container,
  Jumbotron,
  Row,
  Accordion,
  Card,
  Modal,
  Form,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import jwt from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { useTable, useRowSelect } from "react-table";
import styled from "styled-components";

const Profile = () => {
  const currentUser = jwt(localStorage.getItem("CHT-tokens")).user.user;

  //modals
  const [logSymptomModal, setLogSymptomModal] = useState(false);
  const [addTestResultModal, setAddTestResultModal] = useState(false);
  const [addInfoModal, setAddInfoModal] = useState(false);
  const [symptomEditScreen, setSymptomEditScreen] = useState(false);
  const [testEditScreen, setTestEditScreen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // alerts and confirmations
  const [showTempAlert, setShowTempAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentInput, setCurrentInput] = useState(false);

  //symptom input
  const [temperature, setTemperature] = useState("");
  const [cough, setCough] = useState(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(false);
  const [fatigue, setFatigue] = useState(false);
  const [muscleBodyAches, setMuscleBodyAches] = useState(false);
  const [lossOfTaste, setLossOfTaste] = useState(false);
  const [soreThroat, setSoreThroat] = useState(false);
  const [congestion, setCongestion] = useState(false);
  const [nausea, setNausea] = useState(false);
  const [other, setOther] = useState("");

  //test input
  const [date, setDate] = useState(new Date());
  const [testResult, setTestResult] = useState("Negative");
  const [testType, setTestType] = useState("");

  const [currentID, setCurrentID] = useState("");

  // list of user's logged symptoms
  const [symptoms, setSymptoms] = useState([]);

  // list of user's test results
  const [testResults, setTestResults] = useState([]);

  // covid results and severity
  const [covidResults, setCovidResults] = useState("");
  const [severity, setSeverity] = useState("");

  // set up symptom columns
  const symptomColumns = React.useMemo(
    () => [
      {
        Header: "Date",
        id: "date",
        accessor: (d) => d.date.substring(0, 10),
      },
      {
        Header: "Temp",
        accessor: "temperature",
      },
      {
        Header: "Cough",
        id: "cough",
        accessor: (d) => (d.cough ? "Yes" : "No"),
      },
      {
        Header: "Shortness of Breath",
        id: "shortBreath",
        accessor: (d) => (d.shortBreath ? "Yes" : "No"),
      },
      {
        Header: "Fatigue",
        id: "fatigue",
        accessor: (d) => (d.fatigue ? "Yes" : "No"),
      },
      {
        Header: "Muscle/Body Aches",
        id: "bodyAche",
        accessor: (d) => (d.bodyAche ? "Yes" : "No"),
      },
      {
        Header: "Loss of Taste",
        id: "tasteLoss",
        accessor: (d) => (d.tasteLoss ? "Yes" : "No"),
      },
      {
        Header: "Sore Throat",
        id: "soreThroat",
        accessor: (d) => (d.soreThroat ? "Yes" : "No"),
      },
      {
        Header: "Congestion",
        id: "congestion",
        accessor: (d) => (d.congestion ? "Yes" : "No"),
      },
      {
        Header: "Nausea",
        id: "nausea",
        accessor: (d) => (d.nausea ? "Yes" : "No"),
      },
      {
        Header: "Other",
        accessor: "other",
      },
    ],
    []
  );

  //set up test columns
  const testColumns = React.useMemo(
    () => [
      {
        Header: "Date",
        id: "date",
        accessor: (d) => d.date.substring(0, 10),
      },
      {
        Header: "Type",
        accessor: "test",
      },
      {
        Header: "Result",
        accessor: "result",
      },
    ],
    []
  );

  // style for tables
  const Styles = styled.div`
    padding: 1rem;

    table {
      border-spacing: 0;
      border: 1px solid black;

      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      th,
      td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;

        :last-child {
          border-right: 0;
        }
      }
    }
  `;

  useEffect(() => {
    getSymptoms();
    getTestResults();
  }, []);

  // get symptoms of user
  function getSymptoms() {
    return axios
      .post("http://localhost:8080/profile/symptoms", { username: currentUser })
      .then((response) => {
        setSymptoms(response.data.symptoms);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // get test results of user
  function getTestResults() {
    return axios
      .post("http://localhost:8080/profile/tests", { username: currentUser })
      .then((response) => {
        setTestResults(response.data.tests);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // get covid result and severity based on most recent symptoms
  function getResults() {
    if (symptoms.length === 0) {
      setCovidResults("You have no logged symptoms.");
      return;
    }
    // most recent symptoms
    var rS = symptoms[symptoms.length - 1];
    if (
      rS.temperature >= 100.4 ||
      rS.cough ||
      rS.shortBreath ||
      rS.bodyAche ||
      rS.congest ||
      rS.fatigue ||
      rS.nausea ||
      rS.soreThroat ||
      rS.tasteLoss
    ) {
      // if user has any symptoms, they may have covid
      setCovidResults(
        "Based on your most recent symptoms, you may have COVID-19. The CDC recommends that anyone with symptoms of COVID-19 should get tested. It is important to stay home and quarentine."
      );

      // now find severity
      axios
        .post("http://localhost:8080/profile/ageAndRisk", {
          username: currentUser,
        })
        .then((response) => {
          if (response.data[0].age >= 60 || response.data[0].atRisk) {
            setSeverity(
              "Severity: You may be at an increased risk of becoming more seriously ill due to COVID-19 because of your age or medical condition. Call your medical provider, clinician advice line, or telemedicine provider."
            );
          } else {
            setSeverity(
              "Severity: You are not at an increased risk of becoming more severely ill."
            );
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setCovidResults(
        "Based on your most recent symptoms, you are unlikely to have COVID-19. If you believe you may be infected, taking a COVID-19 test will give a more accurate result."
      );
      setSeverity(
        "Severity: You are not at an increased risk of becoming more severely ill."
      );
    }
  }

  // reset inputs for symptom and test result logging
  function reset() {
    setTemperature("");
    setCough(false);
    setShortnessOfBreath(false);
    setFatigue(false);
    setMuscleBodyAches(false);
    setLossOfTaste(false);
    setSoreThroat(false);
    setCongestion(false);
    setNausea(false);
    setOther("");
    setDate(new Date());
    setTestType("");
    setTestResult("Negative");
  }

  function submitSymptoms() {
    if (temperature.length === 0 || isNaN(temperature)) {
      // check if temperature input is valid
      setShowTempAlert(true);
      return;
    }
    //data to be sent to backend
    const data = {
      username: currentUser,
      temperature: temperature,
      cough: cough,
      shortBreath: shortnessOfBreath,
      fatigue: fatigue,
      bodyAche: muscleBodyAches,
      tasteLoss: lossOfTaste,
      soreThroat: soreThroat,
      congestion: congestion,
      nausea: nausea,
      other: other,
    };
    return axios
      .post("http://localhost:8080/profile/submitSymptoms", data)
      .then((response) => {
        getSymptoms(); //update symptom table again with new input
        setCurrentInput("Your symptoms have been successfully submitted.");
        setShowConfirmation(true); // show confirmation
        setLogSymptomModal(false); //close log symptom modal
        reset(); // clear input
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function submitTestResults() {
    //data to be sent to backend
    const data = {
      username: currentUser,
      date: date,
      type: testType,
      result: testResult,
    };
    return axios
      .post("http://localhost:8080/profile/submitTestResults", data)
      .then((response) => {
        getTestResults(); //update test result table
        setDate(new Date());
        setCurrentInput("Your test results have been successfully submitted.");
        setShowConfirmation(true); // show confirmation
        reset(); //clear input
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // set up checkbox for tables
  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );

  function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      selectedFlatRows,
    } = useTable(
      {
        columns,
        data,
      },
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: () => <div />,
            Cell: ({ row }) => {
              if (
                rows.filter((row) => row.isSelected).length < 1 ||
                row.isSelected
              ) {
                return (
                  <div>
                    <IndeterminateCheckbox
                      {...row.getToggleRowSelectedProps()}
                    />
                  </div>
                );
              } else {
                return (
                  <div>
                    <IndeterminateCheckbox
                      checked={false}
                      readOnly
                      style={row.getToggleRowSelectedProps().style}
                    />
                  </div>
                );
              }
            },
          },
          ...columns,
        ]);
      }
    );

    // Render the UI for table
    return (
      <>
        <ButtonGroup>
          <Button variant="secondary" onClick={() => editRow(selectedFlatRows)}>
            Edit
          </Button>
          <Button
            variant="secondary"
            onClick={() => deleteRow(selectedFlatRows)}
          >
            Delete
          </Button>
        </ButtonGroup>
        <br />
        <br />
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }

  function editRow(selectedRow) {
    if (selectedRow.length === 0) {
      return;
    }
    if (selectedRow[0].original.test === undefined) {
      setTemperature(selectedRow[0].original.temperature);
      setCough(selectedRow[0].original.cough);
      setShortnessOfBreath(selectedRow[0].original.shortBreath);
      setFatigue(selectedRow[0].original.fatigue);
      setMuscleBodyAches(selectedRow[0].original.bodyAche);
      setLossOfTaste(selectedRow[0].original.tasteLoss);
      setSoreThroat(selectedRow[0].original.soreThroat);
      setCongestion(selectedRow[0].original.congest);
      setNausea(selectedRow[0].original.nausea);
      setOther(selectedRow[0].original.other);
      setCurrentID(selectedRow[0].original.textid);
      setSymptomEditScreen(true);
    } else {
      setTestType(selectedRow[0].original.test);
      setDate(new Date(selectedRow[0].original.date));
      setTestResult(selectedRow[0].original.result);
      setCurrentID(selectedRow[0].original.textid);
      setTestEditScreen(true);
    }
  }

  function submitSymptomEdit() {
    // data to be sent to backend
    const data = {
      id: currentID,
      temperature: temperature,
      cough: cough,
      shortBreath: shortnessOfBreath,
      fatigue: fatigue,
      bodyAche: muscleBodyAches,
      tasteLoss: lossOfTaste,
      soreThroat: soreThroat,
      congestion: congestion,
      nausea: nausea,
      other: other,
    };
    return axios
      .post("http://localhost:8080/profile/editSymptom", data)
      .then((response) => {
        getSymptoms(); //update symptom table
        setSymptomEditScreen(false); // close edit screen
        setCurrentInput("The row has been successfully edited.");
        setShowConfirmation(true); // show confirmation
        reset(); //reset input
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function submitTestEdit() {
    //data to be sent to backend
    const data = {
      id: currentID,
      date: date,
      test: testType,
      result: testResult,
    };
    return axios
      .post("http://localhost:8080/profile/editTest", data)
      .then((response) => {
        getTestResults(); //update test result table
        setTestEditScreen(false); //close test edit screen
        setCurrentInput("The row has been successfully edited.");
        setShowConfirmation(true); //show confirmation
        reset();  //reset input
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function deleteRow(selectedRow) {
    if (selectedRow.length === 0) {
      return;
    }
    if (selectedRow[0].original.test === undefined) {
      // id of symptom to be sent to backend
      const data = {
        id: symptoms[selectedRow[0].index].textid,
      };
      return axios
        .post("http://localhost:8080/profile/deleteSymptom", data)
        .then((response) => {
          setCurrentInput("The row has been successfully deleted.");
          setShowConfirmation(true);
          getSymptoms();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // id of test result to be sent to backend
      const data = {
        id: testResults[selectedRow[0].index].textid,
      };
      return axios
        .post("http://localhost:8080/profile/deleteTest", data)
        .then((response) => {
          setCurrentInput("The row has been successfully deleted.");
          setShowConfirmation(true);
          getTestResults();
        })
        .catch((err) => {
          console.error(err);
        });
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
                      onClick={() => setLogSymptomModal(true)}
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
                      onClick={() => setAddTestResultModal(true)}
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
                      onClick={() => setAddInfoModal(true)}
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
              <Button
                style={{
                  background: "#5340b3",
                  color: "white",
                  border: "#202C42",
                }}
                onClick={() => {
                  getResults();
                  setShowResults(true);
                }}
              >
                Check Results
              </Button>
            </Row>
            <br />
            <Row className="justify-content-center">
              <Alert
                show={showConfirmation}
                variant="success"
                onClose={() => setShowConfirmation(false)}
                dismissible
              >
                <Alert.Heading>{currentInput}</Alert.Heading>
              </Alert>
            </Row>
            <br />
            <Row>
              <Styles>
                <Table columns={symptomColumns} data={symptoms} />
              </Styles>
            </Row>
            <Row>
              <Styles>
                <Table columns={testColumns} data={testResults} />
              </Styles>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modals */}
      <Modal
        show={showResults}
        onHide={() => setShowResults(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <p>
            <strong>Results: {covidResults}</strong>
          </p>
          <p>
            <strong>{severity}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setShowResults(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={logSymptomModal}
        onHide={() => setLogSymptomModal(false)}
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
            <Form.Check label={"Cough"} onChange={(e) => setCough(!cough)} />
            <Form.Check
              label={"Shortness of breath"}
              onChange={(e) => setShortnessOfBreath(!shortnessOfBreath)}
            />
            <Form.Check
              label={"Fatigue"}
              onChange={(e) => setFatigue(!fatigue)}
            />
            <Form.Check
              label={"Muscle or body aches"}
              onChange={(e) => setMuscleBodyAches(!muscleBodyAches)}
            />
            <Form.Check
              label={"Loss of taste"}
              onChange={(e) => setLossOfTaste(!lossOfTaste)}
            />
            <Form.Check
              label={"Sore throat"}
              onChange={(e) => setSoreThroat(!soreThroat)}
            />
            <Form.Check
              label={"Congestion or runny nose"}
              onChange={(e) => setCongestion(!congestion)}
            />
            <Form.Check label={"Nausea"} onChange={(e) => setNausea(!nausea)} />
            <Form.Group controlId="other" type="text">
              <Form.Label>Other</Form.Label>
              <Form.Control onChange={(e) => setOther(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => {
              setLogSymptomModal(false);
              setShowTempAlert(false);
            }}
          >
            Close
          </Button>
          <Button
            style={{ background: "#5340b3", border: "#5340b3" }}
            onClick={() => {
              submitSymptoms();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={addTestResultModal}
        onHide={() => setAddTestResultModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add Test Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="testType" type="text">
              <Form.Label>Test Type</Form.Label>
              <Form.Control onChange={(e) => setTestType(e.target.value)} />
            </Form.Group>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="MM/dd/yyyy"
            />
            <br />
            <br />
            <Form.Control
              as="select"
              value={"Negative"}
              onChange={(e) => setTestResult(e.target.value)}
            >
              <option value={"Negative"}>Negative</option>
              <option value={"Positive"}>Positive</option>
            </Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setAddTestResultModal(false)}
          >
            Close
          </Button>
          <Button
            style={{ background: "#5340b3", border: "#5340b3" }}
            onClick={() => {
              submitTestResults();
              setAddTestResultModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={addInfoModal}
        onHide={() => setAddInfoModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add More Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br />
          <p>
            Adults of any age with certain underlying medical conditions are at
            increased risk for severe illness. The conditions are:
          </p>
          <li>Cancer</li>
          <li>Chronic kidney disease</li>
          <li>COPD (chronic obstructive pulmonary disease</li>
          <li>Down Syndrome</li>
          <li>
            Heart conditions, such as heart failure, coronary artery disease, or
            cardiomyopathies
          </li>
          <li>
            Immunocompromised state (weakened immune system) from solid organ
            transplant
          </li>
          <li>
            Obesity (body mass index [BMI] of 30 kg/m<sup>2</sup> or higher but
            &#60; 40 kg/m<sup>2</sup>)
          </li>
          <li>
            Severe Obesity (BMI ≥ 40 kg/m<sup>2</sup>)
          </li>
          <li>Pregancy</li>
          <li>Sickle cell disease</li>
          <li>Smoking</li>
          <li>Type 2 diabetes mellitus</li>
          <br />
          <p>
            Older adults are at the highest risk, and the greatest risk for
            severe illness from COVID-19 is among those aged 85 or older.
          </p>
          <br />
          <p>You can add this information in the setting page.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setAddInfoModal(false)}
          >
            Close
          </Button>
          <Link to="/settings">
            <Button
              style={{ background: "#5340b3", border: "#5340b3" }}
            >
              Go to settings
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>

      <Modal
        show={symptomEditScreen}
        onHide={() => setSymptomEditScreen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Edit Symptom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="temperature" type="number">
              <Form.Label>Temperature (&#176;Fahrenheit)</Form.Label>
              <Form.Control
                placeholder={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </Form.Group>
            <Alert show={showTempAlert} variant="danger">
              <p>Please input a valid temperature.</p>
            </Alert>
            <br />
            <p>Please select the symptoms you are experiencing.</p>
            <Form.Check
              label={"Cough"}
              onChange={(e) => setCough(!cough)}
              checked={cough}
            />
            <Form.Check
              label={"Shortness of breath"}
              onChange={(e) => setShortnessOfBreath(!shortnessOfBreath)}
              checked={shortnessOfBreath}
            />
            <Form.Check
              label={"Fatigue"}
              onChange={(e) => setFatigue(!fatigue)}
              checked={fatigue}
            />
            <Form.Check
              label={"Muscle or body aches"}
              onChange={(e) => setMuscleBodyAches(!muscleBodyAches)}
              checked={muscleBodyAches}
            />
            <Form.Check
              label={"Loss of taste"}
              onChange={(e) => setLossOfTaste(!lossOfTaste)}
              checked={lossOfTaste}
            />
            <Form.Check
              label={"Sore throat"}
              onChange={(e) => setSoreThroat(!soreThroat)}
              checked={soreThroat}
            />
            <Form.Check
              label={"Congestion or runny nose"}
              onChange={(e) => setCongestion(!congestion)}
              checked={congestion}
            />
            <Form.Check
              label={"Nausea"}
              onChange={(e) => setNausea(!nausea)}
              checked={nausea}
            />
            <Form.Group controlId="other" type="text">
              <Form.Label>Other</Form.Label>
              <Form.Control
                onChange={(e) => setOther(e.target.value)}
                placeholder={other}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setSymptomEditScreen(false)}
          >
            Close
          </Button>
          <Button
            style={{ background: "#5340b3", border: "#5340b3" }}
            onClick={() => {
              submitSymptomEdit();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={testEditScreen}
        onHide={() => setTestEditScreen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Edit Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="testType" type="text">
              <Form.Label>Test Type</Form.Label>
              <Form.Control
                placeholder={testType}
                onChange={(e) => setTestType(e.target.value)}
              />
            </Form.Group>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="MM/dd/yyyy"
            />
            <br />
            <br />
            <Form.Control
              as="select"
              value={testResult}
              onChange={(e) => setTestResult(e.target.value)}
            >
              <option value={"Negative"}>Negative</option>
              <option value={"Positive"}>Positive</option>
            </Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "gray", border: "gray" }}
            onClick={() => setTestEditScreen(false)}
          >
            Close
          </Button>
          <Button
            style={{ background: "#5340b3", border: "#5340b3" }}
            onClick={() => {
              submitTestEdit();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
