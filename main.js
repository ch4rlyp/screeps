var _ = require('lodash');
var xWorker = require('x_worker');
var xGuard = require('x_guard');

/**
 *  Init Memory
 */
if (!Memory.debug) Memory.debug = false;
if (!Memory.sources) Memory.sources = [];
if (!Memory.base) Memory.base = "Spawn1";
if (!Memory.waiting_time) Memory.waiting_time = 10;
if (!Memory.flag_radius) Memory.flag_radius = 5;

/**
 * Manage spawns
 */
_(Game.spawns).forEach(function(spawn) {
    if (!spawn.spawning) {
        spawn.memory.working = false;
    } else {
        spawn.memory.working = true;
    }
    if (!spawn.memory.energy_total) {
        spawn.memory.energy_total = spawn.energy;
    }
});

var spawn = Game.spawns.Spawn1;
// First mine groupe
new xWorker('w1_m1', spawn, {"type": "worker", "role": 'miner'});
new xWorker('w1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w1_m1"});
// First guard group
new xGuard('g1_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
new xWorker('g1_r', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
// Second mine group
new xWorker('w2_m1', spawn, {"type": "worker", "role": 'miner',});
// Add healer to first group
new xGuard('g1_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
// Add carrier to mine 2
new xWorker('w2_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w2_m1"});
// Add new guard to g1
new xGuard('g1_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1", "leader": "g1_l"});
// Third mine group
new xWorker('w3_m1', spawn, {"type": "worker", "role": 'miner'});
new xWorker('w3_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w3_m1"});
// Add new guard to g1
new xGuard('g1_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1", "leader": "g1_l"});
// Add a second recycler to mine 2
// new xWorker('w2_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "w2_m1"});
// Second Guard group
new xGuard('g2_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
// Second builder
// new xWorker('b2', spawn, {"type": "worker", "role": 'builder', "flag": "Flag1"});
// Add new recycler to mine 3
new xWorker('w3_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "w3_m1"});
// Add guard to second guard group
new xWorker('g2', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
new xGuard('g2_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
new xGuard('g2_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1", "leader": "g2_l"});
// Add guard to second guard group
new xWorker('g3', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
new xGuard('g2_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1", "leader": "g2_l"});
// Third guard group
new xGuard('g3_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
new xGuard('g3_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
new xWorker('g4', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
new xGuard('g3_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1", "leader": "g3_l"});
new xGuard('g3_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1", "leader": "g3_l"});
// First builder
new xWorker('b1', spawn, {"type": "worker", "role": 'builder', "flag": "Flag1"});

/**
 * Manage creep spawns
 */
_(Game.creeps).forEach(function(creep) {
    if (creep.memory.type == "worker") {
        var worker = new xWorker(creep.name);
        worker.work();
    } else if (creep.memory.type == "guard") {
        var guard = new xGuard(creep.name);
        guard.fight();
    }
});

/**
 * Accumulated energy in order to compare
 */
if (Game.time !== 0 && Game.time % 60 === 0) {
    var n_wave = Game.time / 60;
    _(Game.spawns).forEach(function(spawn) {
        console.log(spawn.name + " Wave n°" + n_wave + ": " + spawn.memory.energy_total + " accumulated");
    });
}
