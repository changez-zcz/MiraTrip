import { Location, GeneratedRoute, Recommendation, Diary, User } from '../types';

// 园区地点数据
export const mockLocations: Location[] = [
  {
    id: '1',
    name: '主展厅',
    category: 'attraction',
    description: '百度科技园的核心展示区域，展示最新的AI技术和产品',
    coordinates: [116.307, 39.984],
    address: '百度科技园主展厅',
    imageUrl: '/images/main-hall.jpg',
    rating: 4.8,
    visitDuration: 60,
    tags: ['科技体验', '必去打卡点', 'AI互动'],
    isPopular: true,
    currentStatus: 'open',
    crowdLevel: 'medium'
  },
  {
    id: '2',
    name: '丰年培训室',
    category: 'facility',
    description: '专业的培训空间，提供各种技术培训和讲座',
    coordinates: [116.308, 39.985],
    address: '百度科技园B座2层',
    imageUrl: '/images/training-room.jpg',
    rating: 4.5,
    visitDuration: 30,
    tags: ['培训讲座', '学习交流'],
    currentStatus: 'open',
    crowdLevel: 'low'
  },
  {
    id: '3',
    name: '百度咖啡厅',
    category: 'restaurant',
    description: '环境优雅的咖啡厅，提供咖啡、茶点和简餐',
    coordinates: [116.306, 39.983],
    address: '百度科技园A座1层',
    imageUrl: '/images/coffee-shop.jpg',
    rating: 4.6,
    visitDuration: 45,
    tags: ['用餐休息', '咖啡茶点', '休闲放松'],
    isPopular: true,
    currentStatus: 'open',
    crowdLevel: 'high'
  },
  {
    id: '4',
    name: 'K2创新空间',
    category: 'entertainment',
    description: '创新实验室，展示前沿科技项目和互动体验',
    coordinates: [116.309, 39.986],
    address: '百度科技园C座3层',
    imageUrl: '/images/k2-space.jpg',
    rating: 4.7,
    visitDuration: 90,
    tags: ['科技体验', '创新展示', '互动体验'],
    isPopular: true,
    currentStatus: 'open',
    crowdLevel: 'medium'
  },
  {
    id: '5',
    name: 'AI体验馆',
    category: 'attraction',
    description: '专门展示AI技术的体验馆，包含多种互动装置',
    coordinates: [116.305, 39.982],
    address: '百度科技园D座1层',
    imageUrl: '/images/ai-experience.jpg',
    rating: 4.9,
    visitDuration: 75,
    tags: ['AI体验', '科技互动', '亲子互动'],
    isPopular: true,
    currentStatus: 'open',
    crowdLevel: 'high'
  },
  {
    id: '6',
    name: '员工餐厅',
    category: 'restaurant',
    description: '提供多样化餐饮选择的员工餐厅',
    coordinates: [116.307, 39.984],
    address: '百度科技园E座2层',
    imageUrl: '/images/employee-canteen.jpg',
    rating: 4.3,
    visitDuration: 30,
    tags: ['用餐休息', '多样化选择'],
    currentStatus: 'open',
    crowdLevel: 'high'
  },
  {
    id: '7',
    name: '会议室',
    category: 'facility',
    description: '现代化的会议空间，适合商务洽谈和团队会议',
    coordinates: [116.308, 39.983],
    address: '百度科技园F座4层',
    imageUrl: '/images/meeting-room.jpg',
    rating: 4.4,
    visitDuration: 60,
    tags: ['商务会议', '团队协作'],
    currentStatus: 'open',
    crowdLevel: 'low'
  },
  {
    id: '8',
    name: '休闲花园',
    category: 'entertainment',
    description: '绿意盎然的休闲空间，适合放松和拍照',
    coordinates: [116.306, 39.985],
    address: '百度科技园中央花园',
    imageUrl: '/images/garden.jpg',
    rating: 4.5,
    visitDuration: 30,
    tags: ['休闲放松', '拍照打卡', '自然风光'],
    currentStatus: 'open',
    crowdLevel: 'low'
  }
];

// 用户偏好选项
export const preferenceOptions = [
  '必去打卡点',
  '科技体验',
  '亲子互动',
  '用餐休息',
  '避开人群',
  '商务会议',
  '培训学习',
  '休闲放松',
  '拍照打卡'
];

