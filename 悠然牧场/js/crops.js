// 作物系统 - 管理作物数据

export class CropsManager {
    constructor() {
        this.cropsData = {};
        this.loaded = false;
    }

    async load() {
        try {
            const response = await fetch('assets/data/crops.json');
            this.cropsData = await response.json();
            this.loaded = true;
            console.log('作物数据加载完成:', Object.keys(this.cropsData).length, '种作物');
            return true;
        } catch (error) {
            console.error('加载作物数据失败:', error);
            return false;
        }
    }

    // 获取作物数据
    getCrop(cropId) {
        return this.cropsData[cropId] || null;
    }

    // 获取所有作物
    getAllCrops() {
        return Object.values(this.cropsData);
    }

    // 获取当季作物
    getSeasonCrops(season) {
        return this.getAllCrops().filter(crop => crop.season === season);
    }

    // 检查作物是否适合当季
    isSeasonMatch(cropId, season) {
        const crop = this.getCrop(cropId);
        return crop && crop.season === season;
    }

    // 获取种子信息（用于商店）
    getSeedInfo(cropId) {
        const crop = this.getCrop(cropId);
        if (!crop) return null;

        return {
            id: `${cropId}_seed`,
            name: `${crop.name}种子`,
            icon: '🌱',
            cropId: cropId,
            price: crop.seedPrice,
            season: crop.season
        };
    }

    // 获取所有种子
    getAllSeeds() {
        return this.getAllCrops().map(crop => this.getSeedInfo(crop.id));
    }

    // 获取当季种子
    getSeasonSeeds(season) {
        return this.getSeasonCrops(season).map(crop => this.getSeedInfo(crop.id));
    }
}
