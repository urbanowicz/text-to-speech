import React from 'react';

const speech = require('@google-cloud/speech');
const record = require('node-record-lpcm16');
const fs = require('fs');

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
  constructor(props) {
    super(props);
    this.state = {
      text: null,
    }
  }
  speech_to_text() {
    const client = new speech.SpeechClient();
    const encoding = 'LINEAR16';
    const sampleRateHertz = 16000;
    const languageCode = 'pl';
    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };

    const request = {
      config: config,
      interimResults: false,
    };

    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', data =>
        {
          let transcription = data.results[0] && data.results[0].alternatives[0]
            ? `${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`
          this.setState({text: transcription})}
      );

    record
      .start({
        sampleRateHertz: sampleRateHertz,
        threshold: 0,
        verbose: false,
        recordProgram: 'rec',
        silence: '10.0',
      })
      .on('error', console.error)
      .pipe(recognizeStream);
  }
  render() {
    return (<div>
      <h2>Speech to Text Conversion for Patients</h2>
      <RecordButton onClick={() => this.speech_to_text()} />
      <p>{this.state.text}</p>
    </div>);
  }
}
