module.exports = {
  run: function(spawn) {

    //Jeder 10. Tick
    if (Game.time % 10 === 0) {

      var currentEnergy = spawn.room.energyAvailable;
      var maxEnergy = spawn.room.energyCapacityAvailable;
      var reduceFactor = 1;

      var energyForCreep = maxEnergy * reduceFactor;
      var newCreep;

      //New Creep generated only when Energy at 100%
      if (currentEnergy >= energyForCreep) {
        var creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
        var harvester = _.filter(creepsInRoom, (creep) => creep.memory.role == 'harvester' && creep.room == spawn.room);
        var upgrader = _.filter(creepsInRoom, (creep) => creep.memory.role == 'upgrader' && creep.room == spawn.room);
        var builder = _.filter(creepsInRoom, (creep) => creep.memory.role == 'builder' && creep.room == spawn.room);
        var repair = _.filter(creepsInRoom, (creep) => creep.memory.role == 'repair' && creep.room == spawn.room);
        var wallRepair = _.filter(creepsInRoom, (creep) => creep.memory.role == 'wallRepair' && creep.room == spawn.room);
        var longDistanceHarvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.home == spawn.room.name);

        //default values
        var minHarvester = 1;
        var minUpgrader = 1;
        var minBuilder = 1;
        var minRepair = 0;
        var minWallRepair = 0;
        var roads = false;

        //room values
        if (spawn.room.memory.minNumbers.minHarvester != undefined) {
          minHarvester = spawn.room.memory.minNumbers.minHarvester;
        }
        if (spawn.room.memory.minNumbers.minUpgrader != undefined) {
          minUpgrader = spawn.room.memory.minNumbers.minUpgrader;
        }
        if (spawn.room.memory.minNumbers.minBuilder != undefined) {
          minBuilder = spawn.room.memory.minNumbers.minBuilder;
        }
        if (spawn.room.memory.minNumbers.minRepair != undefined) {
          minRepair = spawn.room.memory.minNumbers.minRepair;
        }
        if (spawn.room.memory.minNumbers.minWallRepair != undefined) {
          minWallRepair = spawn.room.memory.minNumbers.minWallRepair;
        }
        if (spawn.room.memory.roads != undefined) {
          roads = spawn.room.roads;
        }

        if (harvester.length < minHarvester) {
          newCreep = spawn.createCustomCreep(energyForCreep, 'harvester', roads);
        } else if (spawn.room.memory.claim != undefined) {
          newCreep = spawn.createClaimer(spawn.room.memory.claim);
          if (newCreep != undefined) {
            delete spawn.room.memory.claim;
          }

        } else if (upgrader.length < minUpgrader) {
          newCreep = spawn.createCustomCreep(energyForCreep, 'upgrader', roads);
        } else if (builder.length < minBuilder && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
          newCreep = spawn.createCustomCreep(energyForCreep, 'builder', roads);
        } else if (repair.length < minRepair) {
          newCreep = spawn.createCustomCreep(energyForCreep, 'repair', roads);
        } else if (longDistanceHarvester && spawn.room.memory.ldhSources && longDistanceHarvester.length < spawn.room.memory.ldhSources.length) {
          try {
            var match = false;
            for (let source of spawn.room.memory.ldhSources) {
              match = false;
              for (let name of longDistanceHarvester) {
                if (name.memory.sourceId == source[1]) {
                  match = true;
                  break;
                }
              }
              if (match == false) {
                newCreep = spawn.createLongDistanceHarvester(energyForCreep, 3, spawn.room.name, source);
                break;
              }
            }
          } catch (err) {
            console.log(err);
          }
        } else if (wallRepair.length < minWallRepair) {
          newCreep = spawn.createCustomCreep(energyForCreep * 0.75, 'wallRepair');
        }


        // display message when new creep in pipeline
        if (newCreep != undefined) {
          try {
            console.log(spawn.name + " Welcome to the swarm " + newCreep);
          } catch (err) {
            console.log('Error2020');
          }
        }


      }

      //Fallback creep
      else if (Game.time % 100 === 0) {
        var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if (harvester.length == 0) {
          newCreep = spawn.createCustomCreep(currentEnergy, 'harvester');
          //Game.notify('Fallbackplan Alpha initiatet.\n The swarm in room '+ spawn.room.name + ' has only ' + currentEnergy + ' available! and no harvester. \n Emergency harvester created.')
        }
      }
    }

    //display message spawner
    if (spawn.spawning) {
      var spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y, {
          align: 'left',
          opacity: 0.8
        });
    }
  }
};
