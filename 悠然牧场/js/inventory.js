// 背包系统 - 管理玩家物品

export class Inventory {
    constructor(maxSlots = 20) {
        this.maxSlots = maxSlots;
        this.items = {}; // { itemId: { id, name, icon, count } }
    }

    // 添加物品
    addItem(item) {
        const existing = this.items[item.id];

        if (existing) {
            existing.count += item.count || 1;
        } else {
            if (Object.keys(this.items).length >= this.maxSlots) {
                return false; // 背包已满
            }
            this.items[item.id] = {
                id: item.id,
                name: item.name,
                icon: item.icon,
                count: item.count || 1,
                type: item.type || 'item',
                price: item.price || 0
            };
        }

        return true;
    }

    // 移除物品
    removeItem(itemId, count = 1) {
        const item = this.items[itemId];

        if (!item) return false;

        item.count -= count;

        if (item.count <= 0) {
            delete this.items[itemId];
        }

        return true;
    }

    // 检查物品数量
    getItemCount(itemId) {
        return this.items[itemId]?.count || 0;
    }

    // 检查是否拥有物品
    hasItem(itemId) {
        return this.getItemCount(itemId) > 0;
    }

    // 获取所有物品
    getAllItems() {
        return Object.values(this.items);
    }

    // 获取种子类物品
    getSeeds() {
        return this.getAllItems().filter(item => item.type === 'seed');
    }

    // 获取农产品
    getCrops() {
        return this.getAllItems().filter(item => item.type === 'crop');
    }

    // 清空背包
    clear() {
        this.items = {};
    }

    // 序列化
    serialize() {
        return {
            items: this.items,
            maxSlots: this.maxSlots
        };
    }

    // 反序列化
    deserialize(data) {
        if (data) {
            this.items = data.items || {};
            this.maxSlots = data.maxSlots || 20;
        }
    }
}
