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
    } else if (memory && _.contains(['undertaker'], memory.role)) {
        // WWWMC 350 / WWMCC 440 with 3 roads distance
        // WWWMC 1900 / WWMCC 1550 with 10 roads distance
        body = [Game.WORK, Game.WORK, Game.MOVE, Game.CARRY, Game.CARRY];
    } else if (memory && _.contains(['repairer'], memory.role)) {
        body = [Game.WORK, Game.WORK, Game.MOVE, Game.CARRY, Game.CARRY];
    }
    this.__proto__.__proto__.constructor.apply(this, [name, body, spawn, memory]);
}
xWorker.prototype.__proto__ = xCreep.prototype;

xWorker.prototype.work = function() {
    var role = this.creep.memory.role;
    var spawn = Game.spawns.Spawn1;
    var availableSourceIdList = utils.listAvailableSourceId();
    var creep_source = this.creep.memory.source;
    var site = this.creep.pos.findNearest(Game.CONSTRUCTION_SITES);
    var energy_threshold = this.creep.energyCapacity;
    var spawnThreshold = spawn.energyCapacity * 0.3;
    var dropped_energy = null;
    var miner = null;
    var source = spawn.pos.findNearest(Game.SOURCES);

    if (_.contains(['miner'], role)) {
        if (creep_source) {
            source = Game.getObjectById(creep_source);
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
            source = Game.getObjectById(miner.memory.source);
        }
        if (dropped_energy && this.creep.energy < energy_threshold) {
            this.action = this.recycle(dropped_energy);
        }
        if (!this.action && spawn.energy < spawn.energyCapacity && this.creep.energy == this.creep.energyCapacity) {
            this.action = this.transferEnergy(spawn);
        }
        source = Game.getObjectById(miner.memory.source);
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
    if (_.contains(['extender', 'undertaker'], role)) {
        miner = Game.creeps[this.creep.memory.miner];
        if (miner) {
            source = Game.getObjectById(miner.memory.source);
        }
        if (!source || !miner) {
            source = this.creep.pos.findNearest(Game.SOURCES_ACTIVE);
        }
        if (source.energy === 0 && source.ticksToRegeneration > Memory.waiting_time) {
            source = this.creep.pos.findNearest(Game.SOURCES_ACTIVE);
        }
        if (spawn.energy > spawnThreshold) {
            source = spawn;
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
    if (_.contains(['repairer'], role)) {
        var struct = utils.findNearestDamagedStructure(this.creep.pos);
        if (struct && this.creep.energy > 0) {
            this.action = this.repair(struct);
        } else if (spawn.energy > spawnThreshold) {
            this.action = this.takeEnergy(spawn);
        }
    }
    this.defaultAction();
};

xWorker.prototype.harvest = function(source) {
    this.moveTo(source);
    if (source.structureType == 'spawn') {
        source.transferEnergy(this.creep);
    } else {
        this.creep.harvest(source);
    }
    return 'harvest';
};

xWorker.prototype.recycle = function(energy) {
    this.moveTo(energy);
    this.creep.pickup(energy);
    return 'recycle';
};

xWorker.prototype.repair = function(struct) {
    this.moveTo(struct);
    this.creep.repair(struct);
    return 'repair';
};

xWorker.prototype.build = function(site) {
    var build_status = this.creep.build(site);
    if (build_status == -9) {
        this.moveTo(site);
    }
    if (build_status == -7) {
        this.moveTo(site.pos.x +1, site.pos.y);
    }
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

xWorker.prototype.takeEnergy = function(spawn) {
    this.moveTo(spawn);
    spawn.transferEnergy(this.creep);

    return 'provision';
};

module.exports = xWorker;
