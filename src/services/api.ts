import axios from 'axios';
import { ENV } from '../env';
import { 
  TripFormData, 
  TripPlan, 
  DeepseekResponse, 
  WeatherInfo,
  Location,
  RouteRequest,
  GeneratedRoute,
  Recommendation,
  UserLocation,
  DiaryCreateRequest,
  DiaryGenerationResponse,
  Diary,
  UserProfile,
  ApiResponse
} from '../types';
import { 
  mockWeatherInfo, 
  mockTripPlan, 
  mockLocations, 
  mockGeneratedRoutes, 
  mockRecommendations, 
  mockUserProfile,
  mockDiaries
} from '../utils/mockData';

// 城市坐标映射表（主要城市）
const CITY_COORDINATES: { [key: string]: { longitude: number; latitude: number } } = {
  '北京': { longitude: 116.4074, latitude: 39.9042 },
  '上海': { longitude: 121.4737, latitude: 31.2304 },
  '广州': { longitude: 113.2644, latitude: 23.1291 },
  '深圳': { longitude: 114.0579, latitude: 22.5431 },
  '成都': { longitude: 104.0668, latitude: 30.5728 },
  '杭州': { longitude: 120.1551, latitude: 30.2741 },
  '南京': { longitude: 118.7969, latitude: 32.0603 },
  '武汉': { longitude: 114.3054, latitude: 30.5931 },
  '西安': { longitude: 108.9398, latitude: 34.3416 },
  '重庆': { longitude: 106.5516, latitude: 29.5630 },
  '天津': { longitude: 117.2010, latitude: 39.0842 },
  '苏州': { longitude: 120.5853, latitude: 31.2990 },
  '厦门': { longitude: 118.0894, latitude: 24.4798 },
  '长沙': { longitude: 112.9388, latitude: 28.2282 },
  '青岛': { longitude: 120.3826, latitude: 36.0671 },
  '大连': { longitude: 121.6186, latitude: 38.9146 },
  '宁波': { longitude: 121.5497, latitude: 29.8683 },
  '无锡': { longitude: 120.3119, latitude: 31.4912 },
  '福州': { longitude: 119.2965, latitude: 26.0745 },
  '济南': { longitude: 117.1205, latitude: 36.6512 },
  '哈尔滨': { longitude: 126.5420, latitude: 45.8088 },
  '长春': { longitude: 125.3245, latitude: 43.8171 },
  '沈阳': { longitude: 123.4315, latitude: 41.8057 },
  '石家庄': { longitude: 114.5149, latitude: 38.0428 },
  '郑州': { longitude: 113.6254, latitude: 34.7466 },
  '昆明': { longitude: 102.8329, latitude: 24.8801 },
  '贵阳': { longitude: 106.6302, latitude: 26.6470 },
  '南宁': { longitude: 108.3200, latitude: 22.8240 },
  '海口': { longitude: 110.3293, latitude: 20.0440 },
  '太原': { longitude: 112.5489, latitude: 37.8706 },
  '合肥': { longitude: 117.2272, latitude: 31.8206 },
  '南昌': { longitude: 115.8581, latitude: 28.6832 },
  '兰州': { longitude: 103.8343, latitude: 36.0611 },
  '西宁': { longitude: 101.7803, latitude: 36.6173 },
  '银川': { longitude: 106.2309, latitude: 38.4872 },
  '乌鲁木齐': { longitude: 87.6168, latitude: 43.8256 },
  '拉萨': { longitude: 91.1119, latitude: 29.9734 },
  '呼和浩特': { longitude: 111.7518, latitude: 40.8429 }
};

// 获取城市坐标的函数
function getCityCoordinates(cityName: string): { longitude: number; latitude: number } {
  // 如果城市名称在映射表中，返回对应坐标
  if (CITY_COORDINATES[cityName]) {
    return CITY_COORDINATES[cityName];
  }
  
  // 如果不在映射表中，返回北京的坐标作为默认值
  console.warn(`未找到城市 "${cityName}" 的坐标信息，使用北京坐标作为默认值`);
  return CITY_COORDINATES['北京'];
}

// 是否使用模拟数据（开发环境下可以设置为true）
const USE_MOCK_DATA = false; // 使用真实API生成旅行计划
// 是否在错误时回退到模拟数据（生产环境推荐设置为false）
const USE_FALLBACK_DATA = true;
// 启用控制台显示
const ENABLE_CONSOLE_LOG = true;

// 设置API请求的超时时间（毫秒）
const API_TIMEOUT = 120000; // 增加到2分钟

// 立即测试日志功能
console.log('=== API服务初始化 ===');
console.log('ENABLE_CONSOLE_LOG:', ENABLE_CONSOLE_LOG);
console.log('API_TIMEOUT:', API_TIMEOUT);

// 最大重试次数
const MAX_RETRY_COUNT = 2;

// 重试延迟（毫秒）
const RETRY_DELAY = 2000;

// POI缓存，用于存储已查询过的景点信息，降低API调用消耗
const poiCache: Record<string, any> = {};

// 添加自定义日志函数
function log(...args: any[]): void {
  if (ENABLE_CONSOLE_LOG) {
    console.log(...args);
  }
}

function warn(...args: any[]): void {
  if (ENABLE_CONSOLE_LOG) {
    console.warn(...args);
  }
}

function error(...args: any[]): void {
  if (ENABLE_CONSOLE_LOG) {
    console.error(...args);
  }
}

