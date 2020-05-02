import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import Box from "../cards/Box";
import BoxHeader from "../cards/BoxHeader";
import HealthScoreModal from "../helppages/HealthScoreModal";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactEcharts from "echarts-for-react";

import {
  getHealthScores,
  getLatestHealthScore
} from "../../actions/healthscore";

const timeConverter = UNIX_timestamp => {
  const a = new Date(UNIX_timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time =
    date + " " + month + " " + year + "\n" + hour + ":" + min + ":" + sec;
  return time;
};

class HealthScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }
  componentDidMount() {
    this.props.getHealthScores();
    this.props.getLatestHealthScore();
  }

  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
    }));
  };

  render() {
    const { healthScores } = this.props.healthscore;
    const { score } = this.props.healthscore.latestHealthScore;
    const data = healthScores.map(hscore => {
      const datetime = hscore.dateCreated.concat(" UTC");
      return [Date.parse(datetime), hscore.score];
    });
    const res = healthScores.reduce(
      (acc, currentValue) => {
        Object.keys(acc).forEach(key => {
          acc[key][currentValue[key]] = acc[key][currentValue[key]] + 1;
        });
        return acc;
      },
      {
        anxietyDepression: { "1": 0, "2": 0, "3": 0 },
        painDiscomfort: { "1": 0, "2": 0, "3": 0 },
        mobility: { "1": 0, "2": 0, "3": 0 },
        usualActivities: { "1": 0, "2": 0, "3": 0 },
        selfCare: { "1": 0, "2": 0, "3": 0 }
      }
    );

    const optionDiagram = {
      title: {
        text: "Health Score",
        subtext: "EQ-5D 3L",
        left: "center"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        // axisLine: { onZero: false },
        axisLabel: {
          formatter: value => timeConverter(value)
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false
        }
      },
      series: [
        {
          data: data.reverse(),
          type: "line",
          animationDelay: idx => idx * 250
        }
      ],
      tooltip: {
        trigger: "axis",
        formatter: value => {
          return `${timeConverter(value[0].data[0])}<br/>${value[0].marker}${
            value[0].data[1]
          }`;
        }
      }
    };

    const optionPie = {
      legend: {},
      title: [
        {
          text: "Mobility",
          left: "13%",
          top: "6%"
        },
        {
          text: "Self Care",
          left: "45%",
          top: "30%"
        },
        {
          text: "Usual Activities",
          right: "13%",
          top: "6%"
        },
        {
          text: "Pain/Discomfort",
          left: "13%",
          top: "63%"
        },
        {
          text: "Anxiety/Depression",
          right: "11%",
          top: "63%"
        }
      ],
      tooltip: {},
      dataset: {
        source: [
          [
            "Category",
            "Mobility",
            "Self Care",
            "Usual Activities",
            "Pain/Discomfort",
            "Anxiety/Depression"
          ],
          [
            "Extreme problems",
            res.mobility[3],
            res.selfCare[3],
            res.usualActivities[3],
            res.painDiscomfort[3],
            res.anxietyDepression[3]
          ],
          [
            "Some problems",
            res.mobility[2],
            res.selfCare[2],
            res.usualActivities[2],
            res.painDiscomfort[2],
            res.anxietyDepression[2]
          ],
          [
            "No problems",
            res.mobility[1],
            res.selfCare[1],
            res.usualActivities[1],
            res.painDiscomfort[1],
            res.anxietyDepression[1]
          ]
        ]
      },
      series: [
        {
          type: "pie",
          radius: 60,
          center: ["17%", "25%"],
          encode: {
            itemName: "Category",
            value: "Mobility"
          }
        },
        {
          type: "pie",
          radius: 60,
          center: ["50%", "50%"],
          encode: {
            itemName: "Category",
            value: "Self Care"
          }
        },
        {
          type: "pie",
          radius: 60,
          center: ["80%", "25%"],
          encode: {
            itemName: "Category",
            value: "Usual Activities"
          }
        },
        {
          type: "pie",
          radius: 60,
          center: ["20%", "85%"],
          encode: {
            itemName: "Category",
            value: "Anxiety/Depression"
          }
        },
        {
          type: "pie",
          radius: 60,
          center: ["80%", "85%"],
          encode: {
            itemName: "Category",
            value: "Pain/Discomfort"
          }
        }
      ]
    };

    return (
      <>
        <HealthScoreModal
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
        />
        <Row>
          <Box>
            <Row className="mb-3">
              <Col md={4}>
                <Button color="info" block onClick={this.toggleModal}>
                  New Health Score
                </Button>
              </Col>
              <Col md={4}></Col>
              <BoxHeader size={4} header="Latest Health Score">
                <Row>
                  <Col>
                    {score ? (
                      <h5 style={{ textAlign: "center" }}>{score}%</h5>
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        <strong>
                          You have not submitted any health score yet
                        </strong>
                      </p>
                    )}
                  </Col>
                </Row>
              </BoxHeader>
            </Row>
            <Row>
              <Box>
                <ReactEcharts
                  option={optionDiagram}
                  style={{ height: "300px" }}
                />
              </Box>
            </Row>
            {healthScores.length ? (
              <Row>
                <Box>
                  <ReactEcharts
                    option={optionPie}
                    style={{ height: "600px" }}
                  />
                </Box>
              </Row>
            ) : null}
          </Box>
        </Row>
      </>
    );
  }
}

HealthScore.propTypes = {
  getHealthScores: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  healthscore: state.healthscore
});

const mapDispatchToProps = { getHealthScores, getLatestHealthScore };

export default connect(mapStateToProps, mapDispatchToProps)(HealthScore);
