import './App.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AdminContainer from './Page/Admin/AdminContainer';
import UserContainer from './Page/User/UserContainer';
import Login from './Page/LogPage/Login';
import { useState, useEffect } from 'react'
import ModalChangePasswordFirstLogin from './Page/LogPage/ModalChangePasswordFirstLogin';
import Notfound from './Page/Notfound';

function App() {
  const [userLogin, setUserLogin] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserLogin(true)
      if (!localStorage.getItem("userLastLogin") || localStorage.getItem('userLastLogin') === 'null') {
        setIsFirstLogin(true)
      }
      else {
        setIsFirstLogin(false)
      }
    }
    else {
      setUserLogin(false)
      setIsFirstLogin(false)
    }
  }, [])

  return (
    <div>
      <ModalChangePasswordFirstLogin isFirstLogin={isFirstLogin} setIsFirstLogin={setIsFirstLogin} />
      <Router>

        <Switch>
          <Route exact path="/">
            <Redirect to="/user" />
          </Route>

          <Route path="/user">
            <UserContainer userLogin={userLogin} setUserLogin={setUserLogin} />
          </Route>

          <Route path="/admin">
            <AdminContainer userLogin={userLogin} setUserLogin={setUserLogin} />
          </Route>

          <Route path="/login">
            <Login userLogin={userLogin} setUserLogin={setUserLogin} setIsFirstLogin={setIsFirstLogin} />
          </Route>

          <Route component={Notfound}/>

        </Switch>
      </Router>
      </div>

      );
}

      export default App;
