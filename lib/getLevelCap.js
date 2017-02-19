var GET_LEVEL_CAP = readFully("${CWD}/sql/get-level-cap.sql");

var getLevelCap = function (connection) {
  print("Getting (possible) level cap");

  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_LEVEL_CAP);

  if (!rs.next()) {
    stmt.close();
    throw "No level cap was found...";
  }

  var cap = rs.getInt('_LevelLimit');
  stmt.close();

  print("Level cap seems to be: " + cap + "\n");
  return cap;
};