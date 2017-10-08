export default class Stats {
    constructor(health, attack, defense) {
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }

    calculateDamage(stats = null){
        if (stats === null){
            return this.attack;
        }
        return Math.min(this.attack - stats.defense, stats.health);
    }
}

