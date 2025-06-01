class GameParticle {
    constructor(x, y, color = 'gold', size = 4, lifetime = 60) {
        this.x = x;
        this.y = y;
        this.vx = Utils.random(-5, 5);
        this.vy = Utils.random(-8, -2);
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.gravity = 0.2;
        this.friction = 0.98;
    }

    update() {
        this.vx *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;
        return this.lifetime <= 0;
    }

    draw(ctx) {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (this.color === 'rainbow') {
            const hue = (Date.now() / 10) % 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class GameParticleSystem {
    constructor() {
        this.particles = [];
    }

    createBurst(x, y, count = 8, color = 'gold') {
        for (let i = 0; i < count; i++) {
            this.particles.push(new GameParticle(x, y, color));
        }
    }

    createTreatEffect(x, y, isSpecial = false) {
        const color = isSpecial ? 'rainbow' : 'gold';
        const count = isSpecial ? 12 : 6;
        this.createBurst(x, y, count, color);
    }

    createPowerUpEffect(x, y, type) {
        const colors = {
            speed: '#3b82f6',
            magnet: '#8b5cf6',
            double: '#f59e0b',
            shield: '#ef4444',
            freeze: '#06b6d4'
        };
        this.createBurst(x, y, 10, colors[type] || '#3b82f6');
    }

    update() {
        this.particles = this.particles.filter(particle => !particle.update());
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}

window.GameParticle = GameParticle;
window.GameParticleSystem = GameParticleSystem;
console.log("Particle system was initialized successfuly, yay");
