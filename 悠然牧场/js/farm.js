// 农场土地管理

export const TS  = 32;
export const TX  = 18;
export const TY  = 11;
export const OY  = 240;

export function createFarm() {
    const tiles = [];
    const crops = [];
    for (let y = 0; y < TY; y++) {
        tiles[y] = [];
        crops[y] = [];
        for (let x = 0; x < TX; x++) {
            tiles[y][x] = 0;
            crops[y][x] = null;
        }
    }
    return { tiles, crops };
}

export function tilePixel(tx, ty) {
    const left = (1024 - TX * TS) / 2;
    return { x: left + tx * TS, y: OY + ty * TS };
}

export function screenToTile(sx, sy) {
    const left = (1024 - TX * TS) / 2;
    const tx = Math.floor((sx - left) / TS);
    const ty = Math.floor((sy - OY) / TS);
    if (tx < 0 || tx >= TX || ty < 0 || ty >= TY) return null;
    return { x: tx, y: ty };
}

export function valid(tx, ty) {
    return tx >= 0 && tx < TX && ty >= 0 && ty < TY;
}

export function till(farm, tx, ty) {
    if (valid(tx, ty) && farm.tiles[ty][tx] === 0) {
        farm.tiles[ty][tx] = 1;
        return true;
    }
    return false;
}

export function water(farm, tx, ty) {
    if (valid(tx, ty) && farm.tiles[ty][tx] >= 1) {
        farm.tiles[ty][tx] = 2;
        return true;
    }
    return false;
}

export function plant(farm, tx, ty, cropData, day) {
    if (valid(tx, ty) && farm.tiles[ty][tx] >= 1 && !farm.crops[ty][tx]) {
        farm.crops[ty][tx] = {
            id:        cropData.id,
            name:      cropData.name,
            icon:      cropData.icon,
            stage:     cropData.stages[0],
            color:     cropData.colors[cropData.stages[0]],
            stages:    cropData.stages,
            colors:    cropData.colors,
            growDays:  cropData.growDays,
            witherDays: cropData.witherDays || 5,
            plantedDay: day,
            matureDay:  null,
            progress:   0,
            withered:   false,
        };
        return true;
    }
    return false;
}

export function harvest(farm, tx, ty) {
    if (!valid(tx, ty) || !farm.crops[ty][tx]) return null;
    const crop = farm.crops[ty][tx];
    if (crop.withered || crop.stage === 'withered') {
        farm.crops[ty][tx] = null;
        farm.tiles[ty][tx] = 1;
        return { id: 'withered', name: '枯萎作物', icon: '🥀', withered: true };
    }
    if (crop.stage === 'mature') {
        farm.crops[ty][tx] = null;
        farm.tiles[ty][tx] = 1;
        return crop;
    }
    return null;
}

export function growAll(farm, currentDay) {
    for (let y = 0; y < TY; y++) {
        for (let x = 0; x < TX; x++) {
            const c = farm.crops[y][x];
            if (!c || c.withered) continue;
            if (farm.tiles[y][x] === 2) {
                c.progress++;
                const perStage = Math.ceil(c.growDays / c.stages.length);
                const newIdx = Math.min(Math.floor(c.progress / perStage), c.stages.length - 1);
                const wasMature = c.stage === 'mature';
                c.stage = c.stages[newIdx];
                c.color = c.colors[c.stage];
                if (!wasMature && c.stage === 'mature') c.matureDay = currentDay;
                farm.tiles[y][x] = 1;
            }
            if (c.stage === 'mature' && c.matureDay && currentDay - c.matureDay >= c.witherDays) {
                c.withered = true;
                c.stage = 'withered';
                c.color = '#4A3728';
            }
        }
    }
}

export function autoWater(farm) {
    for (let y = 0; y < TY; y++)
        for (let x = 0; x < TX; x++)
            if (farm.tiles[y][x] === 1) farm.tiles[y][x] = 2;
}

// ============================================================
// 农场环境装饰（围栏 / 水井 / 小路 / 鲜花）
// ============================================================
export function renderFarmEnvironment(ctx, season) {
    const left   = (1024 - TX * TS) / 2;   // 224
    const top    = OY;                       // 240
    const right  = left + TX * TS;           // 800
    const bottom = OY + TY * TS;             // 592

    _drawFence(ctx, left, top, right, bottom);
    _drawWell(ctx, left - 76, top + 44);
    _drawPathway(ctx, left, right, bottom);
    _drawFlowerBorder(ctx, left, top, right, bottom, season);
}

