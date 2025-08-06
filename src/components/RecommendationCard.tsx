import React from 'react';
import { Card, Button, Tag, Space, Badge } from 'antd';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CoffeeOutlined,
  StarOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Recommendation } from '../types';
import './RecommendationCard.css';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction?: (actionType: string, actionUrl?: string) => void;
  onClose?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAction,
  onClose
}) => {
  const { location, distance, reason, realTimeInfo, actionType, actionUrl } = recommendation;

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}米`;
    }
    return `${(meters / 1000).toFixed(1)}公里`;
  };

  const getActionButtonText = (actionType: string) => {
    switch (actionType) {
      case 'order':
        return '线上点单';
      case 'navigate':
        return '导航过去';
      case 'view':
        return '查看详情';
      case 'book':
        return '立即预约';
      default:
        return '了解更多';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'order':
        return <CoffeeOutlined />;
      case 'navigate':
        return <EnvironmentOutlined />;
      case 'view':
        return <RightOutlined />;
      case 'book':
        return <ClockCircleOutlined />;
      default:
        return <RightOutlined />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant':
        return '🍽️';
      case 'attraction':
        return '🎯';
      case 'facility':
        return '🏢';
      case 'entertainment':
        return '🎮';
      default:
        return '📍';
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction(actionType, actionUrl);
    }
  };

  return (
    <div className="recommendation-card-container">
      <Card 
        className="recommendation-card"
        size="small"
        extra={
          onClose && (
            <Button 
              type="text" 
              size="small" 
              onClick={onClose}
              className="close-button"
            >
              ×
            </Button>
          )
        }
      >
        <div className="card-header">
          <div className="location-info">
            <div className="location-icon">
              {getCategoryIcon(location.category)}
            </div>
            <div className="location-details">
              <h4 className="location-name">{location.name}</h4>
              <div className="location-meta">
                <Space size="small">
                  <span className="distance">
                    <EnvironmentOutlined />
                    {formatDistance(distance)}
                  </span>
                  {location.rating && (
                    <span className="rating">
                      <StarOutlined />
                      {location.rating}
                    </span>
                  )}
                </Space>
              </div>
            </div>
          </div>
        </div>

        <div className="card-content">
          <p className="reason-text">{reason}</p>
          
          {location.description && (
            <p className="description-text">{location.description}</p>
          )}

          {realTimeInfo && (
            <div className="realtime-info">
              {realTimeInfo.queueTime !== undefined && (
                <Badge 
                  count={`排队${realTimeInfo.queueTime}分钟`}
                  className="queue-badge"
                  style={{ 
                    backgroundColor: realTimeInfo.queueTime > 15 ? '#ff4d4f' : 
                                   realTimeInfo.queueTime > 8 ? '#fa8c16' : '#52c41a'
                  }}
                />
              )}
              
              {realTimeInfo.availableSeats !== undefined && (
                <Badge 
                  count={`空位${realTimeInfo.availableSeats}个`}
                  className="seats-badge"
                  style={{ backgroundColor: '#52c41a' }}
                />
              )}
              
              {realTimeInfo.specialOffer && (
                <Tag color="red" className="offer-tag">
                  {realTimeInfo.specialOffer}
                </Tag>
              )}
            </div>
          )}

          <div className="location-tags">
            {location.tags.slice(0, 2).map((tag, index) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <Button 
            type="primary" 
            size="small"
            icon={getActionIcon(actionType)}
            onClick={handleAction}
            className="action-button"
          >
            {getActionButtonText(actionType)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RecommendationCard;

