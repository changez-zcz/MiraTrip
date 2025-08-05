// 用户输入表单类型
export interface TripFormData {
  city: string;
  startDate: string;
  endDate: string;
  travelDays: number;
  transportation: string;
  accommodation: string;
  preferences: string[];
  freeTextInput: string;
}

// 旅行计划类型
export interface TripPlan {
  city: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  weatherInfo: WeatherInfo[];
  overallSuggestions: string;
}

// 单日行程类型
export interface DayPlan {
  date: string;
  dayIndex: number;
  attractions: Attraction[];
  meals: Meal[];
  transportation: string;
  accommodation: string;
  description: string;
}

// 景点类型
export interface Attraction {
  name: string;
  address: string;
  location: {
    longitude: number;
    latitude: number;
  };
  visitDuration: number; // 单位：分钟
  description: string;
  imageUrl?: string;
  rating?: number;
  category?: string;
}

// 餐饮类型
export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  address?: string;
  location?: {
    longitude: number;
    latitude: number;
  };
  description?: string;
}

// 天气信息类型
export interface WeatherInfo {
  date: string;
  dayWeather: string;
  nightWeather: string;
  dayTemp: number;
  nightTemp: number;
  winddirection: string;
  windpower: string;
}

// 硅基流动API响应类型
export interface DeepseekResponse {
  result: string;
  tripPlan: TripPlan;
}

// ========== 妙游应用新增类型定义 ==========

// 用户账户类型
export interface User {
  id: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
}

// 园区地点类型
export interface Location {
  id: string;
  name: string;
  category: 'attraction' | 'restaurant' | 'facility' | 'entertainment';
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  imageUrl?: string;
  rating?: number;
  visitDuration?: number; // 预计参观时间（分钟）
  tags: string[]; // 标签，如"科技体验"、"亲子互动"等
  isPopular?: boolean;
  currentStatus?: 'open' | 'closed' | 'maintenance';
  crowdLevel?: 'low' | 'medium' | 'high'; // 人流密度
}

// 路线规划请求类型
export interface RouteRequest {
  destination: string;
  preferences: string[];
  estimatedDuration?: number; // 预计停留时间（小时）
  startTime?: string; // 开始时间，格式 "HH:mm"
}

// 路线节点类型
export interface RouteNode {
  time: string; // 时间点，格式 "HH:mm"
  location: Location;
  activity: string; // 活动建议
  alert?: {
    type: 'info' | 'warning';
    message: string;
  };
  coordinates: [number, number];
  estimatedDuration: number; // 预计停留时间（分钟）
}

// 生成的路线类型
export interface GeneratedRoute {
  id: string;
  title: string;
  description: string;
  nodes: RouteNode[];
  totalDuration: number; // 总时长（分钟）
  totalDistance?: number; // 总距离（米）
  createdAt: string;
  userId?: string;
  isSaved?: boolean;
}

// 智能推荐类型
export interface Recommendation {
  id: string;
  location: Location;
  distance: number; // 距离用户当前位置（米）
  reason: string; // 推荐理由
  realTimeInfo?: {
    queueTime?: number; // 排队时间（分钟）
    availableSeats?: number; // 可用座位数
    specialOffer?: string; // 特别优惠
  };
  actionType: 'order' | 'navigate' | 'view' | 'book';
  actionUrl?: string;
}

// 用户位置类型
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

// 日记类型
export interface Diary {
  id: string;
  title: string;
  content: string; // Markdown格式
  images: DiaryImage[];
  routeId?: string; // 关联的路线ID
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublished?: boolean;
  shareUrl?: string;
}

// 日记图片类型
export interface DiaryImage {
  id: string;
  url: string;
  originalName: string;
  uploadTime: string;
  location?: {
    name: string;
    coordinates: [number, number];
  };
  description?: string; // AI生成的描述
}

// 日记创建请求类型
export interface DiaryCreateRequest {
  images: File[];
  routeId?: string;
  title?: string;
}

// 日记生成响应类型
export interface DiaryGenerationResponse {
  success: boolean;
  diary?: Diary;
  error?: string;
}

// 用户个人中心数据类型
export interface UserProfile {
  user: User;
  savedRoutes: GeneratedRoute[];
  diaries: Diary[];
  statistics: {
    totalRoutes: number;
    totalDiaries: number;
    totalVisits: number;
  };
}

// API响应通用类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 