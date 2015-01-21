/*
 * Creep class extend
 */
var _ = require('lodash');

var body_part_prices = {
    'move': 50,
    'work': 20,
    'carry': 50,
    'attack': 100,
    'ranged_attack': 150,
    'heal': 200,
    'tough': 5
};

function xCreep(name, body, spawn, memory) {
    this.name = name;
    this.spawn = spawn;
    var creep = Game.creeps[name];
    if (creep) {
        this.creep = creep;
        this.role = creep.memory.role;
    } else if (!spawn.memory.working) {
        memory.spawn = spawn.name;
        memory.last_action = null;
        this.creep = this.spawnCreep(name, body, memory);
        this.role = memory.role;
    }
    this.action = null;
}

xCreep.prototype.spawnCreep = function(name, body, memory) {
    var status = this.spawn.createCreep(body, name, memory);
    this.computePrice(body);
    if (status == name) {
        console.log('A new ' + memory.role + ' is in creation progress, price: ' +  this.creep_price);
    }
    this.spawn.memory.working = true;
};

xCreep.prototype.getPrice = function() {
    return this.creep_price;
};

xCreep.prototype.computePrice = function(body) {
    var creep_price = 0;
    _.forEach(body, function(part) { creep_price += body_part_prices[part]; });
    this.creep_price = creep_price;
};

xCreep.prototype.say = function(message) {
    console.log(this.name + " says: '" + message + "'");
};

xCreep.prototype.defaultAction = function(message) {
    // if (!this.action && this.creep.hits < this.creep.hitsMax) {
    //     var healer = this.creep.pos.findNearest(Game.MY_CREEPS, {
    //         filter: function(object) {
    //             return object.getActiveBodyparts(Game.HEAL) > 0;
    //         }
    //     });
    //     if (healer) {
    //         this.action = this.moveTo(healer);
    //     }
    // }
    if (!this.action) {
        this.action = this.followLeader();
    }
    if (!this.action) {
        this.action = this.moveToFlag();
    }
    if (!this.action) {
        this.moveToBase();
        this.action = 'nothing to do, return to base';
    }
    if (Memory.debug) {
        this.say(this.action);
    }
};

xCreep.prototype.moveTo = function(x, y) {
    if (y === undefined) {
        this.creep.moveTo(x);
        return "walk to " + x;
    } else {
        this.creep.moveTo(x, y);
        return "walk to " + x + "/y";
    }

};

xCreep.prototype.followLeader = function() {
    if (this.creep.memory.leader) {
        this.moveTo(Game.creeps[this.creep.memory.leader]);
        return "follow the leader";
    }
};

xCreep.prototype.moveToFlag = function() {
    if (this.creep.memory.flag) {
        this.moveTo(Game.flags[this.creep.memory.flag]);
        return "return to flag";
    }
    return null;
};

xCreep.prototype.moveToBase = function() {
    this.moveTo(this.spawn);
};

module.exports = xCreep;