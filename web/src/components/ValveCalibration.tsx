import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Switch } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Speedometer from './Speedometer';
import { SerialManager } from "../utils/SerialManager";

const { Text, Title } = Typography;

interface ValveCalibrationProps {
    valveId: number;
    darkMode: boolean;
    serialManager: SerialManager;
    sendLive: boolean;
}

const ValveCalibration: React.FC<ValveCalibrationProps> = ({ valveId, darkMode, serialManager, sendLive }) => {
    const [angle, setAngle] = useState(0);
    const [savedOpen, setSavedOpen] = useState<number | null>(null);
    const [savedReverse, setSavedReverse] = useState<number | null>(null);

    const storageKey = (type: 'open' | 'closed') => `valve-${valveId}-${type}`;

    // Load saved values on mount
    useEffect(() => {
        const open = localStorage.getItem(storageKey('open'));
        const reverse = localStorage.getItem(storageKey('closed'));

        if (open !== null) setSavedOpen(parseInt(open, 10));
        if (reverse !== null) setSavedReverse(parseInt(reverse, 10));
    }, [valveId]);

    // Send serial message when angle changes
    useEffect(() => {
        if (sendLive && serialManager.connected) {
            const message = `CALIBRATE:${valveId}:${angle}`;
            serialManager.send(message);
        }
    }, [angle, valveId, sendLive, serialManager]);

    const updateAngle = (delta: number) => {
        setAngle(prev => Math.max(-90, Math.min(90, prev + delta)));
    };

    const resetAngle = () => {
        setAngle(0);
        if (sendLive && serialManager.connected) {
            const message = `CALIBRATE:${valveId}:0`; // Send reset to Arduino
            serialManager.send(message);
        }
    };

    const saveOpen = () => {
        localStorage.setItem(storageKey('open'), angle.toString());
        setSavedOpen(angle);
    };

    const saveReverse = () => {
        localStorage.setItem(storageKey('closed'), angle.toString());
        setSavedReverse(angle);
    };

    const clearSaved = () => {
        localStorage.removeItem(storageKey('open'));
        localStorage.removeItem(storageKey('closed'));
        setSavedOpen(null);
        setSavedReverse(null);
    };

    return (
        <Card title={`Valve ${valveId + 1}`} style={{ marginBottom: 24, width: '100%', padding: '8px 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Speedometer angle={angle} darkMode={darkMode} />

                {/* Buttons */}
                <div style={{ flex: 1, paddingRight: 24 }}>
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }} align="middle" justify="start">
                        {[10, 5, 1].map(val => (
                            <Col key={`dec-${val}`} style={{ flex: 1, minWidth: 60 }}>
                                <Button block onClick={() => updateAngle(-val)}>-{val}°</Button>
                            </Col>
                        ))}
                        <Col style={{ flex: 1, minWidth: 60 }}>
                            <Button block icon={<ReloadOutlined />} onClick={resetAngle} />
                        </Col>
                        {[1, 5, 10].map(val => (
                            <Col key={`inc-${val}`} style={{ flex: 1, minWidth: 60 }}>
                                <Button block onClick={() => updateAngle(val)}>+{val}°</Button>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={8}>
                        <Col style={{ flex: 1, minWidth: 100 }}>
                            <Button type="primary" block onClick={saveOpen}>Save open</Button>
                        </Col>
                        <Col style={{ flex: 1, minWidth: 100 }}>
                            <Button type="primary" block onClick={saveReverse}>Save reverse</Button>
                        </Col>
                        <Col>
                            <Button danger ghost block onClick={clearSaved}>
                                Clear saved values
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Saved values */}
                <div style={{ minWidth: 140 }}>
                    <Card size="small" style={{ marginBottom: 8, textAlign: 'right' }}>
                        <Text type="secondary">Saved open</Text>
                        <Title level={4} style={{ margin: 0 }}>
                            {savedOpen !== null ? `${savedOpen}°` : '—'}
                        </Title>
                    </Card>
                    <Card size="small" style={{ textAlign: 'right' }}>
                        <Text type="secondary">Saved reverse</Text>
                        <Title level={4} style={{ margin: 0 }}>
                            {savedReverse !== null ? `${savedReverse}°` : '—'}
                        </Title>
                    </Card>
                </div>
            </div>
        </Card>
    );
};

export default ValveCalibration;
