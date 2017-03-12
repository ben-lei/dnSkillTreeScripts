/**
 * Fills out the weapon info
 *
 * @param connection the jdbc connection
 * @returns []
 */
function fetchTechableSkills(connection) {
  const startTime = System.currentTimeMillis();
  print("  fetchTechableSkills() - started");

  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(sqls['get-techable-skills.sql']);
  const techs = [];

  while (rs.next()) {
    const id = rs.getInt('_SkillID');
    const type = rs.getInt('_ExchangeType');
    const level = rs.getInt('_LevelLimit');
    const data = { type: type, level: level };
    techs[id] = techs[id] ? techs[id].concat(data) : [data];
  }

  stmt.close();

  const durationTime = System.currentTimeMillis() - startTime;
  print("  fetchTechableSkills() - completed in ${durationTime} ms\n");
  return techs;
}
