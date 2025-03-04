import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from "./reducers/store";
import ProtectedRoute from './components/ProtectedRoute';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import CarTypes from './views/CarTypes';
import Bookings from './views/Bookings';
import Promos from './views/Promos';
import Users from './views/Users';
import Referral from './views/Referral';
import { fetchUser }  from "./actions/authactions";
import AuthLoading from './components/AuthLoading';
import Notifications from './views/Notifications';
import DriverEarning from './views/DriverEarning';
import Earningreports from './views/Earningreports';
import Dispatch from "./views/Dispatch";
function App() {
  store.dispatch(fetchUser());
  return (
    <Provider store={store}>
      <AuthLoading>
        <Router>
          <Switch>
            <ProtectedRoute exact component={Dashboard} path="/"/>
            <ProtectedRoute exact component={Dispatch} path="/dispatch"/>
            <ProtectedRoute exact component={CarTypes} path="/cartypes"/>
            <ProtectedRoute exact component={Bookings} path="/bookings"/>
            <ProtectedRoute exact component={Promos} path="/promos"/>
            <ProtectedRoute exact component={Users} path="/drivers"/>
            <ProtectedRoute exact component={DriverEarning} path="/driverearning"/>
            <ProtectedRoute exact component={Referral} path="/referral"/>
            <ProtectedRoute exact component={Notifications} path="/notifications"/>
            <ProtectedRoute exact component={Earningreports} path="/earningreports"/>
            <Route component={Login} path="/login"/>
          </Switch>
        </Router>
      </AuthLoading>
    </Provider>
  );
}

export default App;
