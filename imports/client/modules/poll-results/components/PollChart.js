import React, { Component, PropTypes } from 'react';
import {Bar} from 'react-chartjs-2';

// Component for bar chart displaying the results of the poll
export default class PollChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    // checks to see if any votes have been cast
    if (!this.props.poll.votes) {
      return (
        <div className="text-center">
          <h4>No votes have been cast, please vote to see results</h4>
        </div>
      );
    }

    const poll_options = this.props.options; // options from poll collection

		let chartOptions = []; // array of option names
    let chartData = []; // number of votes for each option
		var max = 0;
		var key;
    const weighted = this.props.poll.isWeighted;
    const numVotes = this.props.poll.votes.length;

    // Grabs names and values for each poll option from options hashmap
    for (let i = 0, keys = Object.keys(poll_options), ii = keys.length; i < ii; i++) {
      chartOptions.push(keys[i]);

			if(weighted) {
				chartData.push(poll_options[keys[i]]/numVotes);
			} else {
				chartData.push(poll_options[keys[i]]);
			}

			if(poll_options[keys[i]] > max) {
				max = poll_options[keys[i]];
				key = keys[i];
			}
		}

		var labeltext = "Vote Totals";

		if(weighted) {
			labeltext = "Average Rating";
		}

    // chart containing the poll results
    var pollBarChart = {
      data: {
          labels: chartOptions,
          datasets: [{
              label: labeltext,
              data: chartData,
              backgroundColor:
                  'rgba(0, 153, 255, 0.6)'
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
        <h3 className="text-center">"{key}" is the winner!</h3>
				<Bar data={pollBarChart.data} options={pollBarChart.options} width={600} height={200}/>
      </div>
    );

  }
}
