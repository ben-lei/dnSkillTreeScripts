/**
 * Fills out the weapon info
 */

var GET_WEAPON_LIST = readFully("${CWD}/sql/get-weapons.sql");

var fetchWeapons = function (connection) {
  print("Fetching all weapons.");
  print();

  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_WEAPON_LIST);
  var weapons = [];

  while (rs.next()) {
    weapons[rs.getInt('_EquipType')] = rs.getInt('ID');
  }

  return weapons;
};
