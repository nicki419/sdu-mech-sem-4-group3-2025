import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Tag } from 'antd';
import { UsbOutlined, DisconnectOutlined, LoadingOutlined } from '@ant-design/icons';
import { SerialManager } from "../utils/SerialManager";

const { Text } = Typography;

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface ArduinoStatusPanelProps {
    serial: SerialManager;
    serialLog: string[];
    setSerialLog: React.Dispatch<React.SetStateAction<string[]>>;
}

const ArduinoStatusPanel: React.FC<ArduinoStatusPanelProps> = ({ serial, serialLog, setSerialLog }) => {
    const [status, setStatus] = useState<ConnectionStatus>(
        serial.connected ? 'connected' : 'disconnected'
    );

    useEffect(() => {
        // Update status when SerialManager changes
        if (serial.connected) {
            setStatus('connected');
        } else {
            setStatus('disconnected');
        }
    }, [serial.connected]);

    useEffect(() => {
        serial.onConnectionChange((connected) => {
            setStatus(connected ? 'connected' : 'disconnected');
        });
    }, [serial]);


    const logEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        serial.onReceive((data: string) => {
            // Process incoming serial messages, e.g., V1: 45° or V1: 0°
            if (data.startsWith('V') && data.includes(':')) {
                const match = data.match(/V(\d+):/);
                if (match) {
                    const incrementedValue = parseInt(match[1], 10) + 1;
                    const updatedData = data.replace(/V(\d+):/, `V${incrementedValue}:`);
                    setSerialLog((prevLog) => [...prevLog, `[INFO] ${updatedData}`]);
                }
            }
        });
    }, [serial]);

    const handleConnect = async () => {
        setStatus('connecting');
        try {
            await serial.connect();
            setSerialLog((log) => [...log, '[INFO] Connected to Arduino.']);
            setStatus('connected');
        } catch (e) {
            setSerialLog((log) => [...log, `[ERROR] ${e}`]);
            setStatus('disconnected');
        }
    };

    const handleDisconnect = async () => {
        await serial.disconnect();
        setSerialLog((log) => [...log, '[INFO] Disconnected.']);
        setStatus('disconnected');
    };

    const renderStatusTag = () => {
        switch (status) {
            case 'disconnected':
                return <Tag color="red">Disconnected</Tag>;
            case 'connecting':
                return <Tag color="orange" icon={<LoadingOutlined spin />}>Connecting...</Tag>;
            case 'connected':
                return <Tag color="green">Connected</Tag>;
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [serialLog]); // Trigger auto-scroll when the log updates

    return (
        <Card title="Arduino Connection" style={{ width: 330 }}>
            <div style={{ marginBottom: 12 }}>
                <Text strong>Status: </Text>
                {renderStatusTag()}
            </div>

            {(status === 'disconnected' || status === 'connecting') && (
                <Button type="primary" icon={<UsbOutlined />} onClick={handleConnect} disabled={status === 'connecting'} block>
                    Connect
                </Button>
            )}

            {status === 'connected' && (
                <Button type="default" danger icon={<DisconnectOutlined />} onClick={handleDisconnect} block>
                    Disconnect
                </Button>
            )}

            <div
                style={{
                    marginTop: 16,
                    height: 100,
                    backgroundColor: '#000',
                    color: '#0f0',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    padding: 8,
                    overflowY: 'auto',
                    border: '1px solid #333',
                    borderRadius: 4,
                }}
            >
                {serialLog.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
                {/* This div ensures the monitor auto-scrolls */}
                <div ref={logEndRef} />
            </div>
        </Card>
    );
};

export default ArduinoStatusPanel;
