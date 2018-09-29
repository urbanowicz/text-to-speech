import React from 'react';

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
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
    console.log("-> Requsting transcription from cloud.google.com");
    const client = new speech.SpeechClient();
    const fileName = './resources/u.flac';
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'FLAC',
      sampleRateHertz: 44100,
      languageCode: 'pl',
    };
    const request = {
      audio: audio,
      config: config,
    };

    client
      .recognize(request)
      .then(data => {
        const response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        this.setState({text: transcription});
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }
  render() {
    return (<div>
      <h2>Speech to Text Conversion for Patients</h2>
      <RecordButton onClick={() => this.speech_to_text()} />
      <p>{this.state.text}</p>
    </div>);
  }
}
