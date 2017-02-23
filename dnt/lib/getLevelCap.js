/**
 * Attempts to get the level cap based on the last reward
 * chest given for leveling up.
 *
 * @param connection the jdbc connection
 * @returns the potential level cap
 */
function getLevelCap(connection) {
  print('Getting (possible) level cap');

  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(sqls['get-level-cap.sql']);

  if (!rs.next()) {
    stmt.close();
    throw 'No level cap was found...';
  }

  const cap = rs.getInt('_LevelLimit');
  stmt.close();

  print("Level cap seems to be: ${cap}\n");
  return cap;
}