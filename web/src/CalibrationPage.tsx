import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const CalibrationPage: React.FC = () => {
    return (
        <div>
            <Title level={4}>Calibration</Title>
            <p>This page is currently empty. It will be used to calibrate the positions of the server motor correlating to the state of the valves.</p>
        </div>
    );
};

export default CalibrationPage;
