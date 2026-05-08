// 商店系统

// 价格波动范围：-20% 到 +30%
const PRICE_FLUCTUATION = {
    min: 0.8,
    max: 1.3
};

export class Shop {
    constructor(state, inventory, cm) {
        this.state = state;
        this.inventory = inventory;
        this.cm = cm;
        this.priceMultipliers = {}; // 存储每种作物的价格乘数
        this.lastUpdateDay = null;
    }

    // 更新价格波动（每天调用一次）
    updatePrices(day) {
        if (this.lastUpdateDay === day) return;
        this.lastUpdateDay = day;
        
        const allCrops = this.cm.getAllCrops();
        this.priceMultipliers = {};
        
        allCrops.forEach(crop => {
            // 随机生成价格乘数
            const multiplier = PRICE_FLUCTUATION.min + 
                Math.random() * (PRICE_FLUCTUATION.max - PRICE_FLUCTUATION.min);
            this.priceMultipliers[crop.id] = Math.round(multiplier * 100) / 100;
        });
    }

    // 获取种子购买价格（包含波动）
    getSeedBuyPrice(seedId) {
        const cropId = seedId.replace('_seed', '');
        const seed = this.cm.getSeedInfo(cropId);
        if (!seed) return null;
        
        const multiplier = this.priceMultipliers[cropId] || 1;
        return Math.round(seed.price * multiplier);
    }

    // 获取作物出售价格（包含波动）
    getCropSellPrice(cropId) {
        const crop = this.cm.getCrop(cropId);
        if (!crop) return null;
        
        const multiplier = this.priceMultipliers[cropId] || 1;
        return Math.round(crop.sellPrice * multiplier);
    }

    buy(seedId) {
        const cropId = seedId.replace('_seed', '');
        const seed = this.cm.getSeedInfo(cropId);
        if (!seed) return { ok: false, msg: '物品不存在' };

        // 更新价格
        this.updatePrices(this.state.day);
        
        const cost = this.getSeedBuyPrice(seedId);
        if (this.state.money < cost) return { ok: false, msg: '💰 金钱不足' };

        this.state.money -= cost;
        const added = this.inventory.addItem({
            id: seed.id,
            name: seed.name,
            icon: '🌱',
            count: 1,
            type: 'seed',
            cropId: seed.cropId,
            season: seed.season,
        });

        if (!added) return { ok: false, msg: '背包已满' };
        return { ok: true, msg: `买了${seed.name} -${cost}G` };
    }

    sell(itemId) {
        const item = this.inventory.items[itemId];
        if (!item || item.count < 1) return { ok: false, msg: '物品不足' };
        if (!item.price) return { ok: false, msg: '此物品无法出售' };

        // 更新价格
        this.updatePrices(this.state.day);
        
        // 计算实际出售价格
        let sellPrice = item.price;
        if (item.cropId) {
            const dynamicPrice = this.getCropSellPrice(item.cropId);
            if (dynamicPrice) sellPrice = dynamicPrice;
        }

        this.state.money += sellPrice;
        this.inventory.removeItem(itemId, 1);
        return { ok: true, msg: `出售${item.name} +${sellPrice}G` };
    }
}
