var roleBuilder = require('role.builder');
var repairThreshold = 100000;
var repairThresholdWalls = 500;
module.exports = {
  run: function(creep) {

    //check states
    if (creep.memory.state == true && creep.carry.energy == 0) {
      creep.memory.state = false;
      creep.say('🔄 harvest');
    } else if (creep.memory.state == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.state = true;
      creep.say('🏰Worktime');
    }

    // repair
    if (creep.memory.state) {
      var walls = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_WALL
      });

      var target = undefined;

      // loop with increasing percentages
      for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001) {
        // find a wall with less than percentage hits
        for (let wall of walls) {
          if (wall.hits / wall.hitsMax < percentage) {
            target = wall;
            break;
          }
        }

        // if there is one
        if (target != undefined) {
          // break the loop
          break;
        }
      }

      // if we find a wall that has to be repaired
      if (target != undefined) {
        creep.room.visual.text('🔧', target.pos.x, target.pos.y);
        // try to repair it, if not in range
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveToCustom(target, 3);
        }
      }
      //fallback if no walls found
      else {
        roleBuilder.run(creep);
      }
    }

    //get energy
    else {
      //#1 dropped energy
      target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (s) => {
          s.resourceType == RESOURCE_ENERGY && s.amount >= (creep.store.getCapacity() * 0.25)
        }
      });
      //#2 tombstones
      if (target == undefined) {
        target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
          filter: (s) => {
            return s.store.getUsedCapacity(RESOURCE_ENERGY) >= (creep.store.getCapacity() * 0.25)
          }
        });
      }

      //target found
      if (target != undefined) {
        creep.room.visual.text('👣', target.pos.x, target.pos.y);
        //check if not tombestone
        if (target.creep == undefined) {
          if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
          }

        } else {
          if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
          }
        }

      } else {
        creep.harvestCustom();
      }
    }

  }
};
