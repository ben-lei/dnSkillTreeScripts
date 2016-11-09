/**
 * Fills out the weapon info
 */

var GET_CRESTS = readFully("${CWD}/sql/get-crests.sql");

var fetchCrests = function (connection) {
  print("Fetching all crests.");
  print();

  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_CRESTS);
  var crests = [];

  while (rs.next()) {
    var skillId = rs.getString('_SkillID').split(';')[0];
    crests[skillId] = {
      description: rs.getInt('_SummaryDescription'),
      params: rs.getString('_SummaryDescriptionParam')
    };
  }

  return crests;
};
