import React, { useEffect, useRef, useState } from 'react';
import { Slider, Typography, Row, Col, Card } from 'antd';
import { SerialManager } from '../utils/SerialManager';
import debounce from 'lodash.debounce';

const { Title } = Typography;

interface PumpThrottleProps {
  serialManager: SerialManager;
}

const PumpThrottle: React.FC<PumpThrottleProps> = ({ serialManager }) => {
  const [throttle, setThrottle] = useState<number>(0);
  const prevThrottleRef = useRef<number>(-1); // track previous value to avoid repeat sends

  const sendThrottleCommand = (value: number) => {
    if (serialManager.connected && value !== prevThrottleRef.current) {
      const command = `p:${value}`;
      serialManager.send(command);
      prevThrottleRef.current = value;
    }
  };

  // Debounced version of the function
  const debouncedSend = useRef(debounce(sendThrottleCommand, 500)).current;

  const handleSliderChange = (value: number) => {
    setThrottle(value);
    debouncedSend(value);
  };

  useEffect(() => {
    return () => {
      debouncedSend.cancel();
    };
  }, [debouncedSend]);

  return (
    <Card title="Pump Throttle" style={{ marginTop: 20, width: 200 }}>
      <Row align="middle" justify="space-between">
        <Col>
          <Slider
            vertical
            min={0}
            max={100}
            step={1}
            value={throttle}
            onChange={handleSliderChange}
            style={{ height: 160 }}
          />
        </Col>
        <Col>
          <Title level={2} style={{ marginLeft: 20 }}>
            {throttle}%
          </Title>
        </Col>
      </Row>
    </Card>
  );
};

export default PumpThrottle;
