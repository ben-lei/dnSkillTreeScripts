/**
 * Creates level cap file
 *
 * @param levelCap the level cap
 */
function createLevelCapFile(levelCap) {
  print('Creating level cap json');

  var file = new File(config.output.level);

  write(file.getParentFile().getAbsolutePath(), file.getName(), "${levelCap}");
}