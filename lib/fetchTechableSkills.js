/**
 * Fills out the weapon info
 */

var GET_TECHS = readFully("${CWD}/sql/get-techable-skills.sql");

var fetchTechableSkills = function (connection) {
  print("Fetching all techable skills.");
  print();

  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_TECHS);
  var techs = [];

  while (rs.next()) {
    var id = rs.getInt('_SkillID');
    var type = rs.getInt('_ExchangeType');
    techs[id] = techs[id] ? techs[id].concat(type) : [type];
  }

  return techs;
};
