var repairThreshold = 250000;
var repairThresholdWalls = 500;
module.exports = {
  run: function(creep) {
    //check state
    if (creep.memory.state == true && creep.carry.energy == 0) {
      creep.memory.state = false;
      creep.say('🔄 harvest');
    } else if (creep.memory.state == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.state = true;
      creep.say('🚧 repair');
    }

    //repair
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.hits < repairThreshold
    });
    if (target == undefined) {
      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure => structure.structureType == STRUCTURE_WALL && structure.hits < repairThresholdWalls
      });
    }
    if (creep.memory.state == true && target != undefined) {
      // try to transfer energy, if the spawn is not in range
      if (creep.repair(target) == ERR_NOT_IN_RANGE) {
        // move towards the spawn
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
      }

    } else if (creep.memory.state == true && target == undefined) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      } else if (creep.memory.state == true && target == undefined) {
        creep.upgradeCustom();
      }
    } else {
      creep.harvestCustom();
    }
  }

};
