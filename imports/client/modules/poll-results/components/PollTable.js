import React, { Component, PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

// Component for data table displaying which users voted for which option
export default class PollTable extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // renders the table
  render() {
    const poll_votes = this.props.votes; // votes from poll collection
    const poll_options = this.props.options; // options from poll collection
    let rows = [];

    // iterates through each handle
    for (let names = 0; names < poll_votes.length; names++) {
      // iterates through each vote for a handle
      for (let opt = 0, keys = Object.keys(poll_votes[names].selectedOptions);
          opt < keys.length; opt++) {

        // displays votes that align with available options
        if (poll_options.find(keys[opt])) {
          // pushes [name, option, weight] for table
          rows.push([poll_votes[names].handle, keys[opt],
                    poll_votes[names].selectedOptions[keys[opt]]]);
        }
      }
    }

    // actual layout
    return (
      <div>
        { this.props.isWeighted
          ?
            (
              <Table
                rowHeight={50}
                rowsCount={rows.length}
                width={600}
                height={50*(rows.length + 1) + 2}
                headerHeight={50}>
                {/* Handles */}
                <Column
                  header={<Cell>Handle</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {rows[rowIndex][0]}
                    </Cell>
                  )}
                  width={200}
                />
                {/* Options */}
                <Column
                  header={<Cell>Option</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {rows[rowIndex][1]}
                    </Cell>
                  )}
                  width={200}
                />
                {/* Weight of vote */}
                <Column
                  header={<Cell>Weight</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {rows[rowIndex][2]}
                    </Cell>
                  )}
                  width={200}
                />
              </Table>

            )
          :
            (
              <Table
                rowHeight={50}
                rowsCount={rows.length}
                width={400}
                height={50*(rows.length + 1) + 2}
                headerHeight={50}>
                {/* Handles */}
                <Column
                  header={<Cell>Handle</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {rows[rowIndex][0]}
                    </Cell>
                  )}
                  width={200}
                />
                {/* Options voted for */}
                <Column
                  header={<Cell>Option</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {rows[rowIndex][1]}
                    </Cell>
                  )}
                  width={200}
                />
              </Table>
            )
        }
      </div>
    );

  }
}
