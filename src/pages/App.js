import React, { Component } from "react"
import { Provider } from "react-redux"
import Interface from "../components/interface.js"
import store from "../models/store"
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Interface />
      </Provider>
    )
  }
}

export default App
