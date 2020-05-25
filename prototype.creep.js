module.exports = function() {

  Creep.prototype.moveToRoom = function(room) {
    var exit = this.room.findExitTo(room);
    return this.moveTo(this.pos.findClosestByRange(exit), {
      visualizePathStyle: {
        stroke: '#9966CC'
      }
    });
  }

  Creep.prototype.transferCustom = function() {
    if (!this.memory.targetList) {
      this.memory.targetList = [];
    }
    var targetList = this.memory.targetList;

    if (targetList.length <= 0) {
      let remainingEnergy = this.store[RESOURCE_ENERGY];
      let position = this.pos;

      while (remainingEnergy > 0) {

        let newTarget = position.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && structure.room.memory.blockedForTransfer != undefined && structure.room.memory.blockedForTransfer.includes(structure.id) == false;
          }
        });
        if (newTarget) {
          targetList.push(newTarget.id);
          position = newTarget.pos;
          remainingEnergy -= newTarget.store.getFreeCapacity(RESOURCE_ENERGY);
          this.room.memory.blockedForTransfer.push(newTarget.id);
        } else {
          break;
        }
      }
      if (targetList.length <= 0) {
        this.upgradeCustom();
      }
    } else {
      var target = Game.getObjectById(targetList[0]);
      if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
          visualizePathStyle: {
            stroke: '#4c4cff'
          }
        });
      } else if (this.transfer(target, RESOURCE_ENERGY) == ERR_FULL || this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
        this.say('DEL OK');
        let remove = this.memory.targetList[0];
        _.remove(this.room.memory.blockedForTransfer, function(n) {
          return n == remove;
        });
        this.memory.targetList.shift();
      }
    }
  }

  Creep.prototype.upgradeCustom = function() {
    if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveToCustom(this.room.controller, 3);
    }
  }

  Creep.prototype.harvestCustom = function() {
    var sources = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (this.harvest(sources) == ERR_NOT_IN_RANGE) {
      this.moveTo(sources, {
        visualizePathStyle: {
          stroke: '#00b100'
        }
      });
    }
  }

  Creep.prototype.moveToCustom = function(target, range) {
    let goal = {
      pos: target.pos,
      range: range
    };
    let plain = 1;
    let swamp = 5;
    if (this.memory.roads && this.memory.roads == true) {
      plain = 2;
      swamp = 10;
    }
    let ret = PathFinder.search(this.pos, goal, {
      // We need to set the defaults costs higher so that we
      // can set the road cost lower in `roomCallback`
      plainCost: plain,
      swampCost: swamp,

      roomCallback: function(roomName) {

        let room = Game.rooms[roomName];
        // In this example `room` will always exist, but since
        // PathFinder supports searches which span multiple rooms
        // you should be careful!
        if (!room) return;
        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function(struct) {
          if (struct.structureType === STRUCTURE_ROAD) {
            // Favor roads over plain tiles
            costs.set(struct.pos.x, struct.pos.y, 1);
          } else if (struct.structureType !== STRUCTURE_CONTAINER &&
            (struct.structureType !== STRUCTURE_RAMPART ||
              !struct.my)) {
            // Can't walk through non-walkable buildings
            costs.set(struct.pos.x, struct.pos.y, 0xff);
          }
        });

        // Avoid creeps in the room
        room.find(FIND_CREEPS).forEach(function(creep) {
          costs.set(creep.pos.x, creep.pos.y, 0xff);
        });

        return costs;
      },
    })
    this.say(ret.cost);
    this.room.visual.poly(ret.path, {
      fill: 'transparent',
      stroke: '#fff',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
    });
    let pos = ret.path[0];

    this.move(this.pos.getDirectionTo(pos));
  }


}
