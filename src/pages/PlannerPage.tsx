import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Slider, 
  Button, 
  Space, 
  message, 
  Spin,
  Empty,
  Divider,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RouteRequest, GeneratedRoute, Location } from '../types';
import { getLocations, generateRoute, saveRoute } from '../services/api';
import { preferenceOptions } from '../utils/mockData';
import RouteTimeline from '../components/RouteTimeline';
import './PlannerPage.css';

const { Title, Text } = Typography;
const { Option } = Select;

const PlannerPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const response = await getLocations();
      if (response.success && response.data) {
        setLocations(response.data);
      } else {
        message.error('加载地点信息失败');
      }
    } catch (error) {
      message.error('加载地点信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoute = async (values: any) => {
    setGenerating(true);
    try {
      const request: RouteRequest = {
        destination: values.destination,
        preferences: values.preferences || [],
        estimatedDuration: values.estimatedDuration,
        startTime: values.startTime
      };

      const response = await generateRoute(request);
      if (response.success && response.data) {
        setGeneratedRoute(response.data);
        message.success('路线生成成功！');
      } else {
        message.error(response.error || '生成路线失败');
      }
    } catch (error) {
      message.error('生成路线失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!generatedRoute) return;
    
    try {
      const response = await saveRoute(generatedRoute.id);
      if (response.success) {
        setGeneratedRoute(prev => prev ? { ...prev, isSaved: true } : null);
        message.success('路线保存成功！');
      } else {
        message.error('保存路线失败');
      }
    } catch (error) {
      message.error('保存路线失败');
    }
  };

  const handleShareRoute = () => {
    if (!generatedRoute) return;
    
    // 生成分享链接
    const shareUrl = `${window.location.origin}/route/${generatedRoute.id}`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl).then(() => {
      message.success('分享链接已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制链接');
    });
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    location.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderInputForm = () => (
    <Card className="input-form-card">
      <div className="form-header">
        <Title level={3}>智能路线规划</Title>
        <Text type="secondary">告诉我您想去哪里，我来为您规划最佳路线</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleGenerateRoute}
        className="route-form"
      >
        <Form.Item
          label="目的地"
          name="destination"
          rules={[{ required: true, message: '请输入目的地' }]}
        >
          <Select
            showSearch
            placeholder="搜索或选择目的地"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
            onSearch={setSearchValue}
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          >
            {filteredLocations.map(location => (
              <Option key={location.id} value={location.name}>
                <div className="location-option">
                  <span className="location-name">{location.name}</span>
                  <span className="location-category">{location.category}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="参观偏好"
          name="preferences"
        >
          <Select
            mode="multiple"
            placeholder="选择您的参观偏好"
            optionLabelProp="label"
            maxTagCount={3}
          >
            {preferenceOptions.map(pref => (
              <Option key={pref} value={pref} label={pref}>
                {pref}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="预计停留时间"
          name="estimatedDuration"
        >
          <Slider
            min={1}
            max={8}
            marks={{
              1: '1小时',
              2: '2小时',
              4: '4小时',
              6: '6小时',
              8: '8小时'
            }}
            tooltip={{
              formatter: (value) => `${value}小时`
            }}
          />
        </Form.Item>

        <Form.Item
          label="开始时间"
          name="startTime"
        >
          <Select placeholder="选择开始时间">
            <Option value="08:00">08:00</Option>
            <Option value="09:00">09:00</Option>
            <Option value="10:00">10:00</Option>
            <Option value="11:00">11:00</Option>
            <Option value="13:00">13:00</Option>
            <Option value="14:00">14:00</Option>
            <Option value="15:00">15:00</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={generating}
            icon={<SearchOutlined />}
            className="generate-button"
          >
            {generating ? '正在生成路线...' : '生成我的专属路线'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderRouteResult = () => (
    <div className="route-result">
      <div className="result-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setGeneratedRoute(null)}
          className="back-button"
        >
          重新规划
        </Button>
        <Title level={4}>您的专属路线</Title>
      </div>
      
      {generatedRoute && (
        <RouteTimeline
          nodes={generatedRoute.nodes}
          onSave={handleSaveRoute}
          onShare={handleShareRoute}
          isSaved={generatedRoute.isSaved}
        />
      )}
    </div>
  );

  return (
    <div className="planner-page">
      <div className="planner-container">
        {!generatedRoute ? renderInputForm() : renderRouteResult()}
      </div>
    </div>
  );
};

export default PlannerPage; 