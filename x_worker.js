/*
 * Worker class, creep
 */
var utils = require('utils');
var xCreep = require('x_creep');
var _ = require('lodash');

function xWorker(name, spawn, memory) {
    var body = [Game.WORK, Game.WORK, Game.WORK, Game.MOVE, Game.CARRY];
    if (memory && _.contains(['recycler', 'carrier'], memory.role)) {
        body = [Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE];
    } else if (memory && _.contains(['miner', 'hardworker'], memory.role)) {
        body = [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.WORK];
    } else if (memory && _.contains(['builder'], memory.role)) {
        body = [Game.WORK, Game.CARRY, Game.MOVE, Game.CARRY, Game.CARRY];
    }
    this.__proto__.__proto__.constructor.apply(this, [name, body, spawn, memory]);
}
xWorker.prototype.__proto__ = xCreep.prototype;

xWorker.prototype.work = function() {
    var role = this.creep.memory.role;
    var spawn = Game.spawns[this.creep.memory.spawn];
    var availableSourceIdList = utils.listAvailableSourceId();
    var creep_source = this.creep.memory.source;
    var site = this.creep.pos.findNearest(Game.CONSTRUCTION_SITES);
    var energy_threshold = this.creep.energyCapacity;
    var dropped_energy = null;
    var miner = null;
    var source = spawn.pos.findNearest(Game.SOURCES);

    if (_.contains(['miner'], role)) {
        if (creep_source) {
            source = utils.getSourceById(creep_source);
        } else {
            if (Memory.sources.length > 0) {
                source = spawn.pos.findNearest(Game.SOURCES, {
                    filter: function(object) {
                        return _.contains(availableSourceIdList, object.id);
                    }
                });
            }
            this.creep.memory.source = source.id;
            Memory.sources.push({"id": source.id, "miner": this.creep.name});
        }
        if (source && source.energy > 0) {
            this.action = this.harvest(source);
        }
    }
    if (_.contains(['harvester', 'hardworker'], role)) {
        if (source && source.energy > 0 && (energy_threshold === 0 || this.creep.energy < energy_threshold)) {
            this.action = this.harvest(source);
        }
        if (!this.action && spawn.energy < spawn.energyCapacity && this.creep.energy > 0) {
            this.action = this.transferEnergy(spawn);
        }
    }
    if (_.contains(['carrier'], role)) {
        miner = Game.creeps[this.creep.memory.miner];
        if (miner) {
            dropped_energy = miner.pos.findInRange(Game.DROPPED_ENERGY, 2)[0];
            source = utils.getSourceById(miner.memory.source);
        }
        if (dropped_energy && this.creep.energy < energy_threshold) {
            this.action = this.recycle(dropped_energy);
        }
        if (!this.action && spawn.energy < spawn.energyCapacity && this.creep.energy == this.creep.energyCapacity) {
            this.action = this.transferEnergy(spawn);
        }
        source = utils.getSourceById(miner.memory.source);
        if (!this.action && source.energy === 0 && source.ticksToRegeneration > Memory.waiting_time) {
            role = 'recycler';
        }
        if (!this.action && miner) {
            this.moveTo(miner);
        }
    }
    if (_.contains(['recycler'], role)) {
        if (this.creep.memory.flag) {
            dropped_energy = Game.flags[this.creep.memory.flag].pos.findInRange(Game.DROPPED_ENERGY, Memory.flag_radius)[0];
        } else {
            dropped_energy = Game.flags.Flag1.pos.findNearest(Game.DROPPED_ENERGY);
        }
        if (dropped_energy && this.creep.energy < energy_threshold) {
            this.action = this.recycle(dropped_energy);
        }
        if (!this.action && spawn.energy < spawn.energyCapacity) {
            if (this.creep.energy == this.creep.energyCapacity) {
                this.action = this.transferEnergy(spawn);
            } else if (this.creep.energy > 0 && this.creep.memory.flag) {
            this.action = this.transferEnergy(spawn);
            }
        }
    }
    if (_.contains(['builder'], role)) {
        if (this.creep.memory.flag) {
            dropped_energy = Game.flags[this.creep.memory.flag].pos.findInRange(Game.DROPPED_ENERGY, Memory.flag_radius)[0];
        }
        if (dropped_energy && this.creep.energy === 0) {
            this.action = this.recycle(dropped_energy);
            this.creep.memory.last_action = 'recylcle';
        }
        if (dropped_energy && this.creep.energy < this.creep.energyCapacity && this.creep.memory.last_action != 'build') {
            this.action = this.recycle(dropped_energy);
            this.creep.memory.last_action = 'recylcle';
        }
        if (!this.action && site && this.creep.energy > 0) {
            this.action = this.build(site);
            this.creep.memory.last_action = 'build';
        }
    }
    if (_.contains(['extender'], role)) {
        miner = Game.creeps[this.creep.memory.miner];
        if (miner) {
            source = utils.getSourceById(miner.memory.source);
        }
        if (source.energy === 0 && source.ticksToRegeneration > Memory.waiting_time) {
            source = this.creep.pos.findNearest(Game.SOURCES_ACTIVE);
        }
        if (!this.action && source && source.energy > 0 && this.creep.energy === 0) {
            this.action = this.harvest(source);
            this.creep.memory.last_action = 'harvest';
        }
        if (!this.action && source && source.energy > 0 && this.creep.energy < this.creep.energyCapacity && this.creep.memory.last_action != 'build') {
            this.action = this.harvest(source);
            this.creep.memory.last_action = 'harvest';
        }
        if (!this.action && site && this.creep.energy >= 0)  {
            this.action = this.build(site);
            this.creep.memory.last_action = 'build';
        }
        if (!this.action) {
            this.moveTo(source);
        }
    }
    this.defaultAction();
};

xWorker.prototype.harvest = function(source) {
    this.moveTo(source);
    this.creep.harvest(source);
    return 'harvest';
};

xWorker.prototype.recycle = function(energy) {
    this.moveTo(energy);
    this.creep.pickup(energy);
    return 'recycle';
};

xWorker.prototype.build = function(site) {
    this.moveTo(site);
    this.creep.build(site);
    return 'build';
};

xWorker.prototype.transferEnergy = function(spawn) {
    this.moveTo(spawn);

    var amount = this.creep.energy;
    if (spawn.energyCapacity - spawn.energy < this.creep.energy) {
        amount = spawn.energyCapacity - spawn.energy;
    }

    if (this.creep.transferEnergy(spawn, amount) === 0) {
        spawn.memory.energy_total += amount;
    }
    return 'transfer';
};

module.exports = xWorker;
