import React, { useState } from 'react';
import { Search, Apple, Beef, Fish, Egg, Sandwich, Carrot, Cookie, Wheat } from 'lucide-react';

type FoodCategory = {
  icon: React.ElementType;
  name: string;
  items: string[];
};

const categories: FoodCategory[] = [
  {
    icon: Wheat,
    name: "主食类",
    items: ["白米饭", "糙米饭", "馒头", "面包", "燕麦片", "玉米", "红薯", "土豆", "意大利面", "荞麦面"]
  },
  {
    icon: Beef,
    name: "肉类",
    items: ["鸡胸肉", "鸡腿肉", "猪里脊", "猪五花", "牛里脊", "牛肉馅", "羊肉", "鸭肉", "火腿", "培根"]
  },
  {
    icon: Fish,
    name: "海鲜类",
    items: ["三文鱼", "金枪鱼", "虾", "螃蟹", "鳕鱼", "带鱼", "鲈鱼", "章鱼", "贝类", "海带"]
  },
  {
    icon: Egg,
    name: "蛋奶类",
    items: ["鸡蛋", "鸭蛋", "鹌鹑蛋", "全脂牛奶", "脱脂牛奶", "酸奶", "奶酪", "黄油", "酸奶油", "奶粉"]
  },
  {
    icon: Cookie,
    name: "豆制品",
    items: ["豆腐", "豆干", "腐竹", "豆浆", "豆芽", "纳豆", "豆腐皮", "素鸡", "豆瓣酱", "豆豉"]
  },
  {
    icon: Carrot,
    name: "蔬菜类",
    items: ["西兰花", "菠菜", "生菜", "黄瓜", "西红柿", "胡萝卜", "茄子", "青椒", "白菜", "韭菜"]
  },
  {
    icon: Apple,
    name: "水果类",
    items: ["苹果", "香蕉", "橙子", "葡萄", "西瓜", "草莓", "蓝莓", "梨", "柚子", "火龙果"]
  },
  {
    icon: Cookie,
    name: "坚果类",
    items: ["花生", "杏仁", "核桃", "开心果", "腰果", "瓜子", "松子", "榛子", "芝麻", "南瓜子"]
  },
  {
    icon: Cookie,
    name: "零食饮品",
    items: ["薯片", "巧克力", "冰淇淋", "可乐", "果汁", "啤酒", "红酒", "奶茶", "咖啡", "绿茶"]
  },
  {
    icon: Sandwich,
    name: "快餐食品",
    items: ["汉堡", "披萨", "炸鸡", "薯条", "三明治", "寿司", "春卷", "炒面", "饺子", "包子"]
  }
];

// Expanded food database with 100 items
const foodDatabase = {
  // 主食类
  "白米饭": 116,
  "糙米饭": 111,
  "馒头": 223,
  "面包": 265,
  "燕麦片": 389,
  "玉米": 96,
  "红薯": 86,
  "土豆": 77,
  "意大利面": 158,
  "荞麦面": 345,
  
  // 肉类
  "鸡胸肉": 165,
  "鸡腿肉": 186,
  "猪里脊": 143,
  "猪五花": 395,
  "牛里脊": 250,
  "牛肉馅": 280,
  "羊肉": 203,
  "鸭肉": 240,
  "火腿": 145,
  "培根": 541,
  
  // 海鲜类
  "三文鱼": 208,
  "金枪鱼": 184,
  "虾": 99,
  "螃蟹": 97,
  "鳕鱼": 82,
  "带鱼": 104,
  "鲈鱼": 96,
  "章鱼": 82,
  "贝类": 99,
  "海带": 43,
  
  // 蛋奶类
  "鸡蛋": 155,
  "鸭蛋": 185,
  "鹌鹑蛋": 158,
  "全脂牛奶": 66,
  "脱脂牛奶": 34,
  "酸奶": 70,
  "奶酪": 349,
  "黄油": 717,
  "酸奶油": 193,
  "奶粉": 515,
  
  // 豆制品
  "豆腐": 76,
  "豆干": 145,
  "腐竹": 225,
  "豆浆": 31,
  "豆芽": 30,
  "纳豆": 212,
  "豆腐皮": 291,
  "素鸡": 243,
  "豆瓣酱": 178,
  "豆豉": 165,
  
  // 蔬菜类
  "西兰花": 34,
  "菠菜": 23,
  "生菜": 15,
  "黄瓜": 16,
  "西红柿": 20,
  "胡萝卜": 41,
  "茄子": 25,
  "青椒": 20,
  "白菜": 16,
  "韭菜": 27,
  
  // 水果类
  "苹果": 52,
  "香蕉": 89,
  "橙子": 47,
  "葡萄": 69,
  "西瓜": 32,
  "草莓": 32,
  "蓝莓": 57,
  "梨": 57,
  "柚子": 43,
  "火龙果": 60,
  
  // 坚果类
  "花生": 567,
  "杏仁": 579,
  "核桃": 654,
  "开心果": 557,
  "腰果": 553,
  "瓜子": 573,
  "松子": 673,
  "榛子": 628,
  "芝麻": 573,
  "南瓜子": 559,
  
  // 零食饮品
  "薯片": 536,
  "巧克力": 545,
  "冰淇淋": 207,
  "可乐": 42,
  "果汁": 54,
  "啤酒": 43,
  "红酒": 83,
  "奶茶": 88,
  "咖啡": 2,
  "绿茶": 0,
  
  // 快餐食品
  "汉堡": 254,
  "披萨": 266,
  "炸鸡": 337,
  "薯条": 312,
  "三明治": 300,
  "寿司": 350,
  "春卷": 350,
  "炒面": 337,
  "饺子": 233,
  "包子": 256
} as const;

function App() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<{ name: string; calories: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (input: string) => {
    setSearch(input);
    const foodName = Object.keys(foodDatabase).find(
      food => food.toLowerCase().includes(input.toLowerCase())
    );
    
    if (foodName) {
      setResult({
        name: foodName,
        calories: foodDatabase[foodName as keyof typeof foodDatabase]
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            食物卡路里查询
          </h1>
          
          <div className="relative mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索食物名称..."
              className="w-full px-6 py-4 pl-12 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-5 text-gray-400 h-6 w-6" />
          </div>

          {result && (
            <div className="mb-8 transform transition-all duration-200 ease-in-out">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {result.name}
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-lg">每100克热量：</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-green-600 mr-2">
                      {result.calories}
                    </span>
                    <span className="text-green-600">千卡</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {search && !result && (
            <div className="text-center text-gray-500 my-8 animate-fade-in">
              未找到相关食物
            </div>
          )}

          {!search && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-6">食物分类</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.name ? null : category.name
                    )}
                    className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      selectedCategory === category.name
                        ? 'bg-green-100 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="mt-8 animate-fade-in">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {selectedCategory}食物列表
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories
                      .find(cat => cat.name === selectedCategory)
                      ?.items.map((food) => (
                        <button
                          key={food}
                          onClick={() => handleSearch(food)}
                          className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all text-sm text-gray-700"
                        >
                          {food}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;