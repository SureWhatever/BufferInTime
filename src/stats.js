export default class Stats {
    constructor(health, attack, defense) {
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }

    calculateDamage(stats){
        if (arguments.length === 0){
            return this.attack;
        } else if (typeof stats === "object"){
            return Math.min(this.attack - stats.defense, stats.health);
        }
    }
}

