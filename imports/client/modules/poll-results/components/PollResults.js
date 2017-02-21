import React from 'react';
import Bar from 'react-chartjs/lib/bar';

export default function PollResults() {
  const chartData = {
    labels: ['a', 'b', 'c'],
    datasets: [1, 2, 3],
  };

  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
}
