import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Appointment from './components/appointment/Appointment';
import AppointmentSuccess from "./components/appointment-success/AppointmentSuccess";

ReactDOM.render(
    <Router>
        <div>
            <Switch>
                <Route path='/public/appointment/success'>
                    <AppointmentSuccess />
                </Route>
                <Route path='/public/appointment'>
                    <Appointment />
                </Route>

            </Switch>
        </div>
    </Router>,
    document.getElementById('root')
);