import React from 'react';
import { Button } from 'antd';
import { UpOutlined, DownOutlined, PauseOutlined } from '@ant-design/icons';
import { ValvePosition } from './App';

interface ValveSwitchProps {
    label: string;
    position: ValvePosition;
    onChange: (pos: ValvePosition) => void;
}

const ValveSwitch: React.FC<ValveSwitchProps> = ({ label, position, onChange }) => {
    // Helper to handle button press
    const setTo = (target: ValvePosition) => () => {
        onChange(target);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 8 }}>{label}</div>

            {/* Button to switch to 'open' */}
            <Button
                type={position === 'open' ? 'primary' : 'default'}
                icon={<UpOutlined />}
                onClick={setTo('open')}
                shape="circle"
            />

            {/* Button to switch to 'neutral' */}
            <Button
                type={position === 'neutral' ? 'primary' : 'default'}
                icon={<PauseOutlined />}
                onClick={setTo('neutral')}
                shape="circle"
                style={{ margin: '8px 0' }}
            />

            {/* Button to switch to 'closed' */}
            <Button
                type={position === 'closed' ? 'primary' : 'default'}
                icon={<DownOutlined />}
                onClick={setTo('closed')}
                shape="circle"
            />
        </div>
    );
};

export default ValveSwitch;
