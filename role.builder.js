var repairThreshold = 100000;
var repairThresholdWalls = 500;
module.exports = {
  run: function(creep) {


    // if creep is bringing energy to the spawn but has no energy left
    if (creep.memory.state == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.state = false;
      creep.say('🔄 harvest');
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.state == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.state = true;
      creep.say('🚧 build');
    }

    // if creep is supposed to build
    if (creep.memory.state) {
      var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      if (target == undefined) {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: structure => structure.structureType == STRUCTURE_WALL && structure.hits < repairThresholdWalls
        });
      }
      if (target != undefined) {
        // try to transfer energy, if the spawn is not in range
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          // move towards the spawn
          creep.moveToCustom(target,3);
        }

      }
      //nothing to build -> go upgrade
      else {
        creep.upgradeCustom();
      }
    //get energy
    } else {
      creep.harvestCustom();
    }

  }
};
