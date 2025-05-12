import { useEffect, useState } from 'react';
import { Typography, Spin, Alert } from 'antd';

const { Title, Paragraph } = Typography;

const ArduinoPage = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/nicki419/sdu-mech-sem-4-group3-2025/main/Arduino_Code/Arduino_Code.ino')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch Arduino code. Find it here: https://github.com/nicki419/sdu-mech-sem-4-group3-2025');
                }
                return res.text();
            })
            .then((text) => {
                setCode(text);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <Spin tip="Loading Arduino code..." />;
    if (error) return <Alert message="Error" description={error} type="error" showIcon />;

    return (
        <Typography>
            <Title level={4}>Arduino Sketch</Title>
            <Paragraph>
        <pre>
          <code>{code}</code>
        </pre>
            </Paragraph>
        </Typography>
    );
};

export default ArduinoPage;
