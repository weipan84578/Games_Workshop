// food.js
class Food {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.items = [];
        this.maxFood = 2;
        this.types = {
            NORMAL: { type: 'normal', color: '#e94560', probability: 0.70, score: 10, effect: 'grow' },
            SPEED: { type: 'speed', color: '#ffff00', probability: 0.15, score: 20, effect: 'speed' },
            GOLDEN: { type: 'golden', color: '#ffd700', probability: 0.10, score: 50, effect: 'golden', duration: 10000 },
            SHRINK: { type: 'shrink', color: '#0000ff', probability: 0.05, score: 30, effect: 'shrink' }
        };
    }

    spawn(excludeList) {
        if (this.items.length >= this.maxFood) return;

        const rand = Math.random();
        let selectedType;
        let cumulativeProb = 0;

        for (const key in this.types) {
            cumulativeProb += this.types[key].probability;
            if (rand <= cumulativeProb) {
                selectedType = this.types[key];
                break;
            }
        }

        const pos = Utils.getRandomGridPos(this.gridSize, [...excludeList, ...this.items.map(f => ({x: f.x, y: f.y}))]);
        
        const foodItem = {
            ...pos,
            ...selectedType,
            id: Date.now() + Math.random(),
            createdAt: Date.now()
        };

        this.items.push(foodItem);
    }

    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
    }

    update() {
        const now = Date.now();
        // 處理黃金食物過期
        this.items = this.items.filter(item => {
            if (item.type === 'golden') {
                return (now - item.createdAt) < item.duration;
            }
            return true;
        });
    }

    reset() {
        this.items = [];
    }
}
