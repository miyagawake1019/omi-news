class Unit {
    constructor(game, x, y, width, height, speed, health, damage, range, type, cost) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
        this.damage = damage;
        this.range = range;
        this.type = type; // 'ally' or 'enemy'
        this.cost = cost || 0;
        this.markedForDeletion = false;
        this.attackCooldown = 0;
        this.attackRate = 30; // Frames
        this.state = 'moving'; // 'moving', 'attacking', 'idle'
    }

    update() {
        if (this.health <= 0) {
            this.markedForDeletion = true;
            return;
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        if (this.state === 'moving') {
            if (this.type === 'ally') {
                this.x += this.speed;
            } else {
                this.x -= this.speed;
            }
        }
    }

    draw(ctx) {
        // HP Bar
        const hpPercent = Math.max(0, this.health / this.maxHealth);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.width, 4);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(this.x, this.y - 10, this.width * hpPercent, 4);
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}

class NormalCat extends Unit {
    constructor(game, x, y) {
        const multiplier = 1 + (game.researchLevel - 1) * 0.5;
        super(game, x, y, 40, 40, 2, 100 * multiplier, 10 * multiplier, 10, 'ally', 100);
    }

    draw(ctx) {
        // Draw Cat
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // Body
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 20, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Ears
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 10);
        ctx.lineTo(this.x + 5, this.y - 5);
        ctx.lineTo(this.x + 15, this.y + 5);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + 35, this.y + 10);
        ctx.lineTo(this.x + 35, this.y - 5);
        ctx.lineTo(this.x + 25, this.y + 5);
        ctx.fill();
        ctx.stroke();

        // Face
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 20, 2, 0, Math.PI * 2); // Eye L
        ctx.arc(this.x + 28, this.y + 20, 2, 0, Math.PI * 2); // Eye R
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 25);
        ctx.lineTo(this.x + 15, this.y + 30);
        ctx.moveTo(this.x + 20, this.y + 25);
        ctx.lineTo(this.x + 25, this.y + 30);
        ctx.stroke();

        // Legs
        if(this.state === 'moving' && Math.floor(Date.now() / 100) % 2 === 0) {
             ctx.beginPath();
             ctx.moveTo(this.x + 10, this.y + 35);
             ctx.lineTo(this.x + 10, this.y + 45);
             ctx.moveTo(this.x + 30, this.y + 35);
             ctx.lineTo(this.x + 30, this.y + 45);
             ctx.stroke();
        } else {
             ctx.beginPath();
             ctx.moveTo(this.x + 15, this.y + 35);
             ctx.lineTo(this.x + 15, this.y + 45);
             ctx.moveTo(this.x + 25, this.y + 35);
             ctx.lineTo(this.x + 25, this.y + 45);
             ctx.stroke();
        }

        // HP Bar
        super.draw(ctx);
    }
}

class TankCat extends Unit {
    constructor(game, x, y) {
        const multiplier = 1 + (game.researchLevel - 1) * 0.5;
        super(game, x, y, 40, 80, 1, 400 * multiplier, 5 * multiplier, 10, 'ally', 300);
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // Body (Tall rect)
        ctx.fillRect(this.x, this.y, 40, 80);
        ctx.strokeRect(this.x, this.y, 40, 80);

        // Face (Top)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 20, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 28, this.y + 20, 2, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 25);
        ctx.lineTo(this.x + 15, this.y + 30);
        ctx.moveTo(this.x + 20, this.y + 25);
        ctx.lineTo(this.x + 25, this.y + 30);
        ctx.stroke();

        // Ears
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y);
        ctx.lineTo(this.x + 5, this.y - 10);
        ctx.lineTo(this.x + 15, this.y);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + 35, this.y);
        ctx.lineTo(this.x + 35, this.y - 10);
        ctx.lineTo(this.x + 25, this.y);
        ctx.fill();
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 80);
        ctx.lineTo(this.x + 10, this.y + 90);
        ctx.moveTo(this.x + 30, this.y + 80);
        ctx.lineTo(this.x + 30, this.y + 90);
        ctx.stroke();

        super.draw(ctx);
    }
}

class GodUnit extends Unit {
    constructor(game, x, y) {
        const multiplier = 1 + (game.researchLevel - 1) * 0.5;
        super(game, x, y, 100, 120, 0.5, 2000 * multiplier, 500 * multiplier, 150, 'ally', 1000);
        this.attackRate = 120; // Slow attack
    }

