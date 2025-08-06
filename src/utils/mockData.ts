import { Location, GeneratedRoute, Recommendation, Diary, User } from '../types';

// 模拟天气信息数据
export const mockWeatherInfo = [
  {
    date: '2024-01-15',
    dayWeather: '晴',
    nightWeather: '多云',
    dayTemp: 8,
    nightTemp: -2,
    winddirection: '北风',
    windpower: '3级'
  },
  {
    date: '2024-01-16',
    dayWeather: '多云',
    nightWeather: '晴',
    dayTemp: 6,
    nightTemp: -4,
    winddirection: '西北风',
    windpower: '4级'
  },
  {
    date: '2024-01-17',
    dayWeather: '晴',
    nightWeather: '晴',
    dayTemp: 10,
    nightTemp: 0,
    winddirection: '南风',
    windpower: '2级'
  }
];

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

// 模拟旅行计划数据
export const mockTripPlan = {
  city: '北京',
  startDate: '2024-01-15',
  endDate: '2024-01-17',
  days: [
    {
      date: '2024-01-15',
      dayIndex: 0,
      description: '第1天行程安排',
      transportation: '地铁',
      accommodation: '酒店',
      attractions: [
        {
          name: '故宫博物院',
          address: '北京市东城区景山前街4号',
          location: {
            longitude: 116.3974,
            latitude: 39.9163
          },
          visitDuration: 180,
          description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最完整的木质结构古建筑群',
          imageUrl: '/images/forbidden-city.jpg',
          rating: 4.8,
          category: '历史古迹'
        },
        {
          name: '天安门广场',
          address: '北京市东城区天安门广场',
          location: {
            longitude: 116.3974,
            latitude: 39.9033
          },
          visitDuration: 60,
          description: '世界上最大的城市广场，是北京的地标性建筑',
          imageUrl: '/images/tiananmen.jpg',
          rating: 4.6,
          category: '地标建筑'
        }
      ],
      meals: [
        {
          type: 'breakfast' as const,
          name: '酒店早餐',
          description: '在酒店享用丰盛的早餐'
        },
        {
          type: 'lunch' as const,
          name: '全聚德烤鸭',
          description: '品尝正宗的北京烤鸭'
        },
        {
          type: 'dinner' as const,
          name: '老北京炸酱面',
          description: '体验地道的北京小吃'
        }
      ]
    },
    {
      date: '2024-01-16',
      dayIndex: 1,
      description: '第2天行程安排',
      transportation: '地铁',
      accommodation: '酒店',
      attractions: [
        {
          name: '颐和园',
          address: '北京市海淀区新建宫门路19号',
          location: {
            longitude: 116.2755,
            latitude: 39.9999
          },
          visitDuration: 240,
          description: '中国现存最大、保存最完整的皇家园林，被誉为"皇家园林博物馆"',
          imageUrl: '/images/summer-palace.jpg',
          rating: 4.7,
          category: '园林景观'
        },
        {
          name: '圆明园遗址公园',
          address: '北京市海淀区清华西路28号',
          location: {
            longitude: 116.2988,
            latitude: 40.0089
          },
          visitDuration: 120,
          description: '清代皇家园林，现为遗址公园，具有重要的历史文化价值',
          imageUrl: '/images/yuanmingyuan.jpg',
          rating: 4.5,
          category: '历史遗址'
        }
      ],
      meals: [
        {
          type: 'breakfast' as const,
          name: '酒店早餐',
          description: '在酒店享用丰盛的早餐'
        },
        {
          type: 'lunch' as const,
          name: '颐和园附近餐厅',
          description: '在颐和园附近享用午餐'
        },
        {
          type: 'dinner' as const,
          name: '北京涮羊肉',
          description: '品尝正宗的北京涮羊肉'
        }
      ]
    },
    {
      date: '2024-01-17',
      dayIndex: 2,
      description: '第3天行程安排',
      transportation: '地铁',
      accommodation: '酒店',
      attractions: [
        {
          name: '八达岭长城',
          address: '北京市延庆区八达岭特区',
          location: {
            longitude: 116.0241,
            latitude: 40.3563
          },
          visitDuration: 180,
          description: '明长城中保存最好的一段，也是最具代表性的一段，是万里长城的精华',
          imageUrl: '/images/great-wall.jpg',
          rating: 4.9,
          category: '历史古迹'
        },
        {
          name: '鸟巢',
          address: '北京市朝阳区国家体育场路1号',
          location: {
            longitude: 116.3974,
            latitude: 39.9928
          },
          visitDuration: 90,
          description: '2008年北京奥运会主体育场，现为重要的体育和文化活动场所',
          imageUrl: '/images/bird-nest.jpg',
          rating: 4.4,
          category: '现代建筑'
        }
      ],
      meals: [
        {
          type: 'breakfast' as const,
          name: '酒店早餐',
          description: '在酒店享用丰盛的早餐'
        },
        {
          type: 'lunch' as const,
          name: '长城脚下农家乐',
          description: '在长城脚下品尝农家菜'
        },
        {
          type: 'dinner' as const,
          name: '北京烤鸭',
          description: '再次品尝美味的北京烤鸭'
        }
      ]
    }
  ],
  weatherInfo: [
    {
      date: '2024-01-15',
      dayWeather: '晴',
      nightWeather: '多云',
      dayTemp: 8,
      nightTemp: -2,
      winddirection: '北风',
      windpower: '3级'
    },
    {
      date: '2024-01-16',
      dayWeather: '多云',
      nightWeather: '晴',
      dayTemp: 6,
      nightTemp: -4,
      winddirection: '西北风',
      windpower: '4级'
    },
    {
      date: '2024-01-17',
      dayWeather: '晴',
      nightWeather: '晴',
      dayTemp: 10,
      nightTemp: 0,
      winddirection: '南风',
      windpower: '2级'
    }
  ],
  overallSuggestions: '北京三日游行程安排合理，涵盖了历史文化、园林景观和现代建筑等不同类型的景点。建议提前预订门票，注意天气变化，合理安排游览时间。'
}; 