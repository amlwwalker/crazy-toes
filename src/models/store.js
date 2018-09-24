import * as models from "./models"

import { createLogger } from "redux-logger"
import { init } from "@rematch/core"

const logger = createLogger({ collapsed: true })

// const middlewares = ["dev", "local", "staging"].includes(
//   process.env.REACT_APP_ENV
// )
//   ? [logger]
//   : []

const store = init({
  models
})

const hydrate = () => {
  const { dispatch } = store
  dispatch.game.hydrate()
  // dispatch.rates.hydrate()
}
hydrate()

export default store
