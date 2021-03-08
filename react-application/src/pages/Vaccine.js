import React, { Component } from "react";
import axios from "axios";

//https://www.vaccinespotter.org/api/
//https://github.com/GUI/covid-vaccine-spotter

export default class Vaccine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  findVaccine = () => {
    axios
      .post("http://localhost:8080/location/vaccine")
      .then((response) => {
        console.log("searched vaccine");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return <>Vaccine Page</>;
  }
}