// ---- 木围栏 ----
function _drawFence(ctx, left, top, right, bottom) {
    const POST_W = 7;
    const POST_H = 22;
    const RAIL_H = 3;
    const COL_POST  = '#8B6238';
    const COL_LIGHT = '#B08050';
    const COL_DARK  = '#5A3A1A';

    function post(px, py) {
        ctx.fillStyle = COL_POST;
        ctx.fillRect(px - POST_W / 2, py - POST_H / 2, POST_W, POST_H);
        ctx.fillStyle = COL_LIGHT;
        ctx.fillRect(px - POST_W / 2, py - POST_H / 2, 2, POST_H);
        ctx.fillStyle = COL_DARK;
        ctx.fillRect(px - POST_W / 2, py - POST_H / 2, POST_W, 2);
        // Post cap
        ctx.fillStyle = COL_DARK;
        ctx.fillRect(px - POST_W / 2 - 1, py - POST_H / 2 - 2, POST_W + 2, 3);
    }

    function hRail(x1, x2, py) {
        ctx.fillStyle = COL_POST;
        ctx.fillRect(x1, py - RAIL_H / 2, x2 - x1, RAIL_H);
        ctx.fillStyle = COL_LIGHT;
        ctx.fillRect(x1, py - RAIL_H / 2, x2 - x1, 1);
    }

    function vRail(px, y1, y2) {
        ctx.fillStyle = COL_POST;
        ctx.fillRect(px - RAIL_H / 2, y1, RAIL_H, y2 - y1);
        ctx.fillStyle = COL_LIGHT;
        ctx.fillRect(px - RAIL_H / 2, y1, 1, y2 - y1);
    }

    const half = POST_W / 2;
    const GATE_START = Math.floor(TX / 2) - 1;
    const GATE_END   = GATE_START + 3;

    // ---- 顶部围栏 ----
    for (let i = 0; i <= TX; i++) {
        post(left + i * TS, top - 6);
    }
    for (let i = 0; i < TX; i++) {
        const x1 = left + i * TS + half;
        const x2 = left + (i + 1) * TS - half;
        hRail(x1, x2, top - 10);
        hRail(x1, x2, top - 3);
    }

    // ---- 底部围栏（中间留门）----
    for (let i = 0; i <= TX; i++) {
        if (i > GATE_START && i < GATE_END) continue;
        post(left + i * TS, bottom + 6);
    }
    for (let i = 0; i < TX; i++) {
        if (i >= GATE_START && i < GATE_END) continue;
        const x1 = left + i * TS + half;
        const x2 = left + (i + 1) * TS - half;
        hRail(x1, x2, bottom + 2);
        hRail(x1, x2, bottom + 9);
    }

    // ---- 左侧围栏 ----
    for (let i = 0; i <= TY; i++) {
        post(left - 6, top + i * TS);
    }
    for (let i = 0; i < TY; i++) {
        const y1 = top + i * TS + half;
        const y2 = top + (i + 1) * TS - half;
        vRail(left - 10, y1, y2);
        vRail(left - 3,  y1, y2);
    }

    // ---- 右侧围栏 ----
    for (let i = 0; i <= TY; i++) {
        post(right + 6, top + i * TS);
    }
    for (let i = 0; i < TY; i++) {
        const y1 = top + i * TS + half;
        const y2 = top + (i + 1) * TS - half;
        vRail(right + 2,  y1, y2);
        vRail(right + 9,  y1, y2);
    }
}

