var roleClaimer = {
  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.room.name == creep.memory.target) {
      var controller = creep.room.controller;
      if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }


    } else {
      var exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit), {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
    }
  }
};

module.exports = roleClaimer;
