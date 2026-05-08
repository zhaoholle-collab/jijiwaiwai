// 玩家角色

const FRAME_W = 128;
const FRAME_H = 128;

// 动画定义: row=行, start=起始帧, count=帧数, spd=每帧秒数
const ANIM = {
    idle:   { row: 0, start: 0, count: 2, spd: 0.30 },
    walk:   { row: 0, start: 0, count: 8, spd: 0.10 },
    tool:   { row: 2, start: 0, count: 8, spd: 0.09 },
    attack: { row: 3, start: 0, count: 8, spd: 0.08 },
    roll:   { row: 4, start: 0, count: 5, spd: 0.07 },
};

export class Player {
    constructor(w, h) {
        this.x = w / 2;
        this.y = h / 2 + 50;
        this.speed = 200;
        this.direction = 'right';
        this.moving = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.state = 'idle';
        this.actionTimer = 0;
        this.facingLeft = false;

        this.left = 60;
        this.right = w - 60;
        this.top = 220;
        this.bottom = h - 100;

        this.keys = { up: false, down: false, left: false, right: false };

        // 加载精灵表 22.png
        this.sheet = new Image();
        this.sheetLoaded = false;
        this.sheet.onload = () => { this.sheetLoaded = true; };
        this.sheet.onerror = () => { console.error('精灵表加载失败:', this.sheet.src); };
        this.sheet.src = '人物素材/22.png';

        this.charW = 80;
        this.charH = 80;
    }

    // 由外部调用，播放工具动作动画
    triggerAction(toolType) {
        if (toolType === 'attack') {
            this.state = 'attack';
        } else {
            this.state = 'tool';
        }
        this.animFrame = 0;
        this.animTimer = 0;
        const anim = ANIM[this.state];
        this.actionTimer = anim.count * anim.spd;
    }

    // 播放翻滚动画（如 E 键睡觉等可选用）
    triggerRoll() {
        this.state = 'roll';
        this.animFrame = 0;
        this.animTimer = 0;
        this.actionTimer = ANIM.roll.count * ANIM.roll.spd;
    }

    update(dt) {
        // 动作计时结束后恢复
        if (this.actionTimer > 0) {
            this.actionTimer -= dt;
            if (this.actionTimer <= 0) {
                this.actionTimer = 0;
                this.animFrame = 0;
                this.animTimer = 0;
            }
        }

        let dx = 0, dy = 0;
        if (this.keys.up)    { dy = -1; this.direction = 'up'; }
        if (this.keys.down)  { dy =  1; this.direction = 'down'; }
        if (this.keys.left)  { dx = -1; this.direction = 'left'; this.facingLeft = true; }
        if (this.keys.right) { dx =  1; this.direction = 'right'; this.facingLeft = false; }

        this.moving = dx !== 0 || dy !== 0;

        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;

        if (this.x < this.left)   this.x = this.left;
        if (this.x > this.right)  this.x = this.right;
        if (this.y < this.top)    this.y = this.top;
        if (this.y > this.bottom) this.y = this.bottom;

        // 非动作状态下由移动驱动动画切换
        if (this.actionTimer <= 0) {
            this.state = this.moving ? 'walk' : 'idle';
        }

        // 推进动画帧
        const anim = ANIM[this.state] || ANIM.idle;
        this.animTimer += dt;
        if (this.animTimer >= anim.spd) {
            this.animTimer -= anim.spd;
            this.animFrame = (this.animFrame + 1) % anim.count;
        }
    }

    render(ctx) {
        const x = this.x;
        const y = this.y;
        const cw = this.charW;
        const ch = this.charH;

        // 影子
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.beginPath();
        ctx.ellipse(x, y - 3, 15, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (!this.sheetLoaded) return;

        const anim = ANIM[this.state] || ANIM.idle;
        const sx = (anim.start + this.animFrame) * FRAME_W;
        const sy = anim.row * FRAME_H;

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        if (this.facingLeft) {
            // 水平镜像：translate 到角色顶部中心，scale(-1,1) 翻转
            ctx.translate(x, y - ch);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sheet, sx, sy, FRAME_W, FRAME_H, -cw / 2, 0, cw, ch);
        } else {
            ctx.drawImage(this.sheet, sx, sy, FRAME_W, FRAME_H, x - cw / 2, y - ch, cw, ch);
        }

        ctx.restore();
    }

    handleKeyDown(code) {
        switch (code) {
            case 'KeyW': case 'ArrowUp':    this.keys.up    = true; break;
            case 'KeyS': case 'ArrowDown':  this.keys.down  = true; break;
            case 'KeyA': case 'ArrowLeft':  this.keys.left  = true; break;
            case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
        }
    }

    handleKeyUp(code) {
        switch (code) {
            case 'KeyW': case 'ArrowUp':    this.keys.up    = false; break;
            case 'KeyS': case 'ArrowDown':  this.keys.down  = false; break;
            case 'KeyA': case 'ArrowLeft':  this.keys.left  = false; break;
            case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
        }
    }

    facingTile() {
        let tx = Math.floor(this.x / 32);
        let ty = Math.floor((this.y - 240) / 32);
        switch (this.direction) {
            case 'up':    ty--; break;
            case 'down':  ty++; break;
            case 'left':  tx--; break;
            case 'right': tx++; break;
        }
        return { x: tx, y: ty };
    }
}
