/*
 * Init Game Strategy
 */
var xWorker = require('x_worker');
var xGuard = require('x_guard');

module.exports = function(mode) {
    var spawn = Game.spawns.Spawn1;
    switch(mode) {
        case 'custom':
            // First mine groupe
            new xWorker('m1_w1', spawn, {"type": "worker", "role": 'miner'});
            new xWorker('m1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m1_w1"});
            new xWorker('m1_b1', spawn, {"type": "worker", "role": 'undertaker', "miner": "m1_w1"});
            break;
        case 'sim1':
            console.log('not implemented');
            break;
        case 'sim2':
            new xWorker('m1_m', spawn, {"type": "worker", "role": 'miner'});
            new xWorker('m1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m1_m"});
            new xWorker('m1_b', spawn, {"type": "worker", "role": 'undertaker', "miner": "m1_m"});

            new xWorker('m2_m', spawn, {"type": "worker", "role": 'miner'});
            new xWorker('m2_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m2_m"});
            new xWorker('m2_b', spawn, {"type": "worker", "role": 'undertaker', "miner": "m2_m"});

            new xGuard('g1_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
            new xWorker('r1', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
            new xGuard('g1_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag1"});

            new xGuard('g1_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});

            new xWorker('m3_m', spawn, {"type": "worker", "role": 'miner'});
            new xWorker('m3_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m3_m"});
            new xWorker('m3_b', spawn, {"type": "worker", "role": 'undertaker', "miner": "m3_m"});

            new xWorker('rp1', spawn, {"type": "worker", "role": 'repairer'});

            new xGuard('g1_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});

            new xWorker('m2_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "m3_m"});
            new xWorker('m3_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "m3_m"});

            new xGuard('g2_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag2"});
            new xWorker('r2', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag2"});
            new xGuard('g2_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
            new xGuard('g2_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag2"});
            new xGuard('g2_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag2"});

            new xGuard('g1_m3', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
            new xGuard('g1_m4', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
            new xGuard('g1_h2', spawn, {"type": "guard", "role": 'support', "flag": "Flag1"});

            new xGuard('g2_m3', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag2"});
            new xGuard('g2_m4', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag2"});
            new xGuard('g2_h2', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});

            new xGuard('g3_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag3"});
            new xGuard('g3_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag3"});
            new xGuard('g3_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag3"});
            new xGuard('g3_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag3"});

            break;
   }
};