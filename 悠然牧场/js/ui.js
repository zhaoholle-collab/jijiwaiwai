// UI 面板管理

import { SEASON_NAMES, WEATHER_NAMES } from './game.js';

export class UI {
    constructor(state, shop, inventory, cm, audio) {
        this.state = state;
        this.shop = shop;
        this.inventory = inventory;
        this.cm = cm;
        this.audio = audio;

        this.els = {
            money:      document.getElementById('money'),
            energyText: document.getElementById('energy-text'),
            energyFill: document.getElementById('energy-fill'),
            date:       document.getElementById('date'),
            weather:    document.getElementById('weather'),
            shopPanel:  document.getElementById('shop-panel'),
            invPanel:   document.getElementById('inventory-panel'),
            buyGrid:    document.getElementById('buy-grid'),
            sellGrid:   document.getElementById('sell-grid'),
            invGrid:    document.getElementById('inventory-grid'),
            buyTab:     document.getElementById('buy-tab'),
            sellTab:    document.getElementById('sell-tab'),
            msgContainer: document.getElementById('message-container'),
        };

        this.bind();
    }

    bind() {
        // 工具槽点击
        document.querySelectorAll('.slot[data-tool]').forEach(s => {
            s.addEventListener('click', () => this.selectTool(s.dataset.tool));
        });
        // 功能按钮
        const shopBtn = document.getElementById('shop-btn');
        const invBtn  = document.getElementById('inventory-btn');
        const sleepBtn = document.getElementById('sleep-btn');
        if (shopBtn)  shopBtn.addEventListener('click', () => this.toggleShop());
        if (invBtn)   invBtn.addEventListener('click', () => this.toggleInventory());
        if (sleepBtn) sleepBtn.addEventListener('click', () => {
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }));
        });
        // 关闭按钮
        document.querySelectorAll('.close-btn').forEach(b => {
            b.addEventListener('click', () => this.closeAllPanels());
        });
        // 标签页
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.addEventListener('click', () => this.switchShopTab(b.dataset.tab));
        });
    }

    update() {
        this.els.money.textContent = this.state.money;
        this.els.energyText.textContent = this.state.energy;
        // 更新体力进度条
        const pct = (this.state.energy / this.state.maxEnergy) * 100;
        this.els.energyFill.style.width = pct + '%';
        this.els.date.textContent = `${SEASON_NAMES[this.state.season]} 第${this.state.day}天`;
        this.els.weather.textContent = WEATHER_NAMES[this.state.weather];
        this.updateQuickBar();
    }

    updateQuickBar() {
        const crops = this.inventory.getCrops();
        for (let i = 0; i < 3; i++) {
            const el = document.getElementById(`slot-${i}-count`);
            if (el) el.textContent = crops[i] ? crops[i].count : 0;
        }
    }

    selectTool(tool) {
        this.state.tool = tool;
        document.querySelectorAll('.slot[data-tool]').forEach(s => {
            s.classList.toggle('active', s.dataset.tool === tool);
        });
    }

    toggleShop() {
        if (this.els.shopPanel.classList.contains('hidden')) {
            this.closeAllPanels();
            this.els.shopPanel.classList.remove('hidden');
            this.renderBuy();
        } else {
            this.els.shopPanel.classList.add('hidden');
        }
    }

    switchShopTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        this.els.buyTab.classList.toggle('hidden', tab !== 'buy');
        this.els.sellTab.classList.toggle('hidden', tab !== 'sell');
    }

    renderBuy() {
        // 更新价格波动
        this.shop.updatePrices(this.state.day);
        
        const seeds = this.cm.getAllSeeds();
        this.els.buyGrid.innerHTML = seeds.map(s => {
            const basePrice = s.price;
            const currentPrice = this.shop.getSeedBuyPrice(s.id) || basePrice;
            const multiplier = this.shop.priceMultipliers[s.cropId] || 1;
            const isDiscount = multiplier < 1;
            const isPremium = multiplier > 1;
            
            let priceIndicator = '';
            if (isDiscount) {
                priceIndicator = `<span style="color:#4CAF50;">↓ ${Math.round((1 - multiplier) * 100)}%</span>`;
            } else if (isPremium) {
                priceIndicator = `<span style="color:#FF5722;">↑ ${Math.round((multiplier - 1) * 100)}%</span>`;
            }
            
            return `
            <div class="shop-item" data-seed="${s.cropId}">
                <span class="item-icon">🌱</span>
                <div class="item-info">
                    <div class="item-name">${s.name}</div>
                    <div class="item-price">
                        ${currentPrice}G
                        ${priceIndicator}
                    </div>
                    <div class="item-stock">${s.season === this.state.season ? '✓ 当季' : `(${this.cm.getCrop(s.cropId)?.season || '?'}季)`}</div>
                </div>
            </div>
        `}).join('');

        this.els.buyGrid.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', () => {
                const r = this.shop.buy(item.dataset.seed);
                if (this.audio) this.audio.playSfx(r.ok ? 'buy' : 'error');
                this.showMsg(r.msg);
                this.update();
                this.renderBuy();
                this.renderSell();
            });
        });
    }

    renderSell() {
        // 更新价格波动
        this.shop.updatePrices(this.state.day);
        
        const items = this.inventory.getAllItems().filter(i => i.price > 0);
        if (items.length === 0) {
            this.els.sellGrid.innerHTML = '<p style="color:#888;grid-column:span 2;">背包里没有可出售的物品</p>';
            return;
        }
        this.els.sellGrid.innerHTML = items.map(i => {
            let currentPrice = i.price;
            let priceIndicator = '';
            
            if (i.cropId) {
                const crop = this.cm.getCrop(i.cropId);
                if (crop) {
                    const basePrice = crop.sellPrice;
                    currentPrice = this.shop.getCropSellPrice(i.cropId) || basePrice;
                    const multiplier = this.shop.priceMultipliers[i.cropId] || 1;
                    const isDiscount = multiplier < 1;
                    const isPremium = multiplier > 1;
                    
                    if (isDiscount) {
                        priceIndicator = `<span style="color:#FF5722;">↓ ${Math.round((1 - multiplier) * 100)}%</span>`;
                    } else if (isPremium) {
                        priceIndicator = `<span style="color:#4CAF50;">↑ ${Math.round((multiplier - 1) * 100)}%</span>`;
                    }
                }
            }
            
            return `
            <div class="shop-item" data-item="${i.id}">
                <span class="item-icon">${i.icon}</span>
                <div class="item-info">
                    <div class="item-name">${i.name}</div>
                    <div class="item-price">
                        ${currentPrice}G
                        ${priceIndicator}
                    </div>
                    <div class="item-stock">持有: ${i.count}</div>
                </div>
            </div>
        `}).join('');

        this.els.sellGrid.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', () => {
                const r = this.shop.sell(item.dataset.item);
                if (this.audio) this.audio.playSfx(r.ok ? 'sell' : 'error');
                this.showMsg(r.msg);
                this.update();
                this.renderSell();
            });
        });
    }

    toggleInventory() {
        if (this.els.invPanel.classList.contains('hidden')) {
            this.closeAllPanels();
            this.els.invPanel.classList.remove('hidden');
            this.renderInv();
        } else {
            this.els.invPanel.classList.add('hidden');
        }
    }

    renderInv() {
        const items = this.inventory.getAllItems();
        let html = '';
        for (let i = 0; i < 20; i++) {
            const it = items[i];
            if (it) {
                html += `<div class="inventory-slot"><span class="item-icon">${it.icon}</span><span class="item-count">${it.count}</span></div>`;
            } else {
                html += '<div class="inventory-slot empty"></div>';
            }
        }
        this.els.invGrid.innerHTML = html;
    }

    closeAllPanels() {
        this.els.shopPanel.classList.add('hidden');
        this.els.invPanel.classList.add('hidden');
    }

    showMsg(text) {
        const el = document.createElement('div');
        el.className = 'message';
        el.textContent = text;
        this.els.msgContainer.appendChild(el);
        setTimeout(() => el.remove(), 2200);
    }
}
