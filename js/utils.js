window.Utils = {
    random: (min, max) => Math.random() * (max - min) + min,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    distance: (x1, y1, x2, y2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    rectCollision: (x1, y1, w1, h1, x2, y2, w2, h2) => {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    },
    formatNumber: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

window.Storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            return false;
        }
    },
    load: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    }
};

window.DOM = {
    get: (id) => document.getElementById(id),
    show: (element) => {
        if (typeof element === 'string') element = document.getElementById(element);
        if (element) element.style.display = 'block';
    },
    hide: (element) => {
        if (typeof element === 'string') element = document.getElementById(element);
        if (element) element.style.display = 'none';
    },
    setText: (element, text) => {
        if (typeof element === 'string') element = document.getElementById(element);
        if (element) element.textContent = text;
    }
};

window.CanvasUtils = {
    drawText: (ctx, text, x, y, fontSize = 20, fillColor = 'white', strokeColor = 'black', strokeWidth = 2) => {
        ctx.font = fontSize + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.strokeText(text, x, y);
        }
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
    },
    drawEmoji: (ctx, emoji, x, y, size = 30) => {
        ctx.font = size + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, x, y);
    },
    clear: (ctx, width, height) => ctx.clearRect(0, 0, width, height)
};
