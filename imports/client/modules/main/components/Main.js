import React from 'react';
import { Link } from 'react-router'

export default function () {
  return (
    <div>
      <h1>Welcome to People Order Our Products' Polling App!</h1>
      <p>
        Our app helps groups to come to a consensus
        on those tough choices in life like Panda or
        Lemongrass
      </p>
      <button><Link to="/create">Create Poll</Link></button>
    </div>
  );
}
