/**
 * Fills out the weapon info
 *
 * @param connection the jdbc connection
 * @returns []
 */
function fetchWeapons(connection) {
  print('Fetching all weapons.');
  print();

  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(sqls['get-weapons.sql']);
  const weapons = [];

  while (rs.next()) {
    weapons[rs.getInt('_EquipType')] = rs.getInt('_NameID');
  }

  stmt.close();

  return weapons;
}
