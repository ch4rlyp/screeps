/**
 * Utilitary functions
 */
var _ = require('lodash');

var base = Game.spawns[Memory.base];

exports.listAvailableSourceId = function() {
    var allSourceIdList = [];
    _(base.room.find(Game.SOURCES)).forEach(function(object) {
        allSourceIdList.push(object.id);
    });

    var busySourceIdList = [];
    _(Memory.sources).forEach(function(object) {
        busySourceIdList.push(object.id);
    });

    return _.difference(allSourceIdList, busySourceIdList);
};

exports.findNearestDamagedStructure = function(pos) {
    return pos.findNearest(Game.STRUCTURES, {
        filter: function(object) {
            return object.hits < object.hitsMax * 0.8;
        }
    });
};

exports.getBodyPartCost = function(part) {
    var bodyPartCosts = {
        'move': 50,
        'work': 20,
        'carry': 50,
        'attack': 100,
        'ranged_attack': 150,
        'heal': 200,
        'tough': 5
    };
    return bodyPartCosts[part];
};

exports.getOppositeDirection = function(direction) {
    //direction value is between 1 and 8
    var i = 0;
    var oppositeDirection = direction;
    for (i = 0; i < 4; i++) {
        if (oppositeDirection === 8) {
            oppositeDirection = 1;
        } else {
            oppositeDirection++;
        }
    }
    return oppositeDirection;
};

exports.getRange = function(pos_a, pos_b) {
    var range = Math.sqrt(
        Math.pow((pos_b.x - pos_a.x), 2) + Math.pow((pos_b.y - pos_a.y), 2)
    );
    return Math.floor(range);
};

// Game.TOP => 1
// Game.TOP_RIGHT => 2
// Game.RIGHT => 3
// Game.BOTTOM_RIGHT => 4
// Game.BOTTOM => 5
// Game.BOTTOM_LEFT => 6
// Game.LEFT => 7
// Game.TOP_LEFT => 8
