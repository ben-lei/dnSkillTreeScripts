/**
 * Creates level cap file
 *
 * @param levelCap the level cap
 */
function createLevelCapFile(levelCap) {
  const startTime = System.currentTimeMillis();
  print("createLevelCapFile(${levelCap}) - started");

  var file = new File(config.output.level);

  write(file.getParentFile().getAbsolutePath(), file.getName(), "${levelCap}");

  const durationTime = System.currentTimeMillis() - startTime;
  print("createLevelCapFile(${levelCap}) - completed in ${durationTime} ms\n");
}