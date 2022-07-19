import React, { Component } from 'react';
import './App.css';
import Poruke from "./Komponente/Poruke";
import Unos from "./Komponente/Unos";

function randomIme() {
  const imena = [
    "Mario ", "Toni ", "Dario ", "Ivan ", "Sandi ", "Marko ", "Matija ", "Luka ",
    "Antonijo ", "Ante ", "Filip ", "Rene ", "Tin ", "Ivano ", "Marijan ", "Tomislav ",
    "Darijan ", "Marinko", "Marin ", "Antun ", "Matija ",

  ];
  const prezimena = [
    "Ivanić", "Rajnović ", "Ivić ", "Kovač ", "Marić", "Lulić", "Kovačević", "Horvat", "Knežević", "Pavlović", "Blažević", "Lovrić", "Babić", "Grgić"
  ];
  const ime = imena[Math.floor(Math.random() * imena.length)];
  const prezime = prezimena[Math.floor(Math.random() * prezimena.length)];
  return ime + prezime;
}

function randomBoja() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomIme(),
      color: randomBoja(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("kbnFsdG15ENCt7Bd", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React chat aplikacija</h1>
        </div>
        <Poruke
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Unos
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
