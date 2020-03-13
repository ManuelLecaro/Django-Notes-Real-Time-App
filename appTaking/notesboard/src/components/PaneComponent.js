import React, { Component } from 'react';

import Board from './paperComponent';

class Pane extends Component {
  render() {
    return (
        <div>
          <Board></Board>
        </div>
    );
  }
}

export default Pane;