// ---- 水井 ----
function _drawWell(ctx, x, y) {
    // 石头底座
    ctx.fillStyle = '#9A9A8A';
    ctx.fillRect(x, y + 18, 42, 16);
    ctx.fillStyle = '#AAAAA0';
    ctx.beginPath(); ctx.ellipse(x + 21, y + 18, 22, 10, 0, 0, Math.PI * 2); ctx.fill();
    // 内圆（水面）
    ctx.fillStyle = '#3A6080';
    ctx.beginPath(); ctx.ellipse(x + 21, y + 18, 13, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5A90B0';
    ctx.beginPath(); ctx.ellipse(x + 17, y + 16, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
    // 石块纹理
    ctx.fillStyle = '#888880';
    ctx.fillRect(x + 4,  y + 20, 8, 8);
    ctx.fillRect(x + 16, y + 22, 10, 6);
    ctx.fillRect(x + 30, y + 19, 8, 9);
    // 木框架
    ctx.fillStyle = '#7A5230';
    ctx.fillRect(x + 4,  y - 18, 7, 38);
    ctx.fillRect(x + 32, y - 18, 7, 38);
    ctx.fillStyle = '#9A7040';
    ctx.fillRect(x + 2,  y - 20, 38, 7);
    ctx.fillStyle = '#5A3A1A';
    ctx.fillRect(x + 2,  y - 20, 38, 2);
    // 绳子 + 桶
    ctx.strokeStyle = '#C0A050';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 21, y - 16); ctx.lineTo(x + 21, y + 4); ctx.stroke();
    ctx.fillStyle = '#9A7040';
    ctx.fillRect(x + 15, y + 4, 12, 9);
    ctx.fillStyle = '#7A5020';
    ctx.fillRect(x + 15, y + 4, 12, 2);
    // 弧形把手
    ctx.strokeStyle = '#6A4020';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 21, y - 20, 8, Math.PI, 0);
    ctx.stroke();
}

// ---- 大门小路 ----
function _drawPathway(ctx, left, right, bottom) {
    const gx = left + (Math.floor(TX / 2) - 1) * TS;
    const gw = 3 * TS;
    ctx.fillStyle = '#C0A060';
    ctx.fillRect(gx, bottom, gw, 48);
    ctx.fillStyle = '#B09050';
    for (let i = 5; i < 48; i += 9) {
        ctx.fillRect(gx + 3, bottom + i, gw - 6, 4);
    }
    ctx.fillStyle = '#8A6830';
    ctx.fillRect(gx,          bottom, 3, 48);
    ctx.fillRect(gx + gw - 3, bottom, 3, 48);
}

// ---- 围栏旁鲜花 ----
function _drawFlowerBorder(ctx, left, top, right, bottom, season) {
    if (season === 'winter') return;
    const palettes = {
        spring: ['#FF9ECD', '#FF6BAE', '#FFB7D4'],
        summer: ['#FFD700', '#FFA500', '#FF6347'],
        autumn: ['#FF8C00', '#E65100', '#DAA520'],
    };
    const cols = palettes[season] || palettes.spring;

    const spots = [
        [left - 46, top + 30],   [left - 52, top + 80],
        [left - 44, top + 140],  [left - 50, top + 200],
        [right + 20, top + 50],  [right + 28, top + 110],
        [right + 18, top + 170], [right + 24, top + 230],
        [left + 30,  top - 26],  [left + 80,  top - 26],
        [right - 60, top - 26],  [right - 110, top - 26],
    ];

    spots.forEach(([fx, fy], i) => {
        const c = cols[i % cols.length];
        // 茎
        ctx.fillStyle = '#4A8030';
        ctx.fillRect(fx + 1, fy + 3, 2, 8);
        // 花瓣
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(fx + 2, fy, 5, 0, Math.PI * 2); ctx.fill();
        // 花蕊
        ctx.fillStyle = '#FFD060';
        ctx.beginPath(); ctx.arc(fx + 2, fy, 2, 0, Math.PI * 2); ctx.fill();
    });
}

// ============================================================
// 农场主体渲染
// ============================================================
export function renderFarm(ctx, farm) {
    const left = (1024 - TX * TS) / 2;

    for (let y = 0; y < TY; y++) {
        for (let x = 0; x < TX; x++) {
            const px = left + x * TS;
            const py = OY + y * TS;
            _drawTile(ctx, px, py, farm.tiles[y][x]);
            if (farm.crops[y][x]) _drawCropSprite(ctx, px, py, farm.crops[y][x]);
        }
    }

    // 网格线（更细、更自然）
    ctx.strokeStyle = 'rgba(0,0,0,0.10)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= TX; x++) {
        const px = left + x * TS;
        ctx.beginPath(); ctx.moveTo(px, OY); ctx.lineTo(px, OY + TY * TS); ctx.stroke();
    }
    for (let y = 0; y <= TY; y++) {
        const py = OY + y * TS;
        ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(left + TX * TS, py); ctx.stroke();
    }
}