// 添加一个新的函数，用于转换API返回的各种不同格式的数据结构到统一的应用程序格式
function standardizeTripPlanFormat(responseData: any, formData: TripFormData): any {
  // 检查是否有travel_plan字段（API可能返回这种格式而不是tripPlan）
  if (responseData.travel_plan && !responseData.tripPlan) {
    log('检测到travel_plan格式的API响应，将转换为tripPlan格式');
    
    const travelPlan = responseData.travel_plan;
    
    // 创建一个符合应用程序期望的tripPlan结构
    const standardized = {
      tripPlan: {
        city: formData.city,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: [],
        weatherInfo: [],
        overallSuggestions: travelPlan.overallSuggestions || "根据您的偏好和日程安排，我们为您精心设计了行程。建议提前查看各景点的开放时间，并根据天气情况适当调整行程。"
      }
    };
    
    // 转换days数组
    if (travelPlan.days && Array.isArray(travelPlan.days)) {
      standardized.tripPlan.days = travelPlan.days.map((day: any, index: number) => {
        // 创建标准格式的单日行程
        const standardDay: TripPlan['days'][0] = {
          date: day.date || new Date(new Date(formData.startDate).getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dayIndex: index,
          description: `第${index + 1}天行程安排`,
          transportation: formData.transportation,
          accommodation: formData.accommodation,
          attractions: [],
          meals: []
        };
        
        // 转换景点数据
        if (day.activities && Array.isArray(day.activities)) {
          standardDay.attractions = day.activities
            .filter((activity: any) => activity.type === '景点' || activity.type === 'attraction')
            .map((attraction: any) => {
              return {
                name: attraction.name,
                address: attraction.address || formData.city,
                location: attraction.location || {
                  // 临时使用城市坐标，后续会通过API获取真实位置
                  longitude: getCityCoordinates(formData.city).longitude,
                  latitude: getCityCoordinates(formData.city).latitude
                },
                visitDuration: attraction.suggested_duration ? 
                  parseInt(attraction.suggested_duration) * 60 || 120 : 120, // 将小时转换为分钟
                description: attraction.description || `${attraction.name}是${formData.city}的著名景点`,
                category: attraction.type || "景点"
              };
            });
        }
        
        // 转换餐饮数据
        if (day.meals) {
          const meals = day.meals;
          if (meals.breakfast) {
            standardDay.meals.push({
              type: 'breakfast',
              name: typeof meals.breakfast === 'string' ? 
                meals.breakfast : '早餐推荐',
              description: typeof meals.breakfast === 'string' ? 
                meals.breakfast : '早餐推荐'
            });
          }
          
          if (meals.lunch) {
            standardDay.meals.push({
              type: 'lunch',
              name: typeof meals.lunch === 'string' ? 
                '午餐推荐' : meals.lunch.name || '午餐推荐',
              description: typeof meals.lunch === 'string' ? 
                meals.lunch : meals.lunch.description || '午餐推荐'
            });
          }
          
          if (meals.dinner) {
            standardDay.meals.push({
              type: 'dinner',
              name: typeof meals.dinner === 'string' ? 
                '晚餐推荐' : meals.dinner.name || '晚餐推荐',
              description: typeof meals.dinner === 'string' ? 
                meals.dinner : meals.dinner.description || '晚餐推荐'
            });
          }
        }
        
        // 确保每天至少有3餐
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const existingTypes = standardDay.meals.map((meal: TripPlan['days'][0]['meals'][0]) => meal.type);
        
        mealTypes.forEach(type => {
          if (!existingTypes.includes(type as any)) {
            standardDay.meals.push({
              type: type as 'breakfast' | 'lunch' | 'dinner',
              name: `第${index + 1}天${type === 'breakfast' ? '早餐' : type === 'lunch' ? '午餐' : '晚餐'}推荐`,
              description: `第${index + 1}天${type === 'breakfast' ? '早餐' : type === 'lunch' ? '午餐' : '晚餐'}推荐`
            });
          }
        });
        
        return standardDay;
      });
    }
    
    return standardized;
  }
  
  // 原始API响应格式已经符合预期
  return responseData;
}

// 添加专门解析DeepSeek API响应的函数
function parseDeepseekResponse(responseData: any): any {
  try {
    // 检查响应格式是否符合预期
    if (responseData.choices && 
        responseData.choices.length > 0 && 
        responseData.choices[0].message && 
        responseData.choices[0].message.content) {
      
      // 获取内容字符串
      const content = responseData.choices[0].message.content;
      
      // 尝试直接解析JSON
      try {
        const parsedData = JSON.parse(content);
        return parsedData;
      } catch (directParseError) {
        error('直接解析API响应内容失败:', directParseError);
        
        // 预处理JSON文本 - 去除可能导致解析失败的字符
        const cleanedContent = content
          .trim()
          .replace(/\n/g, ' ')                  // 移除换行符
          .replace(/\r/g, '')                   // 移除回车符
          .replace(/\\n/g, ' ')                 // 移除转义的换行符
          .replace(/\\"/g, '"')                 // 修复转义的引号
          .replace(/"{/g, '{')                  // 移除开头多余的引号
          .replace(/}"/g, '}')                  // 移除结尾多余的引号
          .replace(/([0-9]),\s*"([a-zA-Z])/g, '$1,"$2')   // 修复数字后面缺少引号的问题
          .replace(/\}\s*,\s*\]/g, '}]')        // 修复数组末尾多余的逗号
          .replace(/,\s*\}/g, '}');             // 修复对象末尾多余的逗号
        
        try {
          return JSON.parse(cleanedContent);
        } catch (cleanParseError) {
          error('清理后解析API响应内容失败:', cleanParseError);
          
          // 尝试提取JSON部分
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              return JSON.parse(jsonMatch[0]);
            } catch (matchError) {
              error('提取JSON部分后解析失败:', matchError);
            }
          }
          
          // 使用更激进的方法 - 直接替换问题位置
          const fixedContent = content
            .replace(/("longitude"\s*:\s*[0-9.]+)\s*,\s*("latitude")/g, '$1,"$2')
            .replace(/("latitude"\s*:\s*[0-9.]+)\s*\}/g, '$1}')
            .replace(/("visitDuration"\s*:\s*[0-9]+)\s*,/g, '$1,')
            .replace(/("category"\s*:\s*"[^"]*")\s*\}/g, '$1}');
            
          try {
            return JSON.parse(fixedContent);
          } catch (finalError) {
            error('所有修复方法都失败:', finalError);
            throw new Error('无法解析API返回的JSON数据');
          }
        }
      }
    }
    
    throw new Error('API响应格式不符合预期');
  } catch (err) {
    error('解析DeepSeek API响应失败:', err);
    throw err;
  }
}

// 处理高德地图天气API返回的数据
export function processWeatherData(data: any): WeatherInfo[] {
  if (!data || !Array.isArray(data)) {
    warn('天气数据格式不正确:', data);
    return [];
  }
  
  // 将高德天气API返回的数据转换为应用需要的格式
  return data.map((item: any) => {
    // 日期格式转换: YYYYMMDD -> YYYY-MM-DD
    const dateStr = item.date;
    let formattedDate = dateStr;
    if (dateStr && dateStr.length === 8) {
      formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    }

    return {
      date: formattedDate,
      dayWeather: item.dayweather || '未知',
      nightWeather: item.nightweather || '未知',
      dayTemp: parseInt(item.daytemp) || 0,
      nightTemp: parseInt(item.nighttemp) || 0,
      winddirection: item.daywind || '未知',
      windpower: item.daypower || '未知'
    };
  });
}

