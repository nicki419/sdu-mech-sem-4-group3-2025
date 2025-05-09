import React, { useEffect, useState, useRef } from 'react';
import ValveSwitch from './components/ValveSwitch';
import { ValvePosition } from './App';
import { Typography, Row, Col, Alert } from 'antd';
import ArduinoStatusPanel from "./components/ArduinoStatusPanel";
import { SerialManager } from './utils/SerialManager';

const { Paragraph } = Typography;

interface ControlPageProps {
    darkMode: boolean;
}

const ControlPage: React.FC<ControlPageProps> = ({ darkMode }) => {
    const [valves, setValves] = useState<ValvePosition[]>(['neutral', 'neutral', 'neutral']);
    const pressedKeysRef = useRef<Set<string>>(new Set());
    const [serialManager] = useState(() => new SerialManager());

    const keyMap: Record<string, { index: number; position: ValvePosition }> = {
        a: { index: 0, position: 'open' },
        s: { index: 1, position: 'open' },
        d: { index: 2, position: 'open' },
        j: { index: 0, position: 'closed' },
        k: { index: 1, position: 'closed' },
        l: { index: 2, position: 'closed' },
    };

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
            const key = e.key.toLowerCase();
            if (!keyMap[key]) return;
            const updated = new Set(pressedKeysRef.current);
            if (!updated.has(key)) {
                updated.add(key);
                pressedKeysRef.current = updated;
                updateValvesFromKeys(updated);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (!keyMap[key]) return;
            const updated = new Set(pressedKeysRef.current);
            if (updated.has(key)) {
                updated.delete(key);
                pressedKeysRef.current = updated;
                updateValvesFromKeys(updated);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div>
            <Row gutter={[20, 20]} align="top" justify="start" style={{marginTop: -20}}>
                <Col>
                    <ArduinoStatusPanel serial={serialManager} darkMode={darkMode} />
                </Col>
            </Row>
            
            <Row gutter={20} justify="start" style={{marginTop: 20}}>
                {valves.map((pos, idx) => (
                    <Col key={idx}>
                        <ValveSwitch
                            name={`Valve ${idx + 1}`}
                            position={pos}
                            darkMode={darkMode}
                            valveId={idx}
                            keyUp={Object.entries(keyMap).find(([ , value]) => value.index === idx && value.position === 'open')?.[0] || ''}
                            keyDown={Object.entries(keyMap).find(([ , value]) => value.index === idx && value.position === 'closed')?.[0] || ''}
                            onChange={(newPos) => setValves((prev) => {
                                const updated = [...prev];
                                updated[idx] = newPos;
                                return updated;
                            })}
                            serialManager={serialManager}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ControlPage;
