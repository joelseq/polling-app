import React, { Component, PropTypes } from 'react';
import {Bar} from 'react-chartjs-2';

export default class PollResults extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const poll_options = this.props.options;
    let chartOptions = [];
    let chartData = [];

    for (var i = 0, keys = Object.keys(poll_options), ii = keys.length; i < ii; i++) {
      chartOptions.push(keys[i]);
      chartData.push(poll_options[keys[i]]);
    }

    var myChart = {
      data: {
          labels: chartOptions,
          datasets: [{
              label: 'Number of Votes',
              data: chartData,
              backgroundColor:
                  'rgba(255, 99, 132, 0.2)'
              ,
              borderColor:
                  'rgba(255,99,132,1)'
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

    return (
      <div>
        <Bar data={myChart.data} options={myChart.options} />
      </div>
    );

  }
}
