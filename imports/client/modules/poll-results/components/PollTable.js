import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

// Component for data table displaying which users voted for which option
export default class PollTable extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // renders the table
  render() {
    // rows in table
    const rows = [
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['x', 'y', 'z'],
    ];

    return (
      <Table
        rowHeight={50}
        rowsCount={rows.length}
        width={600}
        height={101 * (rows.length - 1)}
        headerHeight={50}
      >
        <Column
          header={<Cell>Handle</Cell>}
          cell={({ rowIndex, ...props }) => (
            <Cell {...props}>
              {rows[rowIndex][0]}
            </Cell>
          )}
          width={200}
        />
        <Column
          header={<Cell>Option</Cell>}
          cell={({ rowIndex, ...props }) => (
            <Cell {...props}>
              {rows[rowIndex][1]}
            </Cell>
          )}
          width={200}
        />
        <Column
          header={<Cell>Weight</Cell>}
          cell={({ rowIndex, ...props }) => (
            <Cell {...props}>
              {rows[rowIndex][2]}
            </Cell>
          )}
          width={200}
        />
      </Table>
    );
  }
}
