import React, { useEffect } from 'react';
import { Button, Card } from 'antd';
import { UpOutlined, DownOutlined, PauseOutlined } from '@ant-design/icons';
import { ValvePosition } from '../App';
import Speedometer from './Speedometer';
import { SerialManager } from '../utils/SerialManager';

interface ValveSwitchProps {
    position: ValvePosition;
    name: string;
    darkMode: boolean;
    keyUp: string;
    keyDown: string;
    valveId: number;
    onChange: (pos: ValvePosition) => void;
    serialManager: SerialManager;
}

const ValveSwitch: React.FC<ValveSwitchProps> = ({
                                                     position,
                                                     name,
                                                     darkMode,
                                                     keyUp,
                                                     keyDown,
                                                     valveId,
                                                     onChange,
                                                     serialManager,
                                                 }) => {
    // Helper to handle button press
    const setTo = (target: ValvePosition) => () => {
        onChange(target);
    };

    const getSavedAngle = (valveId: number, position: ValvePosition): number => {
        const key = `valve-${valveId}-${position}`;
        const savedValue = localStorage.getItem(key);
        return savedValue ? parseInt(savedValue, 10) : 0;
    };

    const angle = position === 'neutral' ? 0 : getSavedAngle(valveId, position);

    // Send serial message when position changes
    useEffect(() => {
        const angleValue = position === 'neutral' ? 0 : angle;

        if (serialManager.connected) {
            const message = `V${valveId}:${angleValue}`;
            serialManager.send(message);
        }
        
    }, [position, angle, valveId, serialManager]);

    return (
        <Card title={name} style={{ marginBottom: 24, padding: '8px 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ transform: 'scale(0.9)', transformOrigin: 'center left' }}>
                    <Speedometer angle={angle} darkMode={darkMode} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

                    <Button
                        type={position === 'open' ? 'primary' : 'default'}
                        icon={<UpOutlined />}
                        onClick={setTo('open')}
                        shape="circle"
                    />

                    <Button
                        type={position === 'neutral' ? 'primary' : 'default'}
                        icon={<PauseOutlined />}
                        onClick={setTo('neutral')}
                        shape="circle"
                        style={{ margin: '8px 0' }}
                    />

                    <Button
                        type={position === 'closed' ? 'primary' : 'default'}
                        icon={<DownOutlined />}
                        onClick={setTo('closed')}
                        shape="circle"
                    />

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
