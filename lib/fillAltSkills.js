/**
 * Finds all the alt skills and fills it into data object.
 * Returns the found skill ids.
 */

var GET_ALT_SKILLS_PREPARED = readFully("${CWD}/sql/get-alt-skills.prepared.sql");

var fillAltSkills = function (connection, job, data, altSkillIds) {
  var altSkillIdsStr = altSkillIds.join(',');
  var query = GET_ALT_SKILLS_PREPARED.replace('(?)', '(' + altSkillIdsStr + ')');

  var pstmt = connection.prepareStatement(query);
  pstmt.setInt(1, job.basic.id);
  pstmt.setInt(2, job.first.id);
  pstmt.setInt(3, job.id);

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