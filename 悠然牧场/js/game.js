// 游戏核心

const W = 1024, H = 640;

// 季节与天气
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_NAMES = { spring: '春天', summer: '夏天', autumn: '秋天', winter: '冬天' };
const WEATHERS = ['sunny', 'cloudy', 'rainy'];
const WEATHER_NAMES = { sunny: '☀️ 晴天', cloudy: '☁️ 多云', rainy: '🌧️ 雨天' };

export function createState() {
    return {
        money: 500,
        energy: 100,
        maxEnergy: 100,
        day: 1,
        season: 'spring',
        weather: 'sunny',
        tool: 'hoe',
        selectedSeed: 'potato',
    };
}

export function nextDay(state) {
    state.day++;
    if (state.day > 28) {
        state.day = 1;
        state.season = SEASONS[(SEASONS.indexOf(state.season) + 1) % 4];
    }
    state.weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
    state.energy = state.maxEnergy;
    return state.weather === 'rainy';
}

// 体力消耗表 — 不同工具消耗不同体力
const ENERGY_COST = { hoe: 5, water: 2, seed: 3, harvest: 4 };
export function spendEnergy(state, actionType) {
    const cost = ENERGY_COST[actionType] || 2;
    if (state.energy >= cost) { state.energy -= cost; return true; }
    return false;
}

export { W, H, SEASONS, SEASON_NAMES, WEATHER_NAMES };

// ---- 场景绘制 ----
export function drawScene(ctx, state) {
    // 背景由 #farm-bg-video 视频层负责，canvas 保持透明
}
