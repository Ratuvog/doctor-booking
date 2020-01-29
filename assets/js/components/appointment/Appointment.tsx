import React from 'react';
import AppointmentForm from "./appointment-form/AppointmentForm";
import { useHistory } from "react-router-dom";
import {appointments} from "../../api";
import {notification} from "antd";

const Appointment = () => {
    const history = useHistory();

    return (
        <div style={{width: '600px', margin: '0 auto'}}>
            <h1>Appointment page</h1>
            <div style={{background: '#eeeeee', padding: '24px'}}>
                <AppointmentForm />
            </div>
        </div>
    )
};

export default Appointment;
