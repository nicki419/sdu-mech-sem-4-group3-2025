// CalibrationPage.tsx
import React from 'react';
import { Typography } from 'antd';
import ValveCalibration from './components/ValveCalibration';

const { Title } = Typography;

interface CalibrationPageProps {
    darkMode: boolean;
}

const CalibrationPage: React.FC<CalibrationPageProps> = ({ darkMode }) => {
    return (
        <div>
            <Title level={4}>Calibration</Title>
            <p>Use the controls below to calibrate the angle for each valve's motor.</p>
            <ValveCalibration valveId={0} darkMode={darkMode} />
            <ValveCalibration valveId={1} darkMode={darkMode} />
            <ValveCalibration valveId={2} darkMode={darkMode} />
        </div>
    );
};

export default CalibrationPage;
