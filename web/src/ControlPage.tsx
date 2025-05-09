import React, { useEffect, useState, useRef } from 'react';
import ValveSwitch from './components/ValveSwitch';
import { ValvePosition } from './App';
import { Typography, Row, Col, Alert } from 'antd';

const { Paragraph } = Typography;

interface ControlPageProps {
    darkMode: boolean;
}

const ControlPage: React.FC<ControlPageProps> = ({darkMode}) => {
    const [valves, setValves] = useState<ValvePosition[]>(['neutral', 'neutral', 'neutral']);
    const pressedKeysRef = useRef<Set<string>>(new Set());
    
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

    const loadSavedAngle = (valveId: number, position: ValvePosition): number => {
        const key = `valve_${valveId}_${position}`;
        const val = localStorage.getItem(key);
        return val ? parseInt(val, 10) : 0;
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

    const setValve = (index: number, position: ValvePosition) => {
        const updated = [...valves];
        updated[index] = position;
        setValves(updated);
    };

    const angles = valves.map((pos, idx) =>
        pos === 'neutral' ? 0 : loadSavedAngle(idx, pos)
    );

    return (
        <div>
            <Row gutter={20} justify="center">
                {valves.map((pos, idx) => (
                        <Col key={idx}>
                            <ValveSwitch
                                name={`Valve ${idx + 1}`}
                                position={pos}
                                darkMode={darkMode}
                                valveId={idx}
                                keyUp={
                                    Object.entries(keyMap).find(
                                        ([, value]) => value.index === idx && value.position === 'open'
                                    )?.[0] || ''
                                }
                                keyDown={
                                    Object.entries(keyMap).find(
                                        ([, value]) => value.index === idx && value.position === 'closed'
                                    )?.[0] || ''
                                }
                                onChange={(newPos) => setValve(idx, newPos)}
                            />
                        </Col>
                ))}
            </Row>
            <br />
            <br />
        </div>
    );
};

export default ControlPage;
