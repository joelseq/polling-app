import React, { Component, PropTypes } from 'react';
import {Bar} from 'react-chartjs-2';

// Component for bar chart displaying the results of the poll
export default class PollChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const poll_options = this.props.options; // options from poll collection
    let chartOptions = []; // array of option names
    let chartData = []; //

    // Grabs names and values for each poll option from options hashmap
    for (let i = 0, keys = Object.keys(poll_options), ii = keys.length; i < ii; i++) {
      chartOptions.push(keys[i]);
      chartData.push(poll_options[keys[i]]);
    }

    // chart containing the poll results
    var pollBarChart = {
      data: {
          labels: chartOptions,
          datasets: [{
              label: 'Number of Votes',
              data: chartData,
              backgroundColor:
                  'rgba(0, 153, 255, 0.2)'
              ,
              borderColor:
                  'rgba(0, 152, 255, 1)'
              ,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  	};

    // layout of what is rendered
    return (
      <div>
        <Bar data={pollBarChart.data} options={pollBarChart.options} width="600px" height="200px"/>
      </div>
    );

  }
}
