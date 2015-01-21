/*
 * Guard class, creep
 */
var xCreep = require('x_creep');
var utils = require('utils');

function xGuard(name, spawn, memory) {
    var body = [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE];
    if (memory && memory.role == 'healer') {
        body = [Game.TOUGH, Game.HEAL, Game.HEAL, Game.MOVE];
    } else if (memory && memory.role == 'archer') {
        body = [Game.TOUGH, Game.TOUGH, Game.RANGED_ATTACK, Game.MOVE];
    } else if (memory && memory.role == 'tower') {
        body = [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK];
    } else if (memory && memory.role == 'support') {
        body = [Game.MOVE, Game.RANGED_ATTACK, Game.HEAL, Game.HEAL, Game.MOVE];
    } else if (memory && memory.role == 'mixed') {
        body = [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.RANGED_ATTACK, Game.MOVE];
    }
    this.__proto__.__proto__.constructor.apply(this, [name, body, spawn, memory]);
}
xGuard.prototype.__proto__ = xCreep.prototype;

xGuard.prototype.fight = function() {
    var enemy = this.creep.pos.findInRange(Game.HOSTILE_CREEPS, 1)[0];
    if (enemy) {
        var x = enemy.pos.x;
        var y = enemy.pos.y;
        var d1 = this.creep.pos.getDirectionTo(enemy);
        var d2 = this.creep.pos.getDirectionTo(x, y);
        // console.log("x: " + x + ";y: " + y + ";d1: " + d1 + ";d2: " + d2);
    }

    var spawn = this.creep.pos.findNearest(Game.MY_SPAWNS);
    var is_melee = this.creep.getActiveBodyparts(Game.ATTACK) > 0;
    var is_healer = this.creep.getActiveBodyparts(Game.HEAL) > 0;
    var is_range = this.creep.getActiveBodyparts(Game.RANGED_ATTACK) > 0;

    if (is_range) {
        this.action = this.ranged_attack();
    }
    if (is_melee) {
        this.action = this.melee_attack();
    }
    if (is_healer) {
        this.action = this.heal();
    }

    this.defaultAction();
};

xGuard.prototype.melee_attack = function() {
    var target = this.creep.pos.findNearest(Game.HOSTILE_CREEPS);
    if (target) {
        this.moveTo(target);
        var attack = this.creep.attack(target);
        if (attack === 0) {
            return "melee attack " + target.name;
        } else if (attack == -9) {
            return "target too far";
        } else {
            this.say("melee attack fail (" + attack + ")");
            return null;
        }
    }
    return null;
};

xGuard.prototype.ranged_attack = function() {
    var target = this.creep.pos.findNearest(Game.HOSTILE_CREEPS);
    if (target) {
        var target_direction = this.creep.pos.getDirectionTo(target);
        if (target_direction >= 1) {
            this.creep.move(utils.getOppositeDirection(target_direction));
        } else {
            this.creep.moveTo(target);
        }

        var attack = this.creep.rangedAttack(target);
        if (attack === 0) {
            return "range attack " + target.name;
        } else if (attack == -9) {
            return "target too far";
        } else {
            this.say("range attack fail (" + attack + ")");
            return null;
        }
    }
    return null;
};

xGuard.prototype.mixed_attack = function(target) {
    this.moveTo(target);
    var attack = this.creep.attack(target);
    attack = this.creep.rangedAttack(target);
    if (attack === 0) {
        return "attack " + target.name;
    } else if (attack == -9) {
        return "target too far";
    } else {
        this.say("attack fail (" + attack + ")");
        return null;
    }
};

xGuard.prototype.heal = function() {
    var id = this.creep.id;
    var target = this.creep.pos.findNearest(Game.HOSTILE_CREEPS);
    var damaged_ally = this.creep.pos.findNearest(Game.MY_CREEPS, {
        filter: function(ally) {
            // if ally is full of life or himself => not heal
            if (ally.hits == ally.hitsMax || ally.id === id) {
                return false;
            }
            // if an enemy is here => not heal worker
            if (target && ally.memory.type == 'worker') {
                return false;
            }
            return true;
        }
    });
    if (damaged_ally) {
        this.moveTo(damaged_ally);
        var heal = this.creep.heal(damaged_ally);
        if (heal === 0) {
           return "heal " + damaged_ally.name;
        } else if (heal == -9) {
            return "target too far";
        } else {
            return "heal fail (" + heal + ")";
        }
    }
    return null;
};


module.exports = xGuard;
