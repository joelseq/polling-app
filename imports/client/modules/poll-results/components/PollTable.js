import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import GetContainerDimensions from 'react-dimensions'
import {
  Row,
} from 'react-bootstrap';

// Component for data table displaying which users voted for which option
class PollTable extends Component {
  constructor(props) {
    super(props);

    this.findElement = this.findElement.bind(this);
    this.props.containerWidth = 600;

    this.state = {};
  }

  findElement(array, element) {
    for (let i = 0; i <= array.length; i++) {
      if (array[i] == element) {
        return true;
      }
    }
    return false;
  }

  // renders the table
  render() {
    const poll_votes = this.props.votes; // votes from poll collection
    const poll_options = this.props.options; // options from poll collection
    let rows = [];
    let voterOptions = [];

    // Grabs names and values for each poll option from options hashmap
    for (let i = 0, keys = Object.keys(poll_options), ii = keys.length; i < ii; i++) {
      voterOptions.push(keys[i]);
    }

    // iterates through each handle
    for (let names = 0; names < poll_votes.length; names++) {
      // iterates through each vote for a handle
      for (let opt = 0, keys = Object.keys(poll_votes[names].selectedOptions);
          opt < keys.length; opt++) {

        // displays votes that align with available options
        if (this.findElement(voterOptions, keys[opt])) {
          // pushes [name, option, weight] for table
          rows.push([poll_votes[names].handle, keys[opt],
                    poll_votes[names].selectedOptions[keys[opt]]]);
        }
      }
    }

    // actual layout
    if (this.props.isWeighted) {
      return (
        <Table
          rowHeight={50}
          rowsCount={rows.length}
          width={this.props.containerWidth}
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
            width={this.props.containerWidth/3}
          />
          {/* Options */}
          <Column
            header={<Cell>Option</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {rows[rowIndex][1]}
              </Cell>
            )}
            width={this.props.containerWidth/3}
          />
          {/* Weight of vote */}
          <Column
            header={<Cell>Weight</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {rows[rowIndex][2]}
              </Cell>
            )}
            width={this.props.containerWidth/3}
          />
        </Table>
      ); 
    } else 
    {
      return (
          <Table
            rowHeight={50}
            rowsCount={rows.length}
            width={this.props.containerWidth}
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
              width={this.props.containerWidth/2}
            />
            {/* Options voted for */}
            <Column
              header={<Cell>Option</Cell>}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {rows[rowIndex][1]}
                </Cell>
              )}
              width={this.props.containerWidth/2}
            />
          </Table>
       );
    }
  }
}

export default GetContainerDimensions()(PollTable);
