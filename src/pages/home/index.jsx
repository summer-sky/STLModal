import React, { PureComponent } from 'react';
import { VirtualDrive } from './virtual';

class Drive extends PureComponent {

  componentDidMount() {
    const container = document.getElementById('body');
    new VirtualDrive(container);
  }

  render() {
    return <div id="body" style={{ height: window.innerHeight-10 }} />;
  }
}

export default Drive;
