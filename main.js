// import modules
require('prototype.spawn')();
require('prototype.creep')();
const creepControl = require('creepControl');
const spawnControl = require('spawnControl');
const energyManagement = require('energyManagement');

module.exports.loop = function() {
  //activat energyManagement
  energyManagement.run();


  Game.rooms['E11S27'].memory.blockedForTransfer.forEach(e => Game.getObjectById(e).room.visual.text('❎',Game.getObjectById(e).pos.x,Game.getObjectById(e).pos.y));
  Game.rooms['E12S27'].memory.blockedForTransfer.forEach(e => Game.getObjectById(e).room.visual.text('❎',Game.getObjectById(e).pos.x,Game.getObjectById(e).pos.y));
  if(Game.time % 500 == 0){
    console.log('reset 500');
    Game.rooms['E11S27'].memory.blockedForTransfer = [];
    Game.rooms['E12S27'].memory.blockedForTransfer = [];
  }

  //Post decay ceep actions and memory deletion
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      try {
        console.log('Bye ' + Memory.creeps[name].role + ' ' + name + ' the swarm is greatful for your service');
        if (Memory.creeps[name].role == 'longDistanceHarvester') {
          var profit = Memory.creeps[name].trip * Memory.creeps[name].cargo - Memory.creeps[name].cost;
          console.log(Memory.creeps[name].trip + ' TRIPS ' + Memory.creeps[name].cargo + ' CARGO ' + Memory.creeps[name].cost + ' COST \n' + profit + " PROFIT");

        }
      } catch (err) {
        console.log('Error2021');
      }
      if (Memory.creeps[name].targetList && Memory.creeps[name].targetList.length > 0) {
        Memory.creeps[name].targetList.forEach(e => _.remove(Game.rooms[Memory.creeps[name].home].memory.blockedForTransfer, function(n) {
          return n.id == e;
        }));

      }

      delete Memory.creeps[name];
    }
  }
  // acivate spawnControl
  for (let name in Game.spawns) {
    var spawn = Game.spawns[name];
    spawnControl.run(spawn);

  }
  // activate creepControl
  for (let name in Game.creeps) {

    var creep = Game.creeps[name];
    creepControl.run(creep);

  }

  // activate tower
  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (let tower of towers) {
    var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target != undefined) {
      tower.attack(target);
    }
  }


};