// ---- 地块纹理 ----
function _drawTile(ctx, x, y, state) {
    if (state === 0) {
        // 荒地：金黄沙土 + 草皮点缀
        ctx.fillStyle = '#C8A85A';
        ctx.fillRect(x, y, TS, TS);
        ctx.fillStyle = '#B09040';
        ctx.fillRect(x + 3,  y + 6,  7, 4);
        ctx.fillRect(x + 19, y + 17, 8, 3);
        ctx.fillRect(x + 8,  y + 23, 6, 4);
        ctx.fillRect(x + 23, y + 8,  4, 5);
        // 草丛
        ctx.fillStyle = '#7A9838';
        ctx.fillRect(x + 5,  y + 8,  2, 6);
        ctx.fillRect(x + 7,  y + 6,  1, 4);
        ctx.fillRect(x + 23, y + 21, 2, 5);
        ctx.fillStyle = '#5A7A28';
        ctx.fillRect(x + 4,  y + 25, 3, 4);
        ctx.fillRect(x + 21, y + 5,  2, 3);
    } else if (state === 1) {
        // 耕地：深棕土壤 + 整齐垄沟
        ctx.fillStyle = '#5E3D20';
        ctx.fillRect(x, y, TS, TS);
        // 垄沟脊
        ctx.fillStyle = '#7C5232';
        ctx.fillRect(x + 1, y + 1,  TS - 2, 5);
        ctx.fillRect(x + 1, y + 9,  TS - 2, 5);
        ctx.fillRect(x + 1, y + 17, TS - 2, 5);
        ctx.fillRect(x + 1, y + 25, TS - 2, 5);
        // 垄沟中心暗纹
        ctx.fillStyle = '#3C2210';
        ctx.fillRect(x + 1, y + 4,  TS - 2, 2);
        ctx.fillRect(x + 1, y + 12, TS - 2, 2);
        ctx.fillRect(x + 1, y + 20, TS - 2, 2);
        ctx.fillRect(x + 1, y + 28, TS - 2, 2);
    } else {
        // 已浇水：深色湿土 + 蓝光湿润感
        ctx.fillStyle = '#3C2212';
        ctx.fillRect(x, y, TS, TS);
        // 湿垄脊（略带蓝调）
        ctx.fillStyle = '#50302A';
        ctx.fillRect(x + 1, y + 1,  TS - 2, 5);
        ctx.fillRect(x + 1, y + 9,  TS - 2, 5);
        ctx.fillRect(x + 1, y + 17, TS - 2, 5);
        ctx.fillRect(x + 1, y + 25, TS - 2, 5);
        // 湿润反光点
        ctx.fillStyle = 'rgba(160, 210, 255, 0.38)';
        ctx.fillRect(x + 7,  y + 3,  2, 1);
        ctx.fillRect(x + 21, y + 12, 2, 1);
        ctx.fillRect(x + 13, y + 22, 2, 1);
        ctx.fillRect(x + 27, y + 5,  2, 1);
        ctx.fillRect(x + 5,  y + 28, 2, 1);
    }
}