    draw(ctx) {
        ctx.fillStyle = '#fffbeb'; // Light yellow glow
        ctx.strokeStyle = '#fbbf24'; // Gold
        ctx.lineWidth = 4;

        // Aura
        ctx.beginPath();
        ctx.arc(this.x + 50, this.y + 60, 60, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.fill();

        // Body
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(this.x + 50, this.y + 60, 40, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Face
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 35, this.y + 50, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 65, this.y + 50, 5, 0, Math.PI * 2);
        ctx.fill();

        // Third Eye
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(this.x + 50, this.y + 30, 8, 0, Math.PI * 2);
        ctx.fill();

        // Attack effect
        if(this.state === 'attacking' && this.attackCooldown > this.attackRate - 20) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(this.x + 100, this.y + 20, 400, 80); // Beam
        }

        super.draw(ctx);
    }
}

class EnemyDog extends Unit {
    constructor(game, x, y) {
        super(game, x, y, 40, 40, 1.5, 150, 15, 10, 'enemy', 0);
    }

    draw(ctx) {
        ctx.fillStyle = '#fca5a5'; // Reddish
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;

        // Body
        ctx.fillRect(this.x, this.y + 10, 40, 30);
        ctx.strokeRect(this.x, this.y + 10, 40, 30);

        // Head
        ctx.fillRect(this.x - 10, this.y, 20, 20);
        ctx.strokeRect(this.x - 10, this.y, 20, 20);

        super.draw(ctx);
    }
}


