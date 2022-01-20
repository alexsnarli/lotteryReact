//import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "0",
    value: "Enter value...",
    message: "",
    pickMessage: "",
  };

  async componentDidMount() {
    // this way we can run several async methods concurrently
    const [manager, players, balance] = await Promise.all([
      lottery.methods.manager().call(),
      lottery.methods.getPlayers().call(),
      lottery.methods.prizePool().call(),
    ]);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: " Waiting for confirmation on the blockchain... ",
    });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have entered the lottery! Good luck :) " });
  };

  onPickWinner = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({
      pickMessage: "Alright lets pick a winner!",
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({
      pickMessage: "And the winner is: me <3",
    });
  };

  render() {
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p> This contract is managed by {this.state.manager}</p>
        <p>
          {" "}
          There are currently {this.state.players.length} players entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}
          ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4> Want to try your luck? </h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h1> {this.state.message} </h1>

        <hr />

        <h4> Let's pick a winner! </h4>

        <button onClick={this.onPickWinner}>LETS GO!!</button>

        <h1> {this.state.pickMessage} </h1>

        <hr />
      </div>
    );
  }
}
export default App;
