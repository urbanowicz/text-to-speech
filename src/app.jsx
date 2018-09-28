import React from 'react';

function RecordButton(props) {
  return (
    <button
      className="RecordButton"
      onClick={props.onClick}
    >
      Start Interview
    </button>
  )
}
export default class App extends React.Component {
  handle_click() {
    console.log("BUTTON CLICKED")
  }
  render() {
    return (<div>
      <h2>Speech to Text Conversion for Patients</h2>
      <RecordButton onClick={() => this.handle_click()} />
    </div>);
  }
}
