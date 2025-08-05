import axios from 'axios';

// 高德地图API密钥
const AMAP_API_KEY = '0e0fd55a0895078cb45ae6676e6f0773';

// 测试不同的搜索策略
async function testPOISearch() {
  const testCases = [
    {
      name: '山西博物院',
      city: '太原',
      description: '原始搜索'
    },
    {
      name: '博物院',
      city: '太原',
      description: '简化关键词搜索'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n=== 测试: ${testCase.description} ===`);
    console.log(`关键词: ${testCase.name}, 城市: ${testCase.city}`);
    
    try {
      // 测试1: 使用v3版本的API
      console.log('\n--- 测试v3版本API ---');
      const response1 = await axios.get('https://restapi.amap.com/v3/place/text', {
        params: {
          key: AMAP_API_KEY,
          keywords: testCase.name,
          city: testCase.city,
          citylimit: true,
          types: '风景名胜',
          offset: 10,
          page: 1
        },
        timeout: 10000
      });
      
      console.log('v3 API结果:');
      console.log('状态:', response1.data.status);
      console.log('结果数量:', response1.data.pois?.length || 0);
      if (response1.data.pois && response1.data.pois.length > 0) {
        console.log('第一个结果:', response1.data.pois[0].name);
      }
      
      // 测试2: 使用v5版本的API
      console.log('\n--- 测试v5版本API ---');
      const response2 = await axios.get('https://restapi.amap.com/v5/place/text', {
        params: {
          key: AMAP_API_KEY,
          keywords: testCase.name,
          city: testCase.city,
          citylimit: true,
          types: '风景名胜',
          offset: 10,
          page: 1
        },
        timeout: 10000
      });
      
      console.log('v5 API结果:');
      console.log('状态:', response2.data.status);
      console.log('结果数量:', response2.data.pois?.length || 0);
      if (response2.data.pois && response2.data.pois.length > 0) {
        console.log('第一个结果:', response2.data.pois[0].name);
      }
      
      // 测试3: 不带城市限制的搜索
      console.log('\n--- 测试不带城市限制 ---');
      const response3 = await axios.get('https://restapi.amap.com/v3/place/text', {
        params: {
          key: AMAP_API_KEY,
          keywords: testCase.name,
          offset: 10,
          page: 1
        },
        timeout: 10000
      });
      
      console.log('不带城市限制结果:');
      console.log('状态:', response3.data.status);
      console.log('结果数量:', response3.data.pois?.length || 0);
      if (response3.data.pois && response3.data.pois.length > 0) {
        console.log('前3个结果:');
        response3.data.pois.slice(0, 3).forEach((poi, index) => {
          console.log(`  ${index + 1}. ${poi.name} (${poi.cityname})`);
        });
      }
      
      // 测试4: 测试API密钥是否有效
      console.log('\n--- 测试API密钥有效性 ---');
      const response4 = await axios.get('https://restapi.amap.com/v3/geocode/geo', {
        params: {
          key: AMAP_API_KEY,
          address: '北京天安门'
        },
        timeout: 10000
      });
      
      console.log('地理编码测试结果:');
      console.log('状态:', response4.data.status);
      console.log('信息:', response4.data.info);
      
    } catch (error) {
      console.error('API调用失败:', error.message);
      if (error.response) {
        console.error('响应状态:', error.response.status);
        console.error('响应数据:', error.response.data);
      }
    }
    
    // 等待2秒再测试下一个
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// 运行测试
testPOISearch().catch(console.error); 