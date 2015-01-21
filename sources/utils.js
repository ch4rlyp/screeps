/**
 * Utilitary functions
 */
var _ = require('lodash');

var base = Game.spawns[Memory.base];

exports.getSourceById = function(source_id) {
    return _.findLast(base.room.find(Game.SOURCES), function(object) {
        return object.id === source_id;
    });
};

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
