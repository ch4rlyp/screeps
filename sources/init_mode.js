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


// Version with 60seconds wave
// module.exports = function(mode) {
//     var spawn = Game.spawns.Spawn1;
//     switch(mode) {
//         case 'custom':
//             // First mine groupe
//             new xWorker('m1_w1', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('m1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m1_w1"});
//             new xWorker('m1_b1', spawn, {"type": "worker", "role": 'undertaker'});
//             break;
//         case 'sim1':
//             // First mine groupe
//             new xWorker('m1_w1', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('m1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m1_w1"});
//             // First guard group
//             new xGuard('g1_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xWorker('r1', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
//             // Second mine group
//             new xWorker('m2_w1', spawn, {"type": "worker", "role": 'miner',});
//             // Add healer to first group
//             new xGuard('g1_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
//             // Add carrier to mine 2
//             new xWorker('m2_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w2_m1"});
//             // Add new guard to g1
//             new xGuard('g1_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Undertaker
//             new xWorker('m1_b', spawn, {"type": "worker", "role": 'undertaker'});
//             // Third mine group
//             new xWorker('m3_w1', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('m3_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w3_m1"});
//             // Add new guard to g1
//             new xGuard('g1_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Second Guard group
//             // Undertaker
//             new xWorker('m2_b', spawn, {"type": "worker", "role": 'undertaker'});
//             new xGuard('g2_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Add a second recycler to mine 2
//             new xWorker('m2_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "w2_m1"});
//             // Add new recycler to mine 3
//             new xWorker('m3_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "w3_m1"});
//             // Add guard to second guard group
//             new xGuard('g2_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
//             new xGuard('g2_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Add guard to second guard group
//             new xWorker('b1', spawn, {"type": "worker", "role": 'builder', "flag": "Flag1"});
//             new xGuard('g2_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Third guard group
//             new xGuard('g3_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g3_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
//             new xWorker('r2', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
//             new xGuard('g3_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g3_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // First builder
//             new xWorker('b2', spawn, {"type": "worker", "role": 'builder', "flag": "Flag1"});
//             break;
//         case 'sim2':
//             // First mine groupe
//             new xWorker('m1_m', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('m1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m1_m"});
//             // First guard group
//             new xGuard('g1_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xWorker('r1', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
//             // Second mine group
//             new xWorker('m2_m', spawn, {"type": "worker", "role": 'miner',});
//             // Add healer to first group
//             new xGuard('g1_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag1"});
//             // Add carrier to mine 2
//             new xWorker('m2_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m2_m"});
//             // Add new guard to g1
//             new xGuard('g1_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Third mine group
//             new xWorker('m3_m', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('m3_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "m3_m"});
//             // Undertaker
//             new xWorker('m1_b', spawn, {"type": "worker", "role": 'undertaker'});
//             // Add new guard to g1
//             new xGuard('g1_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Second Guard group
//             new xGuard('g2_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Add a second recycler to mine 2
//             new xWorker('m2_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "m2_m"});
//             // Add new recycler to mine 3
//             new xWorker('m3_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "m3_m"});
//             // Add guard to second guard group
//             new xGuard('g2_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag1"});
//             new xGuard('g2_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g2_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Third guard group
//             new xGuard('g3_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g3_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag1"});
//             new xWorker('r2', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
//             new xGuard('g3_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g3_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             break;
//         case 'sim3':
//             // First mine groupe
//             new xWorker('w1_m1', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('w1_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w1_m1"});
//             // First guard group
//             new xGuard('g1_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xWorker('g1', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
//             // Second mine group
//             new xWorker('w2_m1', spawn, {"type": "worker", "role": 'miner',});
//             // Add healer to first group
//             new xGuard('g1_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
//             // Add carrier to mine 2
//             new xWorker('w2_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w2_m1"});
//             // Add new guard to g1
//             new xGuard('g1_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Third mine group
//             new xWorker('w3_m1', spawn, {"type": "worker", "role": 'miner'});
//             new xWorker('w3_c1', spawn, {"type": "worker", "role": 'carrier', "miner": "w3_m1"});
//             // Add new guard to g1
//             new xGuard('g1_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Second Guard group
//             new xGuard('g2_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Add a second recycler to mine 2
//             new xWorker('w2_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "w2_m1"});
//             // Add new recycler to mine 3
//             new xWorker('w3_c2', spawn, {"type": "worker", "role": 'carrier', "miner": "w3_m1"});
//             // Add guard to second guard group

//             new xGuard('g2_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
//             new xGuard('g2_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Add guard to second guard group
//             new xWorker('b1', spawn, {"type": "worker", "role": 'builder', "flag": "Flag1"});
//             new xGuard('g2_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // Third guard group
//             new xGuard('g3_l', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g3_h', spawn, {"type": "guard", "role": 'support', "flag": "Flag2"});
//             new xWorker('g4', spawn, {"type": "worker", "role": 'recycler', "flag": "Flag1"});
//             new xGuard('g3_m1', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             new xGuard('g3_m2', spawn, {"type": "guard", "role": 'mixed', "flag": "Flag1"});
//             // First builder
//             new xWorker('b2', spawn, {"type": "worker", "role": 'builder', "flag": "Flag1"});
//             break;
//     }
// };
