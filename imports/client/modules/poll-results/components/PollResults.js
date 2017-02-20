import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Chart from 'chart.js';
import Bar from 'react-chartjs/lib/bar';

export default class PollResults extends Component {

  render() {
    const chartData = {
      labels: ['a', 'b', 'c']
      datasets: [1, 2, 3]
    }

    return (
      <div>
        <Bar data={chartData}/>
      </div>
    );
  }
}
