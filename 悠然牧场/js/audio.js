// 音频系统 — Web Audio API 生成星露谷风格背景音乐

const PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]; // C D E G A 五声音阶

export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.playing = false;
        this.melodyTimer = null;
        this.chordTimer = null;
        this.bassTimer = null;
        this.noteIndex = 0;
        this.menuAudio = null;
        this.menuAudioPlaying = false;
        this._menuActive = false;
        this._menuPlayBound = null;
    }

    init() {
        if (this.ctx) {
            // 恢复可能被暂停的 AudioContext
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // 如果浏览器暂停了 AudioContext，立即恢复
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        // 主音量
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.ctx.destination);

        // 音乐通道
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.7;
        this.musicGain.connect(this.masterGain);

        // 音效通道
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.8;
        this.sfxGain.connect(this.masterGain);
    }

    // 确保 context 活跃
    ensureRunning() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(e => console.warn('AudioContext resume failed:', e));
        }
    }

    // ====== 播放音乐 ======
    startMusic() {
        if (!this.ctx) this.init();
        this.ensureRunning();
        if (this.playing) return;
        this.playing = true;

        const now = this.ctx.currentTime;

        // 启动提示和弦 — 让用户立刻听到声音
        [261.63, 329.63, 392.00, 523.25].forEach((f, i) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'sine';
            o.frequency.value = f;
            const t = now + i * 0.15;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.3, t + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
            o.connect(g);
            g.connect(this.masterGain);
            o.start(t);
            o.stop(t + 1.3);
        });

        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0, now);
        this.musicGain.gain.linearRampToValueAtTime(0.7, now + 2);

        this.scheduleMelody();
        this.scheduleChords();
        this.scheduleBass();
    }

    stopMusic() {
        this.playing = false;
        if (this.melodyTimer) clearTimeout(this.melodyTimer);
        if (this.chordTimer) clearTimeout(this.chordTimer);
        if (this.bassTimer) clearTimeout(this.bassTimer);

        if (this.ctx && this.musicGain) {
            const now = this.ctx.currentTime;
            this.musicGain.gain.cancelScheduledValues(now);
            this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
            this.musicGain.gain.linearRampToValueAtTime(0, now + 1.5);
        }
    }

    // ====== 旋律线 ======
    scheduleMelody() {
        if (!this.playing) return;

        const melodyPattern = [
            0, 2, 4, 5, 4, 2, 0, 0,    // 第一句
            1, 3, 5, 5, 3, 1, 5, 4,    // 第二句
            2, 0, 2, 4, 5, 7, 5, 4,    // 第三句
            2, 4, 5, 4, 2, 0, 1, 0,    // 第四句
        ];

        let idx = this.noteIndex % melodyPattern.length;
        const noteFreq = PENTATONIC[melodyPattern[idx]] || 262;

        this.playNote(noteFreq, 0.5, 0.15, 'sine', this.musicGain);
        this.noteIndex++;

        // 节奏：根据位置变化
        const durations = [0.4, 0.35, 0.3, 0.35, 0.4, 0.3, 0.35, 0.5];
        const delay = durations[idx % durations.length] * 1000;

        this.melodyTimer = setTimeout(() => this.scheduleMelody(), delay);
    }

    // ====== 和弦 ======
    scheduleChords() {
        if (!this.playing) return;

        const chords = [
            [261.63, 329.63, 392.00], // C
            [293.66, 392.00, 440.00], // Am
            [329.63, 440.00, 523.25], // Dm-ish
            [261.63, 329.63, 392.00], // C
        ];

        const ci = this.noteIndex % (chords.length * 8);
        const chord = chords[Math.floor(ci / 8) % chords.length];

        chord.forEach(freq => {
            this.playNote(freq, 0.25, 1.5, 'triangle', this.musicGain);
        });

        this.chordTimer = setTimeout(() => this.scheduleChords(), 3200);
    }

    // ====== 低音 ======
    scheduleBass() {
        if (!this.playing) return;

        const bassNotes = [130.81, 146.83, 164.81, 130.81]; // C2, D2, E2, C2
        const bi = Math.floor(this.noteIndex / 8) % bassNotes.length;

        this.playNote(bassNotes[bi], 0.18, 2.0, 'sine', this.musicGain);
        this.bassTimer = setTimeout(() => this.scheduleBass(), 3200);
    }

    // ====== 播放单个音符 ======
    playNote(freq, vol, dur, type, dest) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        const now = this.ctx.currentTime;
        const attack = 0.01;
        const decayStart = dur * 0.75;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + attack);
        gain.gain.setValueAtTime(vol, now + decayStart);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + dur + 0.1);
    }

    // ====== 音效 ======
    playSfx(name) {
        if (!this.ctx) this.init();
        this.ensureRunning();
        const now = this.ctx.currentTime;

        switch (name) {
            case 'hoe':
                this.playNoise(now, 0.08, 200, 800, 0.15);
                break;
            case 'water':
                this.playNoise(now, 0.15, 800, 2000, 0.1);
                break;
            case 'plant':
                // 轻柔的叮咚声
                this.playNote(523.25, 0.15, 0.25, 'sine', this.sfxGain);
                setTimeout(() => this.playNote(659.25, 0.12, 0.25, 'sine', this.sfxGain), 120);
                break;
            case 'harvest':
                // 欢快的丰收音
                this.playNote(392.00, 0.18, 0.15, 'triangle', this.sfxGain);
                setTimeout(() => this.playNote(523.25, 0.18, 0.15, 'triangle', this.sfxGain), 100);
                setTimeout(() => this.playNote(659.25, 0.2, 0.3, 'triangle', this.sfxGain), 200);
                break;
            case 'buy':
                this.playNote(440.00, 0.12, 0.2, 'square', this.sfxGain);
                break;
            case 'sell':
                this.playNote(587.33, 0.12, 0.15, 'square', this.sfxGain);
                setTimeout(() => this.playNote(783.99, 0.12, 0.15, 'square', this.sfxGain), 80);
                break;
            case 'sleep':
                // 渐弱的下行音阶
                [523.25, 440.00, 392.00, 329.63].forEach((f, i) => {
                    setTimeout(() => this.playNote(f, 0.1, 0.5, 'sine', this.sfxGain), i * 200);
                });
                break;
            case 'error':
                this.playNoise(now, 0.2, 100, 400, 0.2);
                break;
            case 'click':
                this.playNote(880, 0.06, 0.08, 'sine', this.sfxGain);
                break;
        }
    }

    // 噪声（用于锄地、浇水等动作音效）
    playNoise(now, duration, lowFreq, highFreq, vol) {
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = (lowFreq + highFreq) / 2;
        filter.Q.value = 0.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        source.start(now);
        source.stop(now + duration);
    }

    // 销毁
    destroy() {
        this.stopMusic();
        this.stopMenuMusic();
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
    }

    // ====== 菜单音乐 ======
    startMenuMusic() {
        if (this.menuAudioPlaying) return;
        this._menuActive = true;

        if (!this.menuAudio) {
            this.menuAudio = new Audio('音乐.mp3');
            this.menuAudio.loop = true;
            this.menuAudio.volume = 0.7;
        }

        const cleanup = () => {
            document.removeEventListener('click', this._menuPlayBound);
            document.removeEventListener('keydown', this._menuPlayBound);
            this._menuPlayBound = null;
        };

        // 保存引用以便后续清理
        this._menuPlayBound = () => {
            // 菜单已关闭，不再播放
            if (!this._menuActive) return;
            this.menuAudio.play().then(() => {
                if (!this._menuActive) {
                    this.menuAudio.pause();
                    this.menuAudio.currentTime = 0;
                    return;
                }
                this.menuAudioPlaying = true;
                cleanup();
            }).catch(() => {
                // 浏览器阻止自动播放，保留监听器等待下次交互
            });
        };

        document.addEventListener('click', this._menuPlayBound);
        document.addEventListener('keydown', this._menuPlayBound);

        // 尝试立即播放（支持已获得音频权限的场景）
        this.menuAudio.play().then(() => {
            this.menuAudioPlaying = true;
            cleanup();
        }).catch(() => {
            // 等待用户交互
        });
    }

    stopMenuMusic() {
        this._menuActive = false;
        if (this._menuPlayBound) {
            document.removeEventListener('click', this._menuPlayBound);
            document.removeEventListener('keydown', this._menuPlayBound);
            this._menuPlayBound = null;
        }
        if (this.menuAudio) {
            this.menuAudio.pause();
            this.menuAudio.currentTime = 0;
            this.menuAudioPlaying = false;
        }
    }
}