class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.lastTime = 0;
        this.money = 0;
        this.maxMoney = 500;
        this.moneyRate = 0.5;

        this.baseHealth = 1000;
        this.maxBaseHealth = 1000;

        this.enemyBaseHealth = 5000;
        this.maxEnemyBaseHealth = 5000;

        this.allies = [];
        this.enemies = [];

        this.walletLevel = 1;
        this.researchLevel = 1;

        this.spawnTimer = 0;

        this.groundY = this.height - 50;

        this.gameOver = false;

        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.loop = this.loop.bind(this);

        this.setupInput();
    }

    setupInput() {
        document.getElementById('spawn-normal').addEventListener('click', () => this.spawnAlly('normal'));
        document.getElementById('spawn-tank').addEventListener('click', () => this.spawnAlly('tank'));
        document.getElementById('spawn-super').addEventListener('click', () => this.spawnAlly('super'));

        document.getElementById('upgrade-wallet').addEventListener('click', () => this.upgradeWallet());
        document.getElementById('upgrade-research').addEventListener('click', () => this.upgradeResearch());
    }

    start() {
        this.loop(0);
    }

    loop(timestamp) {
        if(this.gameOver) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime || 16);
        this.draw();

        requestAnimationFrame(this.loop);
    }

    update(deltaTime) {
        // Money
        if (this.money < this.maxMoney) {
            this.money += this.moneyRate * (deltaTime / 16);
            if(this.money > this.maxMoney) this.money = this.maxMoney;
        }

        // UI Updates
        document.getElementById('money-display').textContent = `¥${Math.floor(this.money)}`;
        const hpPercent = Math.max(0, (this.baseHealth / this.maxBaseHealth) * 100);
        document.getElementById('base-hp-bar').style.width = `${hpPercent}%`;

        // Spawn Enemies
        this.spawnTimer += deltaTime;
        if(this.spawnTimer > 2000) { // Every 2 seconds
            if(Math.random() < 0.3) {
                this.spawnEnemy();
            }
            this.spawnTimer = 0;
        }

        // --- Combat Logic ---

        // Allies
        this.allies.forEach(ally => {
            ally.state = 'moving';

            // Check vs Enemy Units
            let target = null;
            for (let enemy of this.enemies) {
                // Simple 1D collision
                if (ally.x + ally.width >= enemy.x && ally.x < enemy.x + enemy.width) {
                     target = enemy;
                     break;
                }
            }

            // Check vs Enemy Base
            if (!target) {
                if (ally.x + ally.width >= this.width - 60) {
                    ally.state = 'attacking';
                    if (ally.attackCooldown <= 0) {
                        this.enemyBaseHealth -= ally.damage;
                        ally.attackCooldown = ally.attackRate;
                    }
                }
            }

            if (target) {
                ally.state = 'attacking';
                if (ally.attackCooldown <= 0) {
                    target.takeDamage(ally.damage);
                    ally.attackCooldown = ally.attackRate;
                }
            }

            ally.update();
        });

        // Enemies
        this.enemies.forEach(enemy => {
            enemy.state = 'moving';

            // Check vs Ally Units
            let target = null;
            for (let ally of this.allies) {
                if (enemy.x <= ally.x + ally.width && enemy.x + enemy.width > ally.x) {
                    target = ally;
                    break;
                }
            }

            // Check vs Player Base
            if (!target) {
                if (enemy.x <= 60) {
                    enemy.state = 'attacking';
                    if (enemy.attackCooldown <= 0) {
                        this.baseHealth -= enemy.damage;
                        enemy.attackCooldown = enemy.attackRate;
                    }
                }
            }

            if (target) {
                enemy.state = 'attacking';
                if (enemy.attackCooldown <= 0) {
                    target.takeDamage(enemy.damage);
                    enemy.attackCooldown = enemy.attackRate;
                }
            }

            enemy.update();
        });

        // Cleanup
        this.allies = this.allies.filter(a => !a.markedForDeletion);
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Game Over Logic
        if (this.baseHealth <= 0) {
            this.baseHealth = 0;
            this.gameOver = true;
            this.draw(); // Draw final state
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.ctx.fillRect(0,0,this.width,this.height);
            this.ctx.fillStyle = "white";
            this.ctx.font = "40px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("GAME OVER...", this.width/2, this.height/2);
        }

        if (this.enemyBaseHealth <= 0) {
             this.enemyBaseHealth = 0;
             this.gameOver = true;
             this.draw();
             this.ctx.fillStyle = "rgba(255,255,255,0.7)";
             this.ctx.fillRect(0,0,this.width,this.height);
             this.ctx.fillStyle = "#4ade80"; // Green
             this.ctx.font = "40px sans-serif";
             this.ctx.textAlign = "center";
             this.ctx.fillText("VICTORY! 村は守られた！", this.width/2, this.height/2);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Ground
        this.ctx.fillStyle = "#e2e8f0";
        this.ctx.fillRect(0, this.groundY, this.width, 50);

        // Base (Left)
        this.ctx.fillStyle = "#4ade80";
        this.ctx.fillRect(0, this.height - 150, 60, 100);
        // Base HP
        this.ctx.fillStyle = "black";
        this.ctx.font = "16px sans-serif";
        this.ctx.fillText(`${Math.floor(this.baseHealth)}`, 10, this.height - 160);

        // Enemy Base (Right)
        this.ctx.fillStyle = "#f87171";
        this.ctx.fillRect(this.width - 60, this.height - 150, 60, 100);
        // Enemy Base HP
        this.ctx.fillText(`${Math.floor(this.enemyBaseHealth)}`, this.width - 80, this.height - 160);

        this.allies.forEach(ally => ally.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }

    spawnAlly(type) {
        if(this.gameOver) return;

        let unit;
        let cost = 0;

        // Calculate spawn position (slightly varied or fixed)
        // Fixed at base exit
        const spawnX = 60;

        if (type === 'normal') {
            unit = new NormalCat(this, spawnX, this.groundY - 40);
        } else if (type === 'tank') {
             unit = new TankCat(this, spawnX, this.groundY - 80);
        } else if (type === 'super') {
             unit = new GodUnit(this, spawnX, this.groundY - 120);
        }

        if (unit) {
            cost = unit.cost;
            if (this.money >= cost) {
                this.money -= cost;
                this.allies.push(unit);
            }
        }
    }

    spawnEnemy() {
        if(this.gameOver) return;
        const unit = new EnemyDog(this, this.width - 100, this.groundY - 40);
        this.enemies.push(unit);
    }

    upgradeWallet() {
        if(this.gameOver) return;
        const cost = 500 * this.walletLevel;
        if (this.money >= cost) {
            this.money -= cost;
            this.walletLevel++;
            this.maxMoney += 500;
            this.moneyRate += 0.5;

            const nextCost = 500 * this.walletLevel;
            document.getElementById('wallet-cost').textContent = nextCost;
        }
    }

    upgradeResearch() {
        if(this.gameOver) return;
        const cost = 1000 * this.researchLevel;
        if (this.money >= cost) {
            this.money -= cost;
            this.researchLevel++;

            const nextCost = 1000 * this.researchLevel;
            document.getElementById('research-cost').textContent = nextCost;
        }
    }
}

window.addEventListener('load', () => {
    const game = new Game();
    game.start();
});
