module.exports = function() {
  StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName, roads = false) {
      var numberOfParts;
      var body = [];

      if (roads) {
        numberOfParts = Math.floor(energy / 350);
        for (let i = 0; i < numberOfParts; i++) {
          body.push(WORK);
          body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(CARRY);
          body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(MOVE);
        }
      } else {
        numberOfParts = Math.floor(energy / 200);
        for (let i = 0; i < numberOfParts; i++) {
          body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(MOVE);
        }
      }
      return this.createCreep(body, undefined, {
        role: roleName,
        state: false,
        cost: calculateBodyCost(body),
        home: this.room.name,
        roads: roads
      });
    }

  StructureSpawn.prototype.createLongDistanceHarvester =
    function(energy, numberOfWorkParts, home, source) {
      var body = [];
      for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
      }
      energy -= 150 * numberOfWorkParts;

      var numberOfParts = Math.floor(energy / 100);
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
        body.push(MOVE);
      }

      return this.createCreep(body, undefined, {
        role: 'longDistanceHarvester',
        home: home,
        sourceId: source[1],
        state: false,
        target: source[0],
        trip: 0,
        cost: calculateBodyCost(body),
        cargo: calculateCargo(body)
      });

    };

  StructureSpawn.prototype.createClaimer =
    function(target) {
      var body = [CLAIM, MOVE];
      return this.createCreep(body, undefined, {
        role: 'claimer',
        target: target,
        trip: 0,
      });
    }

  function calculateBodyCost(creepBody) {
    var result = 0;
    for (let bodyPart of creepBody) {
      result += BODYPART_COST[bodyPart];
    }
    return result;
  }

  function calculateCargo(creepBody) {
    var result = 0;
    for (let bodyPart of creepBody) {
      if (bodyPart == CARRY) {
        result += 50;
      }
    }
    return result;
  }
};
