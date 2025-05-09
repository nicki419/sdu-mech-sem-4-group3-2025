import React from 'react';
import { Button, Card } from 'antd';
import { UpOutlined, DownOutlined, PauseOutlined } from '@ant-design/icons';
import { ValvePosition } from '../App';
import Speedometer from "./Speedometer";

interface ValveSwitchProps {
    position: ValvePosition;
    name: string;
    darkMode: boolean;
    keyUp: string;
    keyDown: string;
    valveId: number;
    onChange: (pos: ValvePosition) => void;
}

const ValveSwitch: React.FC<ValveSwitchProps> = ({ position, name, darkMode, keyUp, keyDown, valveId, onChange }) => {
    // Helper to handle button press
    const setTo = (target: ValvePosition) => () => {
        onChange(target);
    };

    const getSavedAngle = (valveId: number, position: ValvePosition): number => {
        const key = `valve-${valveId}-${position}`;
        const savedValue = localStorage.getItem(key);

        if (savedValue) {
            console.log(`Reading angle for ${key} = ${savedValue}`);
            return parseInt(savedValue, 10);
        } else {
            console.log(`No saved angle for ${key}`);
            return 0; // Return a default value if none is found
        }
    };

    const angle = position === 'neutral' ? 0 : getSavedAngle(valveId, position);

    return (
        <Card  title={name} style={{ marginBottom: 24, padding: '8px 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {/* Speedometer */}
                <div style={{ transform: 'scale(0.9)', transformOrigin: 'center left' }}>
                    <Speedometer angle={angle} darkMode={darkMode} />
                </div>
                
                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* Key up indicator */}
                    <Button
                        disabled
                        style={{
                            width: 32,
                            height: 32,
                            padding: 0,
                            textAlign: 'center',
                            marginBottom: 8,
                        }}
                    >
                        {keyUp.toUpperCase()}
                    </Button>
        
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

                    {/* Key down indicator */}
                    <Button
                        disabled
                        style={{
                            width: 32,
                            height: 32,
                            padding: 0,
                            textAlign: 'center',
                            marginTop: 8,
                        }}
                    >
                        {keyDown.toUpperCase()}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ValveSwitch;
