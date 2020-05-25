var roleUpgrader = require('role.upgrader');
var roleLongDistanceHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {

    //state switch -> empty -> go to room and harvest
    if (creep.memory.state && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.state = false;
      creep.memory.trip += 1;
      creep.say('🚚LDH #' + creep.memory.trip);

    }
    //state switch -> full -> go to room and harvest
    if (!creep.memory.state && creep.store.getFreeCapacity() == 0) {
      creep.memory.state = true;
      creep.say('🚚ldh->home');
    }

    if (!creep.memory.state) {
      //harvest at target
      if (creep.room.name == creep.memory.target) {
        var source = Game.getObjectById(creep.memory.sourceId);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {
            visualizePathStyle: {
              stroke: '#ffaa00'
            }
          });
        }



      }
      //move to target room
      else {
        creep.moveToRoom(creep.memory.target);
      }
    } else {
      if (creep.room.name == creep.memory.home) {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == structure.structureType == STRUCTURE_CONTAINER &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          }
        });

        if (targets.length < 1) {
          targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }

          });
        }
        if (targets.length > 0) {

          if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });

          }
        } else {
          roleUpgrader.run(creep);
        }
      } else {
        creep.moveToRoom(creep.memory.home);
      }
    }
  }
};

module.exports = roleLongDistanceHarvester;
