import React from 'react';
import { Link } from "react-router-dom";

const AppointmentSuccess: React.FC = () => {
    return (
        <div style={{width: '600px', margin: '0 auto'}}>
            <h1>The appointment successfully scheduled</h1>
            <Link to="/public/appointment">Schedule again</Link>
        </div>

    )
};

export default AppointmentSuccess;