// ---- 作物精灵 ----
function _drawCropSprite(ctx, x, y, crop) {
    const cx = x + TS / 2;
    const cy = y + TS / 2;

    if (crop.stage === 'seed') {
        // 种子：椭圆土包 + 细芽
        ctx.fillStyle = '#4A2C12';
        ctx.beginPath(); ctx.ellipse(cx, cy + 7, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8AB840';
        ctx.fillRect(cx - 1, cy + 2, 1, 5);
    } else if (crop.stage === 'sprout') {
        // 幼苗：茎 + 两片叶
        ctx.fillStyle = '#5C8A30';
        ctx.fillRect(cx - 1, cy - 4, 2, 14);
        ctx.fillStyle = '#7EC840';
        ctx.beginPath(); ctx.ellipse(cx - 6, cy - 2, 6, 3, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 6, cy - 4, 6, 3,  0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4A9020';
        ctx.fillRect(cx - 9, cy - 3, 5, 1);
        ctx.fillRect(cx + 4,  cy - 5, 5, 1);
    } else if (crop.stage === 'growing') {
        // 生长中：较高茎 + 多叶片
        ctx.fillStyle = '#4A7A28';
        ctx.fillRect(cx - 2, cy - 12, 3, 22);
        ctx.fillStyle = '#60A835';
        ctx.beginPath(); ctx.ellipse(cx - 9, cy - 7,  7, 3, -0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 9, cy - 2,  7, 3,  0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx - 7, cy + 3,  5, 2.5, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 7, cy + 6,  5, 2.5,  0.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3A7A20';
        ctx.fillRect(cx - 12, cy - 8, 7, 1);
        ctx.fillRect(cx + 4,  cy - 3, 7, 1);
    } else if (crop.stage === 'mature') {
        _drawMatureCrop(ctx, cx, cy, crop);
    } else if (crop.stage === 'withered' || crop.withered) {
        _drawWithered(ctx, cx, cy);
    }
}

// ---- 各作物成熟形态 ----
function _drawMatureCrop(ctx, cx, cy, crop) {
    switch (crop.id) {
        case 'tomato': {
            ctx.fillStyle = '#3A7020';
            ctx.fillRect(cx - 1, cy - 14, 2, 8);
            ctx.fillStyle = '#FF3030';
            ctx.beginPath(); ctx.arc(cx, cy - 5, 9, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#CC1010';
            ctx.beginPath(); ctx.arc(cx + 3, cy - 8, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,190,190,0.55)';
            ctx.beginPath(); ctx.arc(cx - 3, cy - 8, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#3A9020';
            ctx.beginPath(); ctx.arc(cx, cy - 13, 4, 0, Math.PI * 2); ctx.fill();
            break;
        }
        case 'carrot': {
            ctx.fillStyle = '#3A8A28';
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.ellipse(cx + i * 4, cy - 14, 3, 6, i * 0.12, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#FF8000';
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy - 8);
            ctx.lineTo(cx + 6, cy - 8);
            ctx.lineTo(cx + 2, cy + 9);
            ctx.lineTo(cx - 2, cy + 9);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#FFAA40';
            ctx.fillRect(cx - 4, cy - 7, 2, 14);
            ctx.fillStyle = '#E07000';
            ctx.fillRect(cx - 5, cy - 2, 10, 1);
            ctx.fillRect(cx - 4, cy + 3, 8,  1);
            break;
        }
        case 'potato': {
            ctx.fillStyle = '#4A8A28';
            ctx.fillRect(cx - 1, cy - 12, 2, 6);
            ctx.fillStyle = '#9A6A30';
            ctx.beginPath(); ctx.ellipse(cx - 5, cy + 2, 8, 5,  0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 6, cy,     7, 5, -0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx,     cy + 7, 6, 4,  0.0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#7A4A20';
            ctx.beginPath(); ctx.arc(cx - 3, cy + 1, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + 7, cy - 1, 1.5, 0, Math.PI * 2); ctx.fill();
            break;
        }
        case 'corn': {
            ctx.fillStyle = '#2D7A2D';
            ctx.fillRect(cx - 2, cy - 14, 4, 26);
            ctx.fillStyle = '#4A9A3A';
            ctx.beginPath(); ctx.ellipse(cx - 9, cy - 6,  9, 3, -0.4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 9, cy - 2,  9, 3,  0.4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFD700';
            ctx.beginPath(); ctx.ellipse(cx + 9, cy - 6, 5, 10, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#E6C000';
            ctx.beginPath(); ctx.ellipse(cx + 11, cy - 7, 3, 8, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#CCB000';
            for (let ki = -4; ki <= 4; ki += 2) {
                ctx.fillRect(cx + 7, cy + ki - 7, 4, 1);
            }
            ctx.fillStyle = '#D4A800';
            ctx.fillRect(cx + 11, cy - 16, 1, 6);
            ctx.fillRect(cx + 13, cy - 15, 1, 5);
            break;
        }
        case 'strawberry': {
            ctx.fillStyle = '#3A8A28';
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.ellipse(cx + i * 5, cy - 12, 4, 5, i * 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#CC1A3A';
            ctx.beginPath();
            ctx.moveTo(cx, cy + 7);
            ctx.lineTo(cx - 7, cy - 2);
            ctx.lineTo(cx - 5, cy - 6);
            ctx.lineTo(cx,     cy - 4);
            ctx.lineTo(cx + 5, cy - 6);
            ctx.lineTo(cx + 7, cy - 2);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#FF2255';
            ctx.beginPath();
            ctx.moveTo(cx, cy + 4);
            ctx.lineTo(cx - 4, cy - 1);
            ctx.lineTo(cx - 3, cy - 4);
            ctx.lineTo(cx,     cy - 2);
            ctx.lineTo(cx + 3, cy - 4);
            ctx.lineTo(cx + 4, cy - 1);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#FFD080';
            ctx.fillRect(cx - 1, cy - 1, 1, 1);
            ctx.fillRect(cx + 2, cy + 1, 1, 1);
            ctx.fillRect(cx - 3, cy + 2, 1, 1);
            break;
        }
        case 'pumpkin': {
            ctx.fillStyle = '#3A8A28';
            ctx.fillRect(cx - 1, cy - 14, 2, 6);
            ctx.fillStyle = '#FF7018';
            ctx.beginPath(); ctx.ellipse(cx - 7, cy + 2, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx,     cy + 2, 7, 9, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 7, cy + 2, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#CC5500';
            ctx.fillRect(cx - 3, cy - 6, 1, 14);
            ctx.fillRect(cx + 3, cy - 6, 1, 14);
            ctx.fillStyle = '#FF9A38';
            ctx.beginPath(); ctx.ellipse(cx, cy - 6, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#5A8A22';
            ctx.fillRect(cx - 2, cy - 12, 3, 7);
            break;
        }
        case 'watermelon': {
            ctx.fillStyle = '#3A8A28';
            ctx.fillRect(cx - 1, cy - 14, 2, 7);
            ctx.save();
            ctx.beginPath(); ctx.ellipse(cx, cy + 2, 12, 10, 0, 0, Math.PI * 2);
            ctx.clip();
            ctx.fillStyle = '#228B22';
            ctx.fillRect(cx - 13, cy - 9, 26, 22);
            ctx.fillStyle = '#145A14';
            ctx.fillRect(cx - 5,  cy - 9, 3, 22);
            ctx.fillRect(cx + 4,  cy - 9, 3, 22);
            ctx.fillRect(cx - 12, cy - 9, 2, 22);
            ctx.fillRect(cx + 11, cy - 9, 2, 22);
            ctx.restore();
            ctx.strokeStyle = '#1A6A1A';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(cx, cy + 2, 12, 10, 0, 0, Math.PI * 2); ctx.stroke();
            ctx.lineWidth = 1;
            break;
        }
        case 'cabbage': {
            ctx.fillStyle = '#78B848';
            ctx.beginPath(); ctx.ellipse(cx - 12, cy + 4, 5, 7, -0.3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 12, cy + 4, 5, 7,  0.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#C8EAA0';
            ctx.beginPath(); ctx.ellipse(cx, cy, 12, 10, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#98C870';
            ctx.beginPath(); ctx.ellipse(cx, cy, 9,  7,  0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#6AA848';
            ctx.beginPath(); ctx.ellipse(cx, cy, 6,  5,  0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#A0D880';
            ctx.fillRect(cx - 10, cy - 1, 20, 1);
            ctx.fillRect(cx - 1,  cy - 9, 1,  18);
            break;
        }
        default: {
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(cx - 3, cy - 12, 6, 22);
            ctx.fillStyle = crop.color;
            ctx.beginPath(); ctx.arc(cx, cy - 10, 9, 0, Math.PI * 2); ctx.fill();
        }
    }
    _drawSparkle(ctx, cx + 10, cy - 14);
}

// ---- 枯萎 ----
function _drawWithered(ctx, cx, cy) {
    ctx.fillStyle = '#5A3A20';
    ctx.fillRect(cx - 1, cy - 8, 2, 16);
    ctx.fillStyle = '#4A3018';
    ctx.beginPath(); ctx.ellipse(cx - 5, cy + 2, 6, 2,  0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 5, cy,     5, 2, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.font = '13px Arial';
    ctx.textBaseline = 'middle';
    ctx.fillText('🥀', cx - 7, cy + 5);
    ctx.textBaseline = 'alphabetic';
}

// ---- 成熟闪光 ----
function _drawSparkle(ctx, x, y) {
    const a = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() / 420));
    ctx.fillStyle = `rgba(255,240,70,${a})`;
    ctx.fillRect(x,     y,     3, 3);
    ctx.fillStyle = `rgba(255,200,30,${a * 0.65})`;
    ctx.fillRect(x - 2, y + 1, 2, 2);
    ctx.fillRect(x + 3, y + 1, 2, 2);
    ctx.fillRect(x + 1, y - 2, 2, 2);
    ctx.fillRect(x + 1, y + 3, 2, 2);
}