// 获取天气信息
export async function getWeatherInfo(city: string): Promise<WeatherInfo[]> {
  if (USE_MOCK_DATA) {
    return mockWeatherInfo;
  }

  // 使用AMap.Weather JS API代替Web服务API
  return new Promise((resolve, reject) => {
    try {
      // 检查window.AMap是否已加载
      if (typeof window.AMap === 'undefined') {
        warn('AMap JS API尚未加载完成');
        if (!USE_FALLBACK_DATA) {
          reject(new Error('高德地图API尚未加载完成，无法获取天气信息'));
          return;
        }
        return resolve([]);
      }

      log(`使用AMap.Weather JS API获取${city}的天气信息`);
      // 创建Weather实例并获取天气预报
      window.AMap.plugin(['AMap.Weather'], () => {
        // 构造Weather类
        const amapWeather = new window.AMap.Weather();
        
        // 查询四天预报天气
        amapWeather.getForecast(city);
        
        // 成功获取天气数据
        window.AMap.event.addListener(amapWeather, 'complete', (data: any) => {
          log('天气API响应:', data);
          
          if (data && data.forecasts && Array.isArray(data.forecasts)) {
            // 将高德天气数据转换为应用需要的格式
            const weatherData = data.forecasts.map((item: any) => ({
              date: item.date,
              dayWeather: item.dayWeather || '未知',
              nightWeather: item.nightWeather || '未知',
              dayTemp: parseInt(item.dayTemp) || 0,
              nightTemp: parseInt(item.nightTemp) || 0,
              winddirection: item.dayWindDirection || '未知',
              windpower: item.dayWindPower || '未知'
            }));
            
            resolve(weatherData);
          } else {
            warn('天气数据格式不正确:', data);
            if (!USE_FALLBACK_DATA) {
              reject(new Error('无法解析天气数据'));
              return;
            }
            resolve([]);
          }
        });
        
        // 天气查询失败
        window.AMap.event.addListener(amapWeather, 'error', (err: any) => {
          error('获取天气信息出错:', err);
          if (!USE_FALLBACK_DATA) {
            reject(new Error('获取天气信息失败'));
            return;
          }
          resolve([]);
        });
      });
    } catch (err) {
      error('天气API调用出错:', err);
      if (!USE_FALLBACK_DATA) {
        reject(error instanceof Error ? error : new Error('获取天气信息时发生未知错误'));
        return;
      }
      resolve([]);
    }
  });
}

// 创建多天行程的辅助函数
async function createMultiDayTrip(parsedData: any, formData: TripFormData): Promise<any> {
  log('处理API返回的行程数据，确保生成多天行程');
  
  // 如果没有days数组或不是数组，创建一个空数组
  if (!parsedData.tripPlan || !parsedData.tripPlan.days || !Array.isArray(parsedData.tripPlan.days)) {
    warn('API返回的数据没有有效的days数组，将创建新的数组');
    parsedData.tripPlan.days = [];
  }
  
  // 记录API返回的天数
  const originalDaysCount = parsedData.tripPlan.days.length;
  log(`API返回的行程天数: ${originalDaysCount}, 请求的天数: ${formData.travelDays}`);
  
  // 确保每天的索引正确
  parsedData.tripPlan.days.forEach((day: TripPlan['days'][0], index: number) => {
    day.dayIndex = index;
    
    // 确保日期正确
    if (!day.date) {
      const newDate: Date = new Date(new Date(formData.startDate).getTime() + index * 24 * 60 * 60 * 1000);
      day.date = newDate.toISOString().split('T')[0];
    }
    
    // 如果attractions不存在或不是数组，初始化为空数组
    if (!day.attractions || !Array.isArray(day.attractions)) {
      day.attractions = [];
    }
      
      // 所需的餐食类型
      const requiredMealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];
      
      // 检查已有的餐食类型
      const existingTypes: ('breakfast' | 'lunch' | 'dinner')[] = day.meals
        .map((meal: TripPlan['days'][0]['meals'][0]) => meal.type)
        .filter((type): type is 'breakfast' | 'lunch' | 'dinner' => ['breakfast', 'lunch', 'dinner'].includes(type));
      
      // 添加缺失的餐食
      for (const mealType of requiredMealTypes) {
        if (!existingTypes.includes(mealType)) {
          let mealName: string, mealDesc: string;
          
          if (mealType === 'breakfast') {
            mealName = '当地特色早餐';
            mealDesc = '推荐尝试当地的早餐小吃，开启美好的一天';
          } else if (mealType === 'lunch') {
            mealName = '午餐推荐';
            mealDesc = '在游览景点附近的餐厅享用午餐，补充能量';
          } else {
            mealName = '晚餐推荐';
            mealDesc = '品尝当地特色美食，结束一天的行程';
          }
          
          day.meals.push({
            type: mealType,
            name: `第${index+1}天 ${mealName}`,
            description: `第${index+1}天 ${mealDesc}`
          } as TripPlan['days'][0]['meals'][0]);
        }
      }
    }
  )
  
  // 排序确保按日期顺序
  parsedData.tripPlan.days.sort((a: TripPlan['days'][0], b: TripPlan['days'][0]) => a.dayIndex - b.dayIndex);
  
  // 获取所有景点的真实位置信息
  log('开始获取所有景点的真实位置信息');
  const allAttractions = parsedData.tripPlan.days.flatMap((day: TripPlan['days'][0]) => 
    day.attractions.map(attr => ({
      name: attr.name,
      city: formData.city
    }))
  );
  
  if (allAttractions.length > 0) {
    try {
      log(`需要获取${allAttractions.length}个景点的位置信息`);
      const poiInfoList = await batchGetAttractionPOIInfo(allAttractions);
      
      // 更新每个景点的位置信息
      let poiIndex = 0;
      parsedData.tripPlan.days.forEach((day: TripPlan['days'][0]) => {
        day.attractions.forEach((attr) => {
          if (poiIndex < poiInfoList.length) {
            const poiInfo = poiInfoList[poiIndex];
            attr.location = poiInfo.location;
            attr.address = poiInfo.address;
            attr.rating = poiInfo.rating;
            attr.category = poiInfo.category;
            poiIndex++;
          }
        });
      });
      
      log('成功更新所有景点的位置信息');
    } catch (err) {
      error('获取景点位置信息失败:', err);
      log('将使用默认位置信息');
    }
  }
  
  return parsedData;
}

