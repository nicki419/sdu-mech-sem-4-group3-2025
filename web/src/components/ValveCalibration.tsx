import React, { useState } from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';

const { Text, Title } = Typography;

interface ValveCalibrationProps {
    valveName: string;
    darkMode: boolean;
}

const ValveCalibration: React.FC<ValveCalibrationProps> = ({ valveName, darkMode }) => {
    const [angle, setAngle] = useState(0);
    const [savedOpen, setSavedOpen] = useState<number | null>(null);
    const [savedReverse, setSavedReverse] = useState<number | null>(null);

    const textColor = darkMode ? '#ffffff' : '#000000';
    const gaugeColor = '#1890ff';

    const updateAngle = (delta: number) => {
        setAngle(prev => Math.max(-90, Math.min(90, prev + delta)));
    };

    const resetAngle = () => setAngle(0);

    const saveOpen = () => setSavedOpen(angle);
    const saveReverse = () => setSavedReverse(angle);

    return (
        <Card title={valveName} style={{ marginBottom: 24, width: '100%', padding: '8px 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {/* Speedometer */}
                <div style={{ textAlign: 'center', marginRight: 24 }}>
                    <div style={{ marginBottom: 8 }}>
                        <strong>0</strong>
                    </div>
                    <ReactSpeedometer
                        key={darkMode ? 'dark' : 'light'}
                        value={angle}
                        minValue={-90}
                        maxValue={90}
                        segments={18}
                        needleColor={gaugeColor}
                        startColor={gaugeColor}
                        endColor={gaugeColor}
                        textColor={textColor}
                        ringWidth={30}
                        width={200}
                        height={125}
                        customSegmentLabels={[
                            { text: "-90", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "-45", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "45", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "", position: CustomSegmentLabelPosition.Outside, color: textColor },
                            { text: "90", position: CustomSegmentLabelPosition.Outside, color: textColor, fontSize: "12px" },
                        ]}
                        currentValueText={`${angle}°`}
                    />
                </div>

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
                            <Button danger block onClick={saveReverse}>Save reverse</Button>
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
