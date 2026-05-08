// 悠然小镇 — 主入口

import { W, H, createState, nextDay, spendEnergy, drawScene, SEASON_NAMES, WEATHER_NAMES } from './game.js';
import { Player } from './player.js';
import * as Farm from './farm.js';
import { CropsManager } from './crops.js';
import { Inventory } from './inventory.js';
import { Shop } from './shop.js';
import { UI } from './ui.js';
import { MenuScene } from './menu.js';
import { AudioSystem } from './audio.js';

window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('game-canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ---- 预加载作物数据 ----
    const cm = new CropsManager();
    await cm.load();

    // ---- 音频系统 ----
    const audio = new AudioSystem();
    // 用户首次交互后初始化 AudioContext
    function initAudio() { audio.init(); }
    
    // 启动菜单音乐
    audio.startMenuMusic();

    const gameUI = document.getElementById('game-ui');
    const menuOverlay = document.getElementById('menu-overlay');
    const controlsModal = document.getElementById('controls-modal');

    // ============== 菜单阶段 ==============
    const menu = new MenuScene(canvas);
    let inMenu = true;

    // 检查存档存在
    const hasSave = !!localStorage.getItem('youranFarm_save');
    const btnContinue = document.getElementById('btn-continue');
    if (hasSave) {
        btnContinue.classList.remove('disabled');
    }

    function startGame(loadSave) {
        if (!inMenu) return;
        inMenu = false;

        // 显示并播放农场背景视频
        const farmBgVideo = document.getElementById('farm-bg-video');
        farmBgVideo.classList.add('active');
        farmBgVideo.play().catch(() => {});

        // 停止菜单音乐
        audio.stopMenuMusic();

        // 初始化音频（用户交互触发）
        initAudio();

        // 先停菜单动画，canvas 释放给游戏
        menu.stop();

        // overlay 淡出（纯 CSS 动画，不依赖 canvas）
        menuOverlay.classList.add('fade-out');

        // 初始化游戏（接管 canvas 渲染）
        initGame(loadSave);

        // CSS 动画完成后显示游戏 UI + 播放游戏音乐
        setTimeout(() => {
            gameUI.classList.remove('hidden');
            menuOverlay.style.display = 'none';
            audio.startMusic();
        }, 700);
    }

    // 菜单按钮事件
    document.getElementById('btn-new-game').addEventListener('click', () => {
        localStorage.removeItem('youranFarm_save');
        startGame(false);
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
        if (!hasSave) return;
        startGame(true);
    });

    document.getElementById('btn-controls').addEventListener('click', () => {
        controlsModal.classList.remove('hidden');
    });

    document.getElementById('btn-close-controls').addEventListener('click', () => {
        controlsModal.classList.add('hidden');
    });

    // 按任意键开始新游戏
    window.addEventListener('keydown', function menuStartKey(e) {
        if (!inMenu) return;
        if (e.code === 'Escape') return;
        // 如果操作说明弹窗开着，不启动游戏
        if (!controlsModal.classList.contains('hidden')) return;
        // 按任意键 = 开始新游戏（不读档）
        localStorage.removeItem('youranFarm_save');
        startGame(false);
    });

    // 启动菜单动画
    menu.start();

    // ============== 游戏初始化 ==============
    function initGame(loadSave) {
        const state = createState();
        const farm = Farm.createFarm();
        const player = new Player(W, H);
        const inventory = new Inventory();
        const shop = new Shop(state, inventory, cm);
        const ui = new UI(state, shop, inventory, cm, audio);
        let paused = false;

        // 存档
        function doSave() {
            localStorage.setItem('youranFarm_save', JSON.stringify({
                state, tiles: farm.tiles, crops: farm.crops, inv: inventory.serialize(),
            }));
        }

        function doLoad() {
            const raw = localStorage.getItem('youranFarm_save');
            if (!raw) return;
            try {
                const s = JSON.parse(raw);
                if (s.state) Object.assign(state, s.state);
                if (s.tiles) farm.tiles = s.tiles;
                if (s.crops) {
                    for (let y = 0; y < Farm.TY; y++)
                        for (let x = 0; x < Farm.TX; x++)
                            farm.crops[y][x] = s.crops[y] ? s.crops[y][x] : null;
                    fixCrops(farm);
                }
                if (s.inv) inventory.deserialize(s.inv);
                return true;
            } catch (e) { console.warn('存档加载失败:', e); }
            return false;
        }

        function fixCrops(f) {
            for (let y = 0; y < Farm.TY; y++) {
                for (let x = 0; x < Farm.TX; x++) {
                    const c = f.crops[y][x];
                    if (!c) continue;
                    const def = cm.getCrop(c.id);
                    if (!def) continue;
                    c.stages = def.stages;
                    c.colors = def.colors;
                    c.growDays = def.growDays;
                }
            }
        }

        // 加载或新游戏
        if (loadSave) {
            doLoad();
        } else {
            localStorage.removeItem('youranFarm_save');
        }

        function doSleep() {
            audio.playSfx('sleep');
            const isRainy = nextDay(state);
            if (isRainy) { Farm.autoWater(farm); showMsg('🌧️ 下雨啦，作物都浇好水了！'); }
            Farm.growAll(farm, state.day);
            ui.update();
            showMsg(`☀️ 新的一天！${SEASON_NAMES[state.season]} 第${state.day}天 ${WEATHER_NAMES[state.weather]}`);
            doSave();
        }

        const ENERGY_COST = { hoe: 5, water: 2, seed: 3, harvest: 4 };

        function useToolOnTile(tile) {
            if (!tile || !Farm.valid(tile.x, tile.y)) return;
            if (!spendEnergy(state, state.tool)) {
                showMsg('⚡ 体力不足！睡觉恢复体力');
                return;
            }
            let msg = '', ok = false;

            switch (state.tool) {
                case 'hoe':
                    ok = Farm.till(farm, tile.x, tile.y);
                    msg = ok ? '⛏️ 耕地成功' : '这里无法耕地';
                    audio.playSfx(ok ? 'hoe' : 'error');
                    break;
                case 'water':
                    ok = Farm.water(farm, tile.x, tile.y);
                    msg = ok ? '💧 浇水成功' : '这里不需要浇水';
                    audio.playSfx(ok ? 'water' : 'error');
                    break;
                case 'seed': {
                    const seedKey = `${state.selectedSeed}_seed`;
                    if (inventory.getItemCount(seedKey) <= 0) {
                        state.energy += ENERGY_COST[state.tool];
                        showMsg('没有种子！去商店购买吧 (按F键)');
                        return;
                    }
                    const cd = cm.getCrop(state.selectedSeed);
                    if (!cd) { state.energy += ENERGY_COST[state.tool]; showMsg('数据错误'); return; }
                    if (cd.season !== state.season) {
                        state.energy += ENERGY_COST[state.tool];
                        showMsg(`${cd.name}不适合${SEASON_NAMES[state.season]}种植`);
                        return;
                    }
                    ok = Farm.plant(farm, tile.x, tile.y, cd, state.day);
                    if (ok) {
                        inventory.removeItem(seedKey, 1);
                        msg = `🌱 种下了${cd.name}`;
                        audio.playSfx('plant');
                    } else { state.energy += ENERGY_COST[state.tool]; msg = '这里无法种植'; }
                    break;
                }
                case 'harvest': {
                    const crop = Farm.harvest(farm, tile.x, tile.y);
                    if (crop) {
                        if (crop.withered) {
                            msg = '🥀 清除了枯萎作物';
                        } else {
                            const cd = cm.getCrop(crop.id);
                            const price = cd ? cd.sellPrice : 60;
                            inventory.addItem({ 
                                id: crop.id, 
                                name: crop.name, 
                                icon: crop.icon, 
                                count: 1, 
                                type: 'crop', 
                                price: price,
                                cropId: crop.id 
                            });
                            msg = `🧺 收获了${crop.name}！`;
                        }
                        ok = true;
                        audio.playSfx('harvest');
                    } else { state.energy += ENERGY_COST[state.tool]; msg = '没有成熟的作物可以收获'; }
                    break;
                }
            }
            showMsg(msg);
            ui.update();
            doSave();
        }

        // 键盘
        window.addEventListener('keydown', (e) => {
            if (inMenu || paused) return;
            player.handleKeyDown(e.code);
            switch (e.code) {
                case 'Digit1': ui.selectTool('hoe'); break;
                case 'Digit2': ui.selectTool('water'); break;
                case 'Digit3': ui.selectTool('seed'); break;
                case 'Digit4': ui.selectTool('harvest'); break;
                case 'KeyF': ui.toggleShop(); break;
                case 'KeyI': ui.toggleInventory(); break;
                case 'KeyE': doSleep(); break;
                case 'Space':
                    useToolOnTile(player.facingTile());
                    player.triggerAction(state.tool);
                    break;
                case 'Escape': ui.closeAllPanels(); break;
            }
        });

        window.addEventListener('keyup', (e) => { player.handleKeyUp(e.code); });

        // 鼠标点击地块
        canvas.addEventListener('click', (e) => {
            if (inMenu) return;
            const r = canvas.getBoundingClientRect();
            const sx = e.clientX - r.left;
            const sy = e.clientY - r.top;
            const tile = Farm.screenToTile(sx, sy);
            if (tile) useToolOnTile(tile);
        });

        // 消息提示
        const msgContainer = document.getElementById('message-container');
        function showMsg(text) {
            const el = document.createElement('div');
            el.className = 'message';
            el.textContent = text;
            msgContainer.appendChild(el);
            setTimeout(() => el.remove(), 2200);
        }

        // 第一次更新
        ui.update();

        // ============== 主循环 ==============
        let lastTime = performance.now();
        function gameLoop(now) {
            requestAnimationFrame(gameLoop);

            if (inMenu) return;

            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            if (!paused) player.update(dt);

            ctx.clearRect(0, 0, W, H);
            drawScene(ctx, state);
            Farm.renderFarmEnvironment(ctx, state.season);
            Farm.renderFarm(ctx, farm);
            player.render(ctx);
        }

        showMsg('🎮 欢迎来到悠然小镇！WASD移动，空格使用工具');
        requestAnimationFrame(gameLoop);
    }
});
