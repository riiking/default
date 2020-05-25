var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {


      //state check harvest
      if (creep.memory.state && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = false;
        creep.say('🔄 harvest');
      }

      //state check upgrade
      if (!creep.memory.state && creep.store.getFreeCapacity() == 0) {
        creep.memory.state = true;
        creep.say('⚡ upgrade');
      }

      //upgrade
      if (creep.memory.state) {
        creep.upgradeCustom();
      } else {
        //check for Container
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (s) => {
            return s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity();
          }
        });
        if (targets[0] != undefined) {
          if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: {
                stroke: '#ffaa00'
              }
            });
          }
        }
        //harvest
        else {
          creep.harvestCustom();
        }
      }

  }
};
module.exports = roleUpgrader;
