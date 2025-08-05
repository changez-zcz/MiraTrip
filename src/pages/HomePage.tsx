import React from 'react';
import { Layout, Row, Col, Image, Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  CompassOutlined, 
  GlobalOutlined, 
  BookOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import TripInputForm from '../components/TripInputForm';
import { TripFormData } from '../types';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

interface HomePageProps {
  onSubmit: (formData: TripFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ onSubmit, loading = false }) => {
  const navigate = useNavigate();

  const handleNavigateToPlanner = () => {
    navigate('/planner');
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <Content style={{ 
        padding: '20px 0', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Row justify="center" align="middle" style={{ width: '100%' }}>
          <Col xs={23} sm={22} md={18} lg={16} xl={14} xxl={12}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Image 
                src="https://img.icons8.com/fluency/96/null/around-the-globe.png"
                alt="旅行计划"
                preview={false}
                style={{ width: 80, height: 80 }}
              />
              <Title level={2} style={{ marginTop: 16, color: '#262626' }}>
                妙游 MiraTrip
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                智能旅行规划，让每一次出行都成为美好回忆
              </Text>
            </div>

            {/* 功能导航卡片 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 16, 
              marginBottom: 32,
              flexWrap: 'wrap'
            }}>
              <Button
                type="primary"
                size="large"
                icon={<CompassOutlined />}
                onClick={handleNavigateToPlanner}
                style={{
                  height: 60,
                  padding: '0 24px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                }}
              >
                智能路线规划
              </Button>
              
              <Button
                size="large"
                icon={<GlobalOutlined />}
                style={{
                  height: 60,
                  padding: '0 24px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  border: '2px solid #667eea',
                  color: '#667eea'
                }}
              >
                城市旅行规划
              </Button>
              
              <Button
                size="large"
                icon={<BookOutlined />}
                style={{
                  height: 60,
                  padding: '0 24px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  border: '2px solid #667eea',
                  color: '#667eea'
                }}
              >
                旅行日记生成
              </Button>
            </div>

            <TripInputForm onSubmit={onSubmit} loading={loading} />
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '12px' }}>
        妙游 MiraTrip ©{new Date().getFullYear()} 智能旅行规划助手
      </Footer>
    </Layout>
  );
};

export default HomePage;