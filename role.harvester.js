var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {



    //state check
    if (creep.memory.state && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.state = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.state && creep.store.getFreeCapacity() == 0) {
      creep.memory.state = true;
      creep.say('⭐️transfer');
    }

    //state harvest
    if (!creep.memory.state) {
      creep.harvestCustom();
    }

    //state transfer
    else {
      creep.transferCustom();
    }

  }
};

module.exports = roleHarvester;