// 模拟生成的路线数据
export const mockGeneratedRoutes: GeneratedRoute[] = [
  {
    id: 'route-1',
    title: '科技体验精华路线',
    description: '专为科技爱好者设计的路线，包含最新的AI技术和互动体验',
    nodes: [
      {
        time: '09:00',
        location: mockLocations[0], // 主展厅
        activity: '集合，建议拍照留念',
        alert: {
          type: 'info',
          message: '避开上下班人流量高峰'
        },
        coordinates: [116.307, 39.984],
        estimatedDuration: 60
      },
      {
        time: '10:00',
        location: mockLocations[4], // AI体验馆
        activity: '体验AI互动装置',
        alert: {
          type: 'warning',
          message: '当前人流较多，建议错峰体验'
        },
        coordinates: [116.305, 39.982],
        estimatedDuration: 75
      },
      {
        time: '11:15',
        location: mockLocations[2], // 百度咖啡厅
        activity: '休息放松，享用咖啡',
        coordinates: [116.306, 39.983],
        estimatedDuration: 45
      },
      {
        time: '12:00',
        location: mockLocations[3], // K2创新空间
        activity: '参观创新项目展示',
        coordinates: [116.309, 39.986],
        estimatedDuration: 90
      }
    ],
    totalDuration: 270,
    totalDistance: 800,
    createdAt: '2024-01-15T10:30:00Z',
    userId: 'user-1',
    isSaved: true
  }
];

// 模拟推荐数据
export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    location: mockLocations[2], // 百度咖啡厅
    distance: 300,
    reason: '距离您当前位置最近，环境优雅',
    realTimeInfo: {
      queueTime: 10,
      availableSeats: 15,
      specialOffer: '新用户首杯半价'
    },
    actionType: 'order',
    actionUrl: '/coffee/order'
  },
  {
    id: 'rec-2',
    location: mockLocations[4], // AI体验馆
    distance: 500,
    reason: '当前人流较少，体验效果最佳',
    realTimeInfo: {
      queueTime: 5
    },
    actionType: 'view',
    actionUrl: '/ai-experience'
  }
];

// 模拟用户数据
export const mockUser: User = {
  id: 'user-1',
  phone: '138****8888',
  nickname: '妙游用户',
  avatar: '/images/default-avatar.jpg',
  createdAt: '2024-01-01T00:00:00Z'
};

// 模拟日记数据
export const mockDiaries: Diary[] = [
  {
    id: 'diary-1',
    title: '我的百度科技园之旅',
    content: `# 我的百度科技园之旅

## 上午行程

### 主展厅 (09:00-10:00)
今天一早来到百度科技园的主展厅，这里展示了最新的AI技术和产品。展厅的设计非常现代化，各种互动装置让人目不暇接。

### AI体验馆 (10:00-11:15)
在AI体验馆中，我体验了多种前沿的AI技术。最让我印象深刻的是智能语音助手，能够准确理解我的指令并执行相应操作。

## 下午行程

### 百度咖啡厅 (11:15-12:00)
在咖啡厅休息时，品尝了美味的咖啡和甜点。环境优雅，是放松身心的好去处。

### K2创新空间 (12:00-13:30)
下午参观了K2创新空间，这里展示了百度在人工智能领域的最新研究成果。各种创新项目让人大开眼界。

## 总结
今天的参观让我对百度在AI领域的技术实力有了更深入的了解，是一次非常有意义的科技之旅！`,
    images: [
      {
        id: 'img-1',
        url: '/images/diary/main-hall.jpg',
        originalName: 'main-hall.jpg',
        uploadTime: '2024-01-15T09:30:00Z',
        location: {
          name: '主展厅',
          coordinates: [116.307, 39.984]
        },
        description: '主展厅的现代化设计'
      },
      {
        id: 'img-2',
        url: '/images/diary/ai-experience.jpg',
        originalName: 'ai-experience.jpg',
        uploadTime: '2024-01-15T10:30:00Z',
        location: {
          name: 'AI体验馆',
          coordinates: [116.305, 39.982]
        },
        description: 'AI互动装置体验'
      }
    ],
    routeId: 'route-1',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    userId: 'user-1',
    isPublished: true,
    shareUrl: '/diary/share/diary-1'
  }
];

// 模拟用户个人中心数据
export const mockUserProfile = {
  user: mockUser,
  savedRoutes: mockGeneratedRoutes,
  diaries: mockDiaries,
  statistics: {
    totalRoutes: 3,
    totalDiaries: 2,
    totalVisits: 5
  }
}; 