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
      text: [],
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
            console.log(transcription)
          this.setState({
            text: this.state.text.concat({line:transcription})
          });
        }
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
    const text = this.state.text;
    console.log(this.state.text);
    let interview = []
    if (text.length > 0) {
      for(let i = 0; i < text.length; i++) {
        interview.push((<p key={i}>{text[i].line}</p>));
      }
    }
    return (<div>
      <h2>Speech to Text</h2>
      <RecordButton onClick={() => this.speech_to_text()} />
      <div>{interview}</div>
    </div>);
  }
}
