import { useState, useEffect } from 'react';
import {ConfigProvider, Layout, Menu, Typography, Switch, theme} from 'antd';
import { SettingOutlined, ControlOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import ControlPage from './ControlPage';
import CalibrationPage from './CalibrationPage';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Export valve positions type globally for use in other components
export type ValvePosition = 'open' | 'neutral' | 'closed';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('control');
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        return stored === null ? true : stored === 'true';
    });


    const menuItems: MenuProps['items'] = [
    {
      key: 'control',
      icon: <ControlOutlined />,
      label: 'Control',
    },
    {
      key: 'calibration',
      icon: <SettingOutlined />,
      label: 'Calibration',
    },
  ];

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked);
        localStorage.setItem('darkMode', String(checked));
    };

  return (
      <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        <Layout style={{ minHeight: '66.66vh' }}>
          <Sider collapsed={collapsed} onCollapse={setCollapsed} theme={darkMode ? 'dark' : 'light'}>
            <div style={{ padding: '16px', color: darkMode ? 'white' : 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
              <strong>Navigation</strong>
                <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    checkedChildren={<MoonOutlined />}
                    unCheckedChildren={<SunOutlined />}
                    style={{ width: 40 }}
                />
            </div>
            <Menu
                theme={darkMode ? 'dark' : 'light'}
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={(e) => setSelectedKey(e.key)}
                items={menuItems}
            />
          </Sider>

          <Layout>
            <Header
                style={{
                  background: darkMode ? 'black' : 'white',
                  padding: 0,
                  paddingLeft: 16,
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
            >
              <Title level={3} style={{ marginTop: -15 }}>
                Group 3: Valve Control System
              </Title>
            </Header>

            <Content style={{ margin: '16px' }}>
              {selectedKey === 'control' && <ControlPage darkMode={darkMode} />}
              {selectedKey === 'calibration' && <CalibrationPage darkMode={darkMode} />}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
  );
};

export default App;
