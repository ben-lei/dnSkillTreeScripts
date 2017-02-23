/**
 * Creates level cap file
 *
 * @param levelCap the level cap
 */
function createLevelCapFile(levelCap) {
  print('Creating level cap json');
  write(config.output.level, 'level', { level: levelCap });
}