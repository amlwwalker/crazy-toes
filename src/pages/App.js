import React, { Component } from "react"
import Interface from "../components/interface.js"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null
    }
  }

  render() {
    return <Interface />
  }
}

export default App
