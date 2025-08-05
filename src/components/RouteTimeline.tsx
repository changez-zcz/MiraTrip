import React from 'react';
import { Timeline, Card, Tag, Button, Space, Alert } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { RouteNode } from '../types';
import './RouteTimeline.css';

interface RouteTimelineProps {
  nodes: RouteNode[];
  onSave?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
}

const RouteTimeline: React.FC<RouteTimelineProps> = ({ 
  nodes, 
  onSave, 
  onShare, 
  isSaved = false 
}) => {
  const formatTime = (time: string) => {
    return time;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
  };

  const getAlertIcon = (type: 'info' | 'warning') => {
    return type === 'warning' ? <WarningOutlined /> : <InfoCircleOutlined />;
  };

  const getAlertColor = (type: 'info' | 'warning') => {
    return type === 'warning' ? 'orange' : 'blue';
  };

  return (
    <div className="route-timeline">
      <Card 
        title={
          <div className="timeline-header">
            <ClockCircleOutlined className="timeline-icon" />
            <span>智能路线规划</span>
          </div>
        }
        extra={
          <Space>
            {onSave && (
              <Button 
                type={isSaved ? "default" : "primary"}
                onClick={onSave}
                disabled={isSaved}
              >
                {isSaved ? '已保存' : '保存路线'}
              </Button>
            )}
            {onShare && (
              <Button onClick={onShare}>
                分享路线
              </Button>
            )}
          </Space>
        }
        className="timeline-card"
      >
        <Timeline
          mode="left"
          items={nodes.map((node, index) => ({
            color: index === 0 ? 'green' : 'blue',
            children: (
              <div className="timeline-item">
                <div className="timeline-time">
                  <ClockCircleOutlined />
                  <span className="time-text">{formatTime(node.time)}</span>
                  <span className="duration-text">({formatDuration(node.estimatedDuration)})</span>
                </div>
                
                <Card className="location-card" size="small">
                  <div className="location-header">
                    <EnvironmentOutlined className="location-icon" />
                    <h4 className="location-name">{node.location.name}</h4>
                    <div className="location-rating">
                      {node.location.rating && (
                        <span className="rating">⭐ {node.location.rating}</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="location-description">{node.location.description}</p>
                  
                  <div className="location-tags">
                    {node.location.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Tag key={tagIndex} color="blue" size="small">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  
                  <div className="activity-section">
                    <h5>活动建议</h5>
                    <p className="activity-text">{node.activity}</p>
                  </div>
                  
                  {node.alert && (
                    <Alert
                      message={node.alert.message}
                      type={node.alert.type === 'warning' ? 'warning' : 'info'}
                      icon={getAlertIcon(node.alert.type)}
                      showIcon
                      className="timeline-alert"
                    />
                  )}
                  
                  <div className="location-status">
                    <span className={`status-badge ${node.location.currentStatus || 'open'}`}>
                      {node.location.currentStatus === 'closed' ? '已关闭' : 
                       node.location.currentStatus === 'maintenance' ? '维护中' : '开放中'}
                    </span>
                    {node.location.crowdLevel && (
                      <span className={`crowd-badge ${node.location.crowdLevel}`}>
                        {node.location.crowdLevel === 'high' ? '人流密集' :
                         node.location.crowdLevel === 'medium' ? '人流适中' : '人流较少'}
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            ),
          }))}
        />
        
        <div className="timeline-summary">
          <div className="summary-item">
            <span className="summary-label">总时长：</span>
            <span className="summary-value">
              {formatDuration(nodes.reduce((sum, node) => sum + node.estimatedDuration, 0))}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">地点数量：</span>
            <span className="summary-value">{nodes.length}个</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RouteTimeline; 