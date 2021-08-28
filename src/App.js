
import Movies from './Components/Movies';
import About from './Components/About';
import Home from './Components/Home';
import Nav from './Nav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
function App() {
  return (
  <Router>
    <Nav/>
    <Switch>
    {/* WITHOUT exact : keep most precise path '/movies' or '/about' at top */}
    <Route path = '/' exact component = {Home}/>  

    <Route path = '/movies' component = {Movies}/>
    
    {/* <Route path = '/about' component = {About} isAuth = {true}/>  FOR NORMAL PROP PASS */}
    <Route path = './about' render = {(props) =>(
      <About {...props} isAuth = {true}/>
    )}/>
 
    {/* WITHOUT exact : move least precise path ie '/' home at bottom so switch will only come here if no other more specific path is matched with url */}
    </Switch>
  </Router>
    
  );
}

export default App;