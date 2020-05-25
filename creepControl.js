module.exports = {
  run: function(creep) {
    const roleHarvester = require('role.harvester');
    const roleUpgrader = require('role.upgrader');
    const roleBuilder = require('role.builder');
    const roleRepair = require('role.repair');
    const roleWallRepair = require('role.wallRepair');
    const roleLongDistanceHarvester = require('role.longDistanceHarvester');
    const roleClaimer = require('role.claimer');

    //define roles that are not bound to one room
    let multiRoomRoles = ['longDistanceHarvester', 'claimer'];

    if (!creep.spawing) {
      if (creep.ticksToLive % 10 == 0 && creep.ticksToLive < 100) {
        creep.say('💀in ' + creep.ticksToLive);
      }

      if (!multiRoomRoles.includes(creep.memory.role)) {
        //room check
        let target = creep.memory.target;
        if (target != undefined && creep.room.name != target) {
          creep.moveToRoom(target);
        } else {
          runRole();
        }

        //multiroomRoles
      } else {
        runRole();
      }

      runRole();

      //funtion to activate role behavior
      function runRole() {
        switch (creep.memory.role) {
          case 'harvester':
            roleHarvester.run(creep);
            break;
          case 'upgrader':
            roleUpgrader.run(creep);
            break;
          case 'builder':
            roleBuilder.run(creep);
            break;
          case 'repair':
            roleRepair.run(creep);
            break;
          case 'wallRepair':
            roleWallRepair.run(creep);
            break;
          case 'longDistanceHarvester':
            roleLongDistanceHarvester.run(creep);
            break;
          case 'claimer':
            roleClaimer.run(creep);
            break
        }
      }
    }
  }
};
