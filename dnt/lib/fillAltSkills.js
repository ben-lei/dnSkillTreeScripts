/**
 * Finds all the alt skills and fills it into data object.
 * Returns the found skill ids.
 */

var GET_ALT_SKILLS_PREPARED = readFully("${CWD}/sql/get-alt-skills.prepared.sql");

var fillAltSkills = function (connection, job, data, altSkillIds) {
  print("Filling alt skills for " + job.ascendancies[2].slug);

  var altSkillIdsStr = altSkillIds.join(','),
      query = GET_ALT_SKILLS_PREPARED.replace('(?)', '(' + altSkillIdsStr + ')'),
      pstmt = connection.prepareStatement(query);

  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  var rs = pstmt.executeQuery(),
      skillIds = [];

  while (rs.next()) {
    var skill = mapSkill(rs);

    data.messages.push(skill.name);
    data.skills[skill.id] = skill;

    skillIds.push(skill.id);
  }

  pstmt.close();

  return skillIds;
};