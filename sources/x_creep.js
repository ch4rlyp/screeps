/*
 * Creep class extend
 */
var _ = require('lodash');
var utils = require('utils');

function xCreep(name, body, spawn, memory) {
    this.name = name;
    this.spawn = spawn;
    var creep = Game.creeps[name];
    if (creep) {
        this.creep = creep;
        this.role = creep.memory.role;
    } else if (!spawn.memory.working) {
        if (Memory.creeps[name]) {

        } else {
            memory.spawn = spawn.name;
            memory.last_action = null;
            memory.level = 0;
        }

        this.creep = this.spawnCreep(name, body, memory);
    }
    this.action = null;
}

xCreep.prototype.spawnCreep = function(name, body, memory) {
    var status = this.spawn.createCreep(body, name, memory);
    this.computePrice(body);
    // if (status == name) {
    //     console.log('A new ' + memory.role + ' is in creation progress, price: ' +  this.creep_price);
    // }
    this.spawn.memory.working = true;
};

xCreep.prototype.getPrice = function() {
    return this.creep_price;
};

xCreep.prototype.computePrice = function(body) {
    var creep_price = 0;
    _.forEach(body, function(part) { creep_price += utils.getBodyPartCost(part); });
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
    if (x && y === undefined) {
        var fromPos = this.creep.pos;
        var toPos = x.pos;
        var path = this.creep.room.findPath(fromPos, toPos, { maxOps: 200 });
        if (!path.length || !toPos.equalsTo(path[path.length - 1])) {
            path = this.creep.room.findPath(
                fromPos,
                toPos,
                { maxOps: 1000, ignoreDestructibleStructures: true });
        }
        if (path.length) {
            this.creep.move(path[0].direction);
        }
    } else {
        this.creep.moveTo(x, y);
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

xCreep.prototype.getRange = function(target) {
    return utils.getRange(this.creep.pos, target.pos);
};

module.exports = xCreep;