// 添加一个重试函数
interface RetryableAxiosRequestFn {
  (): Promise<any>;
}

async function retryableAxiosRequest(
  requestFn: RetryableAxiosRequestFn, 
  maxRetries: number = MAX_RETRY_COUNT, 
  delay: number = RETRY_DELAY
): Promise<any> {
  console.log('=== 开始API请求 ===');
  console.log('最大重试次数:', maxRetries);
  console.log('重试延迟:', delay);
  
  let lastError: unknown;
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      if (retryCount > 0) {
        console.log(`正在进行第${retryCount}次重试...`);
        log(`正在进行第${retryCount}次重试...`);
        // 使用延迟确保不立即重试
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      console.log(`执行API请求 (第${retryCount + 1}次尝试)`);
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error)) {
        // 只有在超时或网络错误等可能因临时原因导致的错误时才重试
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || 
            !error.response || error.response.status >= 500) {
          log(`请求失败，${retryCount < maxRetries ? '将重试' : '已达到最大重试次数'}:`, error.message);
          continue;
        }
        // 对于其他错误（如400错误），不再重试
        break;
      }
      // 非Axios错误也不重试
      break;
    }
  }
  throw lastError; // 所有重试失败后抛出最后一个错误
}

// 高德地图POI搜索
export async function searchPOIByKeyword(keyword: string, city: string) {
  // 构建缓存键
  const cacheKey = `${keyword}_${city}`;

  // 检查缓存中是否已有该查询结果
  if (poiCache[cacheKey]) {
    log(`使用缓存的POI数据: ${cacheKey}`);
    return poiCache[cacheKey];
  }

  if (USE_MOCK_DATA) {
    // 模拟POI数据
    const mockResult = {
      status: '1',
      count: '5',
      info: 'OK',
      pois: mockTripPlan.days.flatMap(day => day.attractions).map(attr => ({
        id: Math.random().toString(36).substring(2, 10),
        name: attr.name,
        type: attr.category,
        address: attr.address,
        location: `${attr.location.longitude},${attr.location.latitude}`,
        tel: '',
        photos: []
      }))
    };
    
    // 缓存模拟数据
    poiCache[cacheKey] = mockResult;
    return mockResult;
  }

  try {
    // 修正高德POI搜索参数，确保只在指定城市内搜索
    const response = await retryableAxiosRequest(() => axios.get('https://restapi.amap.com/v5/place/text', {
      params: {
        key: ENV.AMAP_API_KEY,
        keywords: keyword,
        city: city, // 使用city参数
        citylimit: true // 官方参数为citylimit
      },
      timeout: API_TIMEOUT
    }));
    
    // 将结果存入缓存
    poiCache[cacheKey] = response.data;
    return response.data;
  } catch (err) {
    error('搜索POI出错:', err);
    throw err;
  }
}

// 根据POI ID直接查询POI详情（减少API调用）
export async function getPOIById(id: string) {
  // 检查缓存中是否已有该ID的查询结果
  if (poiCache[id]) {
    log(`使用缓存的POI ID数据: ${id}`);
    return poiCache[id];
  }

  if (USE_MOCK_DATA) {
    // 模拟POI详情数据
    const mockResult = {
      status: '1',
      info: 'OK',
      poi: mockTripPlan.days[0].attractions[0]
    };
    
    // 缓存模拟数据
    poiCache[id] = mockResult;
    return mockResult;
  }

  try {
    // 使用ID查询POI详情
    const response = await retryableAxiosRequest(() => axios.get('https://restapi.amap.com/v5/place/detail', {
      params: {
        key: ENV.AMAP_API_KEY,
        id: id
      },
      timeout: API_TIMEOUT
    }));
    
    // 将结果存入缓存
    poiCache[id] = response.data;
    return response.data;
  } catch (err) {
    error('查询POI详情出错:', err);
    throw error;
  }
}

// 批量查询景点POI信息
export async function batchGetAttractionPOIInfo(attractions: { name: string, city: string }[]) {
  // 过滤掉已缓存的景点
  const uncachedAttractions = attractions.filter(attr => {
    const cacheKey = `${attr.name.replace(/^第\d+天景点:\s*/, '').trim()}_${attr.city}`;
    return !poiCache[cacheKey];
  });

  if (uncachedAttractions.length === 0) {
    // 所有景点都已缓存
    return attractions.map(attr => {
      const cleanName = attr.name.replace(/^第\d+天景点:\s*/, '').trim();
      const cacheKey = `${cleanName}_${attr.city}`;
      const cachedData = poiCache[cacheKey];
      
      if (cachedData && cachedData.pois && cachedData.pois.length > 0) {
        const poi = cachedData.pois[0];
        let longitude = 0, latitude = 0;
        if (poi.location) {
          const locationParts = poi.location.split(',');
          if (locationParts.length === 2) {
            longitude = parseFloat(locationParts[0]);
            latitude = parseFloat(locationParts[1]);
          }
        }
        
        return {
          name: cleanName,
          address: poi.address || poi.pname + poi.cityname + poi.adname + poi.name,
          location: {
            longitude,
            latitude
          },
          rating: poi.rating || (4 + Math.random()).toFixed(1),
          category: poi.type || "景点"
        };
      }
      
      // 如果缓存中没有，使用默认值（不应该到达这一步）
      return {
        name: cleanName,
        address: `${attr.city}市${cleanName}`,
        location: {
          longitude: parseFloat((getCityCoordinates(attr.city).longitude + (Math.random() - 0.5) * 0.02).toFixed(6)),
          latitude: parseFloat((getCityCoordinates(attr.city).latitude + (Math.random() - 0.5) * 0.02).toFixed(6))
        },
        rating: (4 + Math.random()).toFixed(1),
        category: "景点"
      };
    });
  }

  // 如果有未缓存的景点，为每个未缓存的景点执行单独的异步请求
  const results = await Promise.all(
    attractions.map(async (attr) => {
      const cleanName = attr.name.replace(/^第\d+天景点:\s*/, '').trim();
      const cacheKey = `${cleanName}_${attr.city}`;
      
      // 如果已经缓存，直接使用缓存数据
      if (poiCache[cacheKey] && poiCache[cacheKey].pois && poiCache[cacheKey].pois.length > 0) {
        const poi = poiCache[cacheKey].pois[0];
        let longitude = 0, latitude = 0;
        if (poi.location) {
          const locationParts = poi.location.split(',');
          if (locationParts.length === 2) {
            longitude = parseFloat(locationParts[0]);
            latitude = parseFloat(locationParts[1]);
          }
        }
        
        return {
          name: cleanName,
          address: poi.address || poi.pname + poi.cityname + poi.adname + poi.name,
          location: {
            longitude,
            latitude
          },
          rating: poi.rating || (4 + Math.random()).toFixed(1),
          category: poi.type || "景点"
        };
      }
      
      // 否则调用API获取数据
      return await getAttractionPOIInfo(attr.name, attr.city);
    })
  );
  
  return results;
}

