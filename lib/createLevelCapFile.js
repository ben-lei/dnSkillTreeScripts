var createLevelCapFile = function(levelCap) {
  print("Creating level cap json");
  write(config.output.level, 'level', {level: levelCap});
};