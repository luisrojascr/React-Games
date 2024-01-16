import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { MainModule } from 'modules'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/dice" component={MainModule} />
      </Switch>
    </Router>
  )
}

export default App