// 根据景点名称和城市获取准确的POI信息
export async function getAttractionPOIInfo(attractionName: string, city: string) {
  // 移除景点名称中可能包含的"第X天景点:"等前缀，以提高搜索准确性
  const cleanName = attractionName.replace(/^第\d+天景点:\s*/, '').trim();
  
  // 构建缓存键
  const cacheKey = `${cleanName}_${city}`;
  
  // 检查缓存中是否已有该查询结果
  if (poiCache[cacheKey]) {
    log(`使用缓存的景点POI信息: ${cacheKey}`);
    const cachedData = poiCache[cacheKey];
    
    if (cachedData.pois && cachedData.pois.length > 0) {
      const poi = cachedData.pois[0];
      let longitude = 0, latitude = 0;
      if (poi.location) {
        const locationParts = poi.location.split(',');
        if (locationParts.length === 2) {
          longitude = parseFloat(locationParts[0]);
          latitude = parseFloat(locationParts[1]);
        }
      }
      
      return {
        name: cleanName,
        address: poi.address || poi.pname + poi.cityname + poi.adname + poi.name,
        location: {
          longitude,
          latitude
        },
        rating: poi.rating || (4 + Math.random()).toFixed(1),
        category: poi.type || "景点"
      };
    }
  }

  if (USE_MOCK_DATA) {
    // 返回模拟POI数据
    const mockResult = {
      name: cleanName,
      address: `${city}市${cleanName}附近`,
      location: {
        longitude: parseFloat((getCityCoordinates(city).longitude + (Math.random() - 0.5) * 0.02).toFixed(6)),
        latitude: parseFloat((getCityCoordinates(city).latitude + (Math.random() - 0.5) * 0.02).toFixed(6))
      },
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      category: "景点"
    };
    
    // 缓存模拟数据（模拟API返回格式）
    poiCache[cacheKey] = {
      status: '1',
      pois: [{
        id: Math.random().toString(36).substring(2, 10),
        name: cleanName,
        type: "景点",
        address: `${city}市${cleanName}附近`,
        location: `${mockResult.location.longitude},${mockResult.location.latitude}`,
        rating: mockResult.rating
      }]
    };
    
    return mockResult;
  }

  try {
    log(`开始搜索景点POI信息: ${cleanName}, 城市: ${city}`);
    // 使用高德地图POI搜索API，参数与searchPOIByKeyword保持一致
    const response = await retryableAxiosRequest(() => axios.get('https://restapi.amap.com/v5/place/text', {
      params: {
        key: ENV.AMAP_API_KEY,
        keywords: cleanName,
        city: city, // 使用city参数
        citylimit: true, // 官方参数为citylimit
        types: '风景名胜', // 添加景点类型限制
        offset: 10, // 返回结果数量
        page: 1
      },
      timeout: API_TIMEOUT
    }));
    
    // 将结果存入缓存
    poiCache[cacheKey] = response.data;
    
    if (response.data.status === '1' && response.data.pois && response.data.pois.length > 0) {
      // 找到POI数据
      const poi = response.data.pois[0]; // 使用第一个结果
      log(`成功获取到景点 "${cleanName}" 的POI信息`);
      // 解析经纬度坐标
      let longitude = 0, latitude = 0;
      if (poi.location) {
        const locationParts = poi.location.split(',');
        if (locationParts.length === 2) {
          longitude = parseFloat(locationParts[0]);
          latitude = parseFloat(locationParts[1]);
        }
      }
      // 生成评分 (如果API没有提供评分，生成一个随机评分)
      const rating = poi.rating || (4 + Math.random()).toFixed(1);
      return {
        name: cleanName,
        address: poi.address || poi.pname + poi.cityname + poi.adname + poi.name,
        location: {
          longitude,
          latitude
        },
        rating: rating,
        category: poi.type || "景点"
      };
    } else {
      warn(`未找到景点 "${cleanName}" 的POI信息，API返回状态: ${response.data.status}, 结果数量: ${response.data.pois?.length || 0}`);
      
      // 尝试不带景点类型限制的搜索
      try {
        log(`尝试不带类型限制的POI搜索: ${cleanName}`);
        const fallbackResponse = await retryableAxiosRequest(() => axios.get('https://restapi.amap.com/v5/place/text', {
          params: {
            key: ENV.AMAP_API_KEY,
            keywords: cleanName,
            city: city,
            citylimit: true,
            offset: 10,
            page: 1
          },
          timeout: API_TIMEOUT
        }));
        
        if (fallbackResponse.data.status === '1' && fallbackResponse.data.pois && fallbackResponse.data.pois.length > 0) {
          const poi = fallbackResponse.data.pois[0];
          log(`通过备用搜索成功获取到景点 "${cleanName}" 的POI信息`);
          
          let longitude = 0, latitude = 0;
          if (poi.location) {
            const locationParts = poi.location.split(',');
            if (locationParts.length === 2) {
              longitude = parseFloat(locationParts[0]);
              latitude = parseFloat(locationParts[1]);
            }
          }
          
          return {
            name: cleanName,
            address: poi.address || poi.pname + poi.cityname + poi.adname + poi.name,
            location: {
              longitude,
              latitude
            },
            rating: poi.rating || (4 + Math.random()).toFixed(1),
            category: poi.type || "景点"
          };
        }
      } catch (fallbackError) {
        error('备用POI搜索失败:', fallbackError);
      }
      
      // 返回一个兜底的位置（该城市的中心点位置）
      try {
        // 检查缓存中是否已有该城市的中心点
        const cityCenterCacheKey = `city_center_${city}`;
        let cityCenter;
        
        if (poiCache[cityCenterCacheKey]) {
          cityCenter = poiCache[cityCenterCacheKey];
          log(`使用缓存的城市中心点: ${city}`);
        } else {
          const geocodeResponse = await retryableAxiosRequest(() => axios.get('https://restapi.amap.com/v3/geocode/geo', {
            params: {
              key: ENV.AMAP_API_KEY,
              address: city,
              city: city
            },
            timeout: API_TIMEOUT
          }));
          
          if (geocodeResponse.data.status === '1' && 
              geocodeResponse.data.geocodes && 
              geocodeResponse.data.geocodes.length > 0) {
            cityCenter = geocodeResponse.data.geocodes[0].location;
            // 缓存城市中心点
            poiCache[cityCenterCacheKey] = cityCenter;
          }
        }
        
        if (cityCenter) {
          const locationParts = cityCenter.split(',');
          if (locationParts.length === 2) {
            return {
              name: cleanName,
              address: `${city}市${cleanName}`,
              location: {
                longitude: parseFloat(locationParts[0]),
                latitude: parseFloat(locationParts[1])
              },
              rating: (4 + Math.random()).toFixed(1),
              category: "景点"
            };
          }
        }
      } catch (geocodeError) {
        error('获取城市中心点坐标失败:', geocodeError);
      }
      // 如果城市坐标也获取失败，返回一个默认值
      warn(`为景点 "${cleanName}" 使用城市中心点坐标作为兜底`);
      const defaultResult = {
        name: cleanName,
        address: `${city}市${cleanName}`,
        location: {
          longitude: parseFloat((getCityCoordinates(city).longitude + (Math.random() - 0.5) * 0.02).toFixed(6)),
          latitude: parseFloat((getCityCoordinates(city).latitude + (Math.random() - 0.5) * 0.02).toFixed(6))
        },
        rating: (4 + Math.random()).toFixed(1),
        category: "景点"
      };
      
      // 缓存默认结果
      poiCache[cacheKey] = {
        status: '1',
        pois: [{
          id: Math.random().toString(36).substring(2, 10),
          name: cleanName,
          type: "景点",
          address: `${city}市${cleanName}`,
          location: `${defaultResult.location.longitude},${defaultResult.location.latitude}`,
          rating: defaultResult.rating
        }]
      };
      
      return defaultResult;
    }
  } catch (err) {
    error(`搜索景点POI信息失败 (${cleanName}):`, err);
    warn(`为景点 "${cleanName}" 使用随机坐标作为兜底`);
    // 出错时返回一个默认值
    return {
      name: cleanName,
      address: `${city}市${cleanName}`,
      location: {
        longitude: parseFloat((getCityCoordinates(city).longitude + (Math.random() - 0.5) * 0.02).toFixed(6)),
        latitude: parseFloat((getCityCoordinates(city).latitude + (Math.random() - 0.5) * 0.02).toFixed(6))
      },
      rating: (4 + Math.random()).toFixed(1),
      category: "景点"
    };
  }
}

