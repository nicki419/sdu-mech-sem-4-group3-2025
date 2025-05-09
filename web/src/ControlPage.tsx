import React, { useEffect, useState } from 'react';
import ValveSwitch from './components/ValveSwitch';
import { ValvePosition } from './App';
import { Typography, Row, Col, Alert } from 'antd';

const { Paragraph } = Typography;

const ControlPage: React.FC = () => {
    const [valves, setValves] = useState<ValvePosition[]>(['neutral', 'neutral', 'neutral']);
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    // Map keyboard keys to valve control
    const keyMap: Record<string, { index: number; position: ValvePosition }> = {
        a: { index: 0, position: 'open' },
        s: { index: 1, position: 'open' },
        d: { index: 2, position: 'open' },
        j: { index: 0, position: 'closed' },
        k: { index: 1, position: 'closed' },
        l: { index: 2, position: 'closed' },
    };

    // Recalculate valve positions based on currently pressed keys
    const updateValvesFromKeys = (keys: Set<string>) => {
        const newValves: ValvePosition[] = ['neutral', 'neutral', 'neutral'];

        keys.forEach((key) => {
            const mapping = keyMap[key.toLowerCase()];
            if (mapping) {
                newValves[mapping.index] = mapping.position;
            }
        });

        setValves(newValves);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!keyMap[e.key.toLowerCase()]) return;
            setPressedKeys((prev) => {
                const updated = new Set(prev);
                updated.add(e.key.toLowerCase());
                updateValvesFromKeys(updated);
                return updated;
            });
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!keyMap[e.key.toLowerCase()]) return;
            setPressedKeys((prev) => {
                const updated = new Set(prev);
                updated.delete(e.key.toLowerCase());
                updateValvesFromKeys(updated);
                return updated;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const setValve = (index: number, position: ValvePosition) => {
        const updated = [...valves];
        updated[index] = position;
        setValves(updated);
    };

    return (
        <div>
            <Row gutter={32} justify="center">
                {valves.map((pos, idx) => (
                    <Col key={idx}>
                        <ValveSwitch
                            label={`Valve ${idx + 1}`}
                            position={pos}
                            onChange={(newPos) => setValve(idx, newPos)}
                        />
                    </Col>
                ))}
            </Row>
            <br />
            <br />
            <Alert
                message="Keyboard Controls"
                description={
                    <Paragraph>
                        Hold <strong>A/S/D</strong> to set Valve 1–3 to <strong>Open</strong><br />
                        Hold <strong>J/K/L</strong> to set Valve 1–3 to <strong>Closed</strong><br />
                        Releasing the key will return it to <strong>Neutral</strong>
                        <br />
                        <br />
                        <strong>Clicking the buttons</strong> will set the valves to the corresponding position permanently.
                        Pressing any of the above buttons will override the button state.
                    </Paragraph>
                }
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />
        </div>
    );
};

export default ControlPage;
