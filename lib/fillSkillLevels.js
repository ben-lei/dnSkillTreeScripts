/**
 * Gets all the skill levels of the skill ids and fills it into the
 * data object.
 */

var GET_JOB_SKILLLEVEL_PREPARED = readFully("${CWD}/sql/get-job-skilllevel.prepared.sql");

var fillSkillLevels = function (connection, data, skillIds) {
  var skillIdsStr = skillIds.join(',');
  var query = GET_JOB_SKILLLEVEL_PREPARED.replace('?', skillIdsStr);
  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(query);

  while (rs.next()) {
    var skillId = rs.getInt('_SkillID');
    var apply = rs.getInt('_ApplyType');
    var level = rs.getInt('_SkillLevel');
    var params = rs.getString('_SkillExplanationIDParam');
    var paramsMessageIds = getParamMessageIds(params);

    var skill = data.skills[skillId];

    skill.cd[apply][level] = rs.getInt('_DelayTime');
    skill.hp[apply][level] = rs.getInt('_DecreaseHP');
    skill.mp[apply][level] = rs.getInt('_DecreaseSP');
    skill.description[apply][level] = rs.getInt('_SkillExplanationID');
    skill.params[apply][level] = 1;

    // level stuff
    if (!apply) { // pve
      skill.sp[level] = rs.getInt('_NeedSkillPoint');
      skill.levelReq[level] = rs.getInt('_LevelLimit');

      if (level) {
        skill.spTotal[level] = skill.spTotal[level - 1] + skill.sp[level];
      } else {
        skill.spTotal[level] = skill.sp[level];
      }
    }

    // add to messages
    data.messages.push(skill.description[apply][level]);
    paramsMessageIds.forEach(function (m) {
      data.messages.push(m);
    });
  }

  stmt.close();
};
