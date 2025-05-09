import React, { useState } from 'react';
import { Typography, Card, Switch } from 'antd';
import ValveCalibration from './components/ValveCalibration';
import { SerialManager } from './utils/SerialManager';

const { Title, Paragraph } = Typography;

interface CalibrationPageProps {
    darkMode: boolean;
    serialManager: SerialManager;
    serialLog: string[];
    setSerialLog: React.Dispatch<React.SetStateAction<string[]>>;
}

const CalibrationPage: React.FC<CalibrationPageProps> = ({ darkMode, serialManager }) => {
    const [sendLive, setSendLive] = useState(false);

    return (
        <div>
            <Title level={4}>Calibration</Title>
            <Paragraph>
                Use the controls below to calibrate the angle for each valve's motor. Values are saved in the browser's storage only, and won't persist across browsers or devices.
            </Paragraph>

            <Card style={{ marginBottom: 24 }}>
                <Switch
                    checked={sendLive}
                    onChange={setSendLive}
                    style={{ marginRight: 12 }}
                />
                <strong>Send to Arduino</strong>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                    When activated, commands will be sent to the Arduino as you press the buttons, so you can calibrate live. Leave deactivated if you already know your values and just input them.
                </Paragraph>
            </Card>

            {[0, 1, 2].map(id => (
                <ValveCalibration
                    key={id}
                    valveId={id}
                    darkMode={darkMode}
                    serialManager={serialManager}
                    sendLive={sendLive}
                />
            ))}
        </div>
    );
};

export default CalibrationPage;