// 高德地图路线规划
export async function getRouteDirection(
  origin: [number, number], 
  destination: [number, number], 
  type: 'walking' | 'driving' | 'transit' = 'driving'
) {
  if (USE_MOCK_DATA) {
    // 模拟路线数据
    return {
      status: '1',
      info: 'OK',
      route: {
        paths: [
          {
            distance: 5000,
            duration: 1200,
            steps: []
          }
        ]
      }
    };
  }

  try {
    const response = await retryableAxiosRequest(() => axios.get(`https://restapi.amap.com/v5/direction/${type}`, {
      params: {
        key: ENV.AMAP_API_KEY,
        origin: origin.join(','),
        destination: destination.join(','),
        show_fields: 'cost,restriction,tmcs'
      },
      timeout: API_TIMEOUT
    }));
    return response.data;
  } catch (err) {
    error('路线规划出错:', err);
    throw err;
  }
}

// 调用硅基流动API生成旅行计划
export async function generateTripPlan(formData: TripFormData): Promise<DeepseekResponse> {
  console.log('=== 开始生成旅行计划 ===');
  console.log('表单数据:', formData);
  console.log('USE_MOCK_DATA:', USE_MOCK_DATA);
  console.log('USE_FALLBACK_DATA:', USE_FALLBACK_DATA);
  
  if (USE_MOCK_DATA) {
    console.log('使用模拟数据生成旅行计划');
    // 使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟延迟
    
    // 根据表单数据调整模拟数据
    const customizedTripPlan = {
      ...mockTripPlan,
      city: formData.city,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: mockTripPlan.days.slice(0, formData.travelDays).map((day, index) => ({
        ...day,
        date: new Date(new Date(formData.startDate).getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayIndex: index,
        transportation: formData.transportation,
        accommodation: formData.accommodation
      }))
    };
    
    return {
      result: 'success',
      tripPlan: customizedTripPlan
    };
  }

  try {
    // 使用代理路径替代直接访问API
    const response = await retryableAxiosRequest(() => axios.post('https://api.siliconflow.cn/v1/chat/completions', {
      model: "Qwen/Qwen3-235B-A22B",
      messages: [
        {
          role: "system",
          content: `你是一个专业的旅行规划助手，擅长根据用户需求定制个性化旅行计划。

【生成原则】
1. 必须根据用户指定的旅行天数（X天）动态生成X天的完整行程
2. 每天应安排多个景点，根据景点规模、游览价值和距离合理分配
3. 考虑用户的交通方式和住宿偏好，设计合理的游览路线
4. 针对用户提供的偏好标签（如"美食"、"历史"、"自然风光"等），优先推荐相关景点
5. 确保返回标准JSON格式，所有字段完整有效

【输出格式】
请按照以下JSON结构返回行程计划（注意：days数组长度必须与用户指定的旅行天数一致）：
{
  "travel_plan": {
    "destination": "用户指定的目的地",
    "start_date": "用户指定的开始日期",
    "end_date": "用户指定的结束日期",
    "duration": 用户指定的天数(整数),
    "accommodation": "用户指定的住宿类型",
    "transportation": "用户指定的交通方式",
    "days": [
      // 这里应该有与用户指定天数相同数量的日程对象
      {
        "day": 天数序号(从1开始),
        "date": "具体日期(YYYY-MM-DD格式)",
        "activities": [
          // 每天景点活动(合理范围内尽量多安排，除非用户另外要求)
          {
            "type": "景点",
            "name": "景点名称",
            "description": "景点描述(100-200字)",
            "suggested_duration": "建议游览时间(小时)",
            "tips": "实用建议"
          }
          // 可以有多个景点，不需要写注释
        ],
        "meals": {
          "breakfast": "早餐建议",
          "lunch": "午餐建议",
          "dinner": "晚餐建议"
        }
      }
      // 重复上述日程结构，直到达到用户指定的天数
    ]
  }
}`
        },
        {
          role: "user",
          content: `请帮我规划一次${formData.city}旅行，从${formData.startDate}到${formData.endDate}，共${Number(formData.travelDays)}天。
出行方式：${formData.transportation}
住宿选择：${formData.accommodation}
旅行偏好：${formData.preferences.join('，')}
额外要求：${formData.freeTextInput}

请特别注意：
1. 必须安排${Number(formData.travelDays)}天的行程，不多不少
2. 根据景点类型、距离和游览时间，每天合理安排多个景点(建议更加充实，除非偏好内另有提及)
3. 考虑我的交通方式(${formData.transportation})，合理规划游览顺序
4. 根据我的偏好(${formData.preferences.join('，')})推荐适合的景点和餐饮
5. 返回标准JSON格式，确保完整且无语法错误`
        }
      ],
      response_format: { type: "json_object" },
      stream: false,
      max_tokens: 8192,
      enable_thinking: false,
      thinking_budget: 4096,
      min_p: 0.00,
      temperature: 0.6,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.0,
      n: 1,
      stop: []
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.DEEPSEEK_API_KEY}`
      },
      timeout: API_TIMEOUT
    }));

    // 解析响应
    try {
      // 使用专门的解析函数解析DeepSeek API响应
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        try {
          // 尝试使用新的专用解析函数
          const parsedData = parseDeepseekResponse(response.data);
          
          // 使用新的标准化函数处理不同的数据格式
          const standardizedData = standardizeTripPlanFormat(parsedData, formData);
          
          // 检查解析后的数据
          if (standardizedData && (standardizedData.tripPlan || (standardizedData.travel_plan && !standardizedData.tripPlan))) {
            log('成功解析API响应数据，开始处理行程');
            
            // 确保数据有tripPlan字段
            const dataToProcess = standardizedData.tripPlan ? standardizedData : standardizedData;
            
            // 创建多天行程 - 解决dayIndex始终为1的问题
            const processedData = await createMultiDayTrip(dataToProcess, formData);
            
            // 返回处理后的结果
            return {
              result: 'success',
              tripPlan: processedData.tripPlan
            };
          } else {
            error('API返回的数据不包含tripPlan对象');
            throw new Error('API返回的数据不包含旅行计划信息');
          }
        } catch (parseError) {
          error('使用新解析函数处理API响应失败:', parseError);
          
          // 尝试使用旧方法解析
          const content = response.data.choices[0].message.content;
          log('尝试使用旧方法解析API响应内容');
          
          try {
            // 使用旧方法尝试解析
            const cleanedContent = content
              .trim()
              .replace(/\n/g, ' ')
              .replace(/\\n/g, ' ')
              .replace(/\\"/g, '"');
              
            const parsedData = JSON.parse(cleanedContent);
            
            if (parsedData && parsedData.tripPlan) {
              log('使用旧方法成功解析API响应数据');
              
              // 使用多天行程处理函数处理数据
              const processedData = await createMultiDayTrip(parsedData, formData);
              
              return {
                result: 'success',
                tripPlan: processedData.tripPlan
              };
            }
          } catch (oldMethodError) {
            error('旧方法解析API响应也失败:', oldMethodError);
          }
          
          // 如果不允许回退到模拟数据，直接抛出错误
          if (!USE_FALLBACK_DATA) {
            throw new Error('无法解析API返回的数据，请检查API响应格式');
          }
          
          // 回退到模拟数据
          warn('所有解析方法均失败，回退到模拟数据');
          return {
            result: 'fallback-parse-failed',
            tripPlan: {
              ...mockTripPlan,
              city: formData.city,
              startDate: formData.startDate,
              endDate: formData.endDate,
              days: mockTripPlan.days.slice(0, formData.travelDays).map((day, index) => ({
                ...day,
                date: new Date(new Date(formData.startDate).getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                dayIndex: index,
                transportation: formData.transportation,
                accommodation: formData.accommodation
              }))
            }
          };
        }
      } else {
        error('API响应格式不正确，缺少必要的choices字段');
        throw new Error('API响应格式不正确');
      }
    } catch (err) {
      error('解析API响应时出错:', err);
      
      // 如果不允许回退到模拟数据，直接抛出错误
      if (!USE_FALLBACK_DATA) {
        throw error;
      }
      
      // 回退到模拟数据
      return {
        result: 'fallback',
        tripPlan: {
          ...mockTripPlan,
          city: formData.city,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days: mockTripPlan.days.slice(0, formData.travelDays).map((day, index) => ({
            ...day,
            date: new Date(new Date(formData.startDate).getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dayIndex: index,
            transportation: formData.transportation,
            accommodation: formData.accommodation
          }))
        }
      };
    }
  } catch (err) {
    error('生成旅行计划出错:', err);
    
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      
      // 记录错误信息
      if (status === 400) {
        error('请求参数错误:', message);
      } else if (status === 401) {
        error('API Key无效');
      } else if (status === 403) {
        error('权限不足，可能需要实名认证:', message);
      } else if (status === 429) {
        error('触发限流:', message);
      } else if (status === 503 || status === 504) {
        error('服务负载高，稍后重试');
      } else if (err.code === 'ECONNABORTED') {
        error('请求超时');
      }
      
      // 如果不允许回退到模拟数据，直接抛出错误
      if (!USE_FALLBACK_DATA) {
        throw err;
      }
      
      // 回退到模拟数据
      return {
        result: 'fallback',
        tripPlan: {
          ...mockTripPlan,
          city: formData.city,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days: mockTripPlan.days.slice(0, formData.travelDays).map((day, index) => ({
            ...day,
            date: new Date(new Date(formData.startDate).getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dayIndex: index,
            transportation: formData.transportation,
            accommodation: formData.accommodation
          }))
        }
      };
    }
    
    throw err;
  }
}

// ========== 妙游应用新增API功能 ==========

// 获取园区所有地点
export async function getLocations(): Promise<ApiResponse<Location[]>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockLocations
    };
  } catch (error) {
    return {
      success: false,
      error: '获取地点信息失败'
    };
  }
}

// 生成智能路线
export async function generateRoute(request: RouteRequest): Promise<ApiResponse<GeneratedRoute>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 根据目的地和偏好生成路线
    const destination = mockLocations.find(loc => 
      loc.name.includes(request.destination) || 
      request.destination.includes(loc.name)
    );
    
    if (!destination) {
      return {
        success: false,
        error: '未找到指定的目的地'
      };
    }
    
    // 根据偏好筛选地点
    const filteredLocations = mockLocations.filter(loc => {
      if (request.preferences.length === 0) return true;
      return request.preferences.some(pref => loc.tags.includes(pref));
    });
    
    // 生成路线节点
    const nodes = filteredLocations.slice(0, 4).map((location, index) => {
      const startHour = 9 + Math.floor(index * 1.5);
      const time = `${startHour.toString().padStart(2, '0')}:${index === 0 ? '00' : '30'}`;
      
      return {
        time,
        location,
        activity: getActivitySuggestion(location, request.preferences),
        alert: getAlertInfo(location, index),
        coordinates: location.coordinates,
        estimatedDuration: location.visitDuration || 60
      };
    });
    
    const route: GeneratedRoute = {
      id: `route-${Date.now()}`,
      title: `${request.destination}智能路线`,
      description: `根据您的偏好生成的个性化路线`,
      nodes,
      totalDuration: nodes.reduce((sum, node) => sum + node.estimatedDuration, 0),
      totalDistance: Math.floor(Math.random() * 1000) + 500,
      createdAt: new Date().toISOString(),
      isSaved: false
    };
    
    return {
      success: true,
      data: route
    };
  } catch (error) {
    return {
      success: false,
      error: '生成路线失败'
    };
  }
}

// 获取智能推荐
export async function getRecommendations(userLocation: UserLocation): Promise<ApiResponse<Recommendation[]>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 根据用户位置计算距离并生成推荐
    const recommendations = mockRecommendations.map(rec => ({
      ...rec,
      distance: Math.floor(Math.random() * 500) + 100 // 模拟距离计算
    }));
    
    return {
      success: true,
      data: recommendations
    };
  } catch (error) {
    return {
      success: false,
      error: '获取推荐失败'
    };
  }
}

// 保存路线
export async function saveRoute(routeId: string): Promise<ApiResponse<boolean>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: true
    };
  } catch (error) {
    return {
      success: false,
      error: '保存路线失败'
    };
  }
}

// 生成旅行日记
export async function generateDiary(request: DiaryCreateRequest): Promise<DiaryGenerationResponse> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 模拟AI生成日记内容
    const diary: Diary = {
      id: `diary-${Date.now()}`,
      title: request.title || '我的妙游日记',
      content: generateMockDiaryContent(request.images.length),
      images: request.images.map((file, index) => ({
        id: `img-${index}`,
        url: URL.createObjectURL(file),
        originalName: file.name,
        uploadTime: new Date().toISOString(),
        description: `第${index + 1}张照片的AI生成描述`
      })),
      routeId: request.routeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false
    };
    
    return {
      success: true,
      diary
    };
  } catch (error) {
    return {
      success: false,
      error: '生成日记失败'
    };
  }
}

// 获取用户个人中心数据
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: mockUserProfile
    };
  } catch (error) {
    return {
      success: false,
      error: '获取用户信息失败'
    };
  }
}

// 获取用户保存的路线
export async function getSavedRoutes(): Promise<ApiResponse<GeneratedRoute[]>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockGeneratedRoutes
    };
  } catch (error) {
    return {
      success: false,
      error: '获取保存的路线失败'
    };
  }
}

// 获取用户日记列表
export async function getDiaries(): Promise<ApiResponse<Diary[]>> {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockDiaries
    };
  } catch (error) {
    return {
      success: false,
      error: '获取日记列表失败'
    };
  }
}

// 辅助函数：生成活动建议
function getActivitySuggestion(location: Location, preferences: string[]): string {
  const suggestions = {
    '主展厅': '参观最新科技展示，体验互动装置',
    '丰年培训室': '参加技术培训或讲座',
    '百度咖啡厅': '休息放松，享用咖啡和甜点',
    'K2创新空间': '体验创新项目，参与互动展示',
    'AI体验馆': '体验AI技术，参与智能互动',
    '员工餐厅': '享用多样化餐饮选择',
    '会议室': '进行商务洽谈或团队会议',
    '休闲花园': '放松身心，拍照留念'
  };
  
  return suggestions[location.name as keyof typeof suggestions] || '参观体验';
}

// 辅助函数：生成提醒信息
function getAlertInfo(location: Location, index: number): any {
  if (location.crowdLevel === 'high') {
    return {
      type: 'warning',
      message: '当前人流较多，建议错峰体验'
    };
  }
  
  if (index === 0) {
    return {
      type: 'info',
      message: '避开上下班人流量高峰'
    };
  }
  
  return undefined;
}

// 辅助函数：生成模拟日记内容
function generateMockDiaryContent(imageCount: number): string {
  return `# 我的妙游日记

## 今日行程

今天在百度科技园度过了愉快的一天，参观了多个精彩的地点。

### 主要体验

${Array.from({ length: imageCount }, (_, i) => `#### 第${i + 1}站
这是第${i + 1}张照片记录的美好时刻，体验了前沿的科技展示和互动装置。`).join('\n\n')}

## 总结

今天的参观让我对百度在AI领域的技术实力有了更深入的了解，是一次非常有意义的科技之旅！

*生成时间：${new Date().toLocaleString('zh-CN')}*
`;
}
