// 开始界面 — 图片背景 + 下落叶动画

const W = 1024, H = 640;

// 落叶粒子
class Leaf {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * W;
        this.y = -30;
        this.size = 8 + Math.random() * 16;
        this.speed = 25 + Math.random() * 50;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = 0.2 + Math.random() * 0.6;
        this.swingAmp = 15 + Math.random() * 35;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 1.5;
        this.opacity = 0.4 + Math.random() * 0.5;
        // 秋叶色系
        const colors = [
            '#E67E22', '#D35400', '#C0392B', '#E74C3C',
            '#F39C12', '#D68910', '#A04000', '#F5B041',
            '#E8B730', '#CB4335', '#BA4A00', '#D4AC0D',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update(dt) {
        this.y += this.speed * dt;
        this.swing += this.swingSpeed * dt;
        this.x += Math.sin(this.swing) * this.swingAmp * dt;
        this.rotation += this.rotSpeed * dt;
        if (this.y > H + 40) this.reset();
    }
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        // 画叶子形状
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.5, this.size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.22);
        ctx.lineTo(this.size * 0.4, 0);
        ctx.lineTo(0, this.size * 0.22);
        ctx.fill();
        ctx.restore();
    }
}

// 萤火虫
class Firefly {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * W;
        this.y = H * 0.3 + Math.random() * H * 0.4;
        this.size = 1.5 + Math.random() * 2;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.3 + Math.random() * 1.2;
        this.driftX = 5 + Math.random() * 15;
        this.driftY = 3 + Math.random() * 8;
    }
    update(dt) {
        this.phase += this.speed * dt;
        this.x += Math.sin(this.phase * 0.7) * this.driftX * dt;
        this.y += Math.cos(this.phase * 0.5) * this.driftY * dt;
        if (this.x < -20 || this.x > W + 20 || this.y < H * 0.25 || this.y > H * 0.75) this.reset();
    }
    render(ctx) {
        const glow = 0.2 + Math.abs(Math.sin(this.phase)) * 0.6;
        ctx.save();
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#FFF9C4';
        ctx.shadowColor = '#FFD54F';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class MenuScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.leaves = [];
        this.fireflies = [];
        this.time = 0;
        this.running = false;
        this.bgImage = null;
        this.bgLoaded = false;

        // 加载背景图片
        this.bgImage = new Image();
        this.bgImage.onload = () => { this.bgLoaded = true; };
        this.bgImage.onerror = () => { this.bgLoaded = false; };
        this.bgImage.src = 'assets/背景.png';

        // 创建落叶
        for (let i = 0; i < 30; i++) {
            const l = new Leaf();
            l.y = Math.random() * H;
            this.leaves.push(l);
        }
        // 萤火虫
        for (let i = 0; i < 15; i++) {
            this.fireflies.push(new Firefly());
        }
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this._boundLoop = (t) => this._loop(t);
        requestAnimationFrame(this._boundLoop);
    }

    stop() {
        this.running = false;
    }

    _loop(now) {
        if (!this.running) return;
        const dt = Math.min((now - this.lastTime) / 1000, 0.1);
        this.lastTime = now;
        this.time += dt;
        this.update(dt);
        this.render();
        requestAnimationFrame(this._boundLoop);
    }

    update(dt) {
        this.leaves.forEach(l => l.update(dt));
        this.fireflies.forEach(f => f.update(dt));
    }

    render() {
        const ctx = this.ctx;

        // 背景图片（等比例缩放填满画布）
        if (this.bgLoaded && this.bgImage) {
            const iw = this.bgImage.width;
            const ih = this.bgImage.height;
            const scale = Math.max(W / iw, H / ih);
            const sw = iw * scale;
            const sh = ih * scale;
            const sx = (W - sw) / 2;
            const sy = (H - sh) / 2;
            ctx.drawImage(this.bgImage, sx, sy, sw, sh);
        } else {
            // 图片加载中 — 深色渐变背景
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#2d1b0e');
            grad.addColorStop(0.5, '#4a3520');
            grad.addColorStop(1, '#1a0e04');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);
        }

        // 半透明暗色遮罩让按钮更清晰
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, W, H);

        // 萤火虫
        this.fireflies.forEach(f => f.render(ctx));

        // 飘落树叶
        this.leaves.forEach(l => l.render(ctx));

        // 底部版权
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '11px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('© 悠然农场 · 像素风生活模拟游戏', W / 2, H * 0.95);
    }
}
