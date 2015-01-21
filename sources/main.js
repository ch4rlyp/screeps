/**
 * TODO LIST:
 * - While a miner die, the game is broken during the spawn time, and it's not able to return to his own mine.
 * - Implement level management (level == many objectives, when all objectives are complete, level increase etc...)
 * - Implement extension management (Build)
 * - Improve CPU use
 */

var _ = require('lodash');
var init_mode = require('init_mode');
var xWorker = require('x_worker');
var xGuard = require('x_guard');

/**
 *  Init Memory
 */
if (!Memory.chrono) Memory.chrono = 0;
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

/**
 * Init creep
 * available mode : sim1, sim2, sim3
 */
init_mode('sim2');

/**
 * Manage creep spawns
 */
_(Game.creeps).forEach(function(creep) {
    if (creep.memory.type == "guard") {
        var guard = new xGuard(creep.name);
        guard.fight();
    } else if (creep.memory.type == "worker") {
        var worker = new xWorker(creep.name);
        worker.work();
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

Memory.chrono++;
