/**
 * Finds all the alt skills and fills it into data object.
 * Returns the found skill ids.
 */

var GET_ALT_SKILLS_PREPARED = readFully("${CWD}/sql/get-alt-skills.prepared.sql");

var fillAltSkills = function (connection, job, data, altSkillIds) {
  print("Filling alt skills for " + job.slug);

  var altSkillIdsStr = altSkillIds.join(',');
  var query = GET_ALT_SKILLS_PREPARED.replace('(?)', '(' + altSkillIdsStr + ')');

  var pstmt = connection.prepareStatement(query);
  pstmt.setInt(1, job.jobs[0].id);
  pstmt.setInt(2, job.jobs[1].id);
  pstmt.setInt(3, job.jobs[2].id);

  var rs = pstmt.executeQuery();

  var skillIds = [];

  while (rs.next()) {
    var skill = mapSkill(rs);

    data.messages.push(skill.nameId);
    data.skills[skill.id] = skill;

    skillIds.push(skill.id);
  }

  pstmt.close();

  return skillIds;
};