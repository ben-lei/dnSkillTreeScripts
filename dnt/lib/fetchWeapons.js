/**
 * Fills out the weapon info
 *
 * @param connection the jdbc connection
 * @returns []
 */
function fetchWeapons(connection) {
  const startTime = System.currentTimeMillis();
  print("  fetchWeapons() - started");

  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(sqls['get-weapons.sql']);
  const weapons = [];

  while (rs.next()) {
    weapons[rs.getInt('_EquipType')] = rs.getInt('_NameID');
  }

  stmt.close();

  const durationTime = System.currentTimeMillis() - startTime;
  print("  fetchWeapons() - completed in ${durationTime} ms");
  return weapons;
}
