/**
 * Gets all the skill levels of the skill ids and fills it into the
 * data object.
 */

var GET_JOB_SKILLLEVEL_PREPARED = readFully("${CWD}/sql/get-job-skilllevel.prepared.sql");

var fillSkillLevels = function (connection, job, data, skillIds) {
  print("Filling up levels of skills for " + job.ascendancies[2].slug);

  var skillIdsStr = skillIds.join(','),
      query = GET_JOB_SKILLLEVEL_PREPARED.replace('?', skillIdsStr),
      stmt = connection.createStatement(),
      rs = stmt.executeQuery(query);

  while (rs.next()) {
    var skillId = rs.getInt('_SkillID'),
        apply = rs.getInt('_ApplyType'),
        level = rs.getInt('_SkillLevel'),
        params = rs.getString('_SkillExplanationIDParam'),
        paramsMessageIds = getParamMessageIds(params),
        skill = data.skills[skillId];

    skill.cd[apply][level] = rs.getInt('_DelayTime');
    skill.hp[apply][level] = rs.getInt('_DecreaseHP');
    skill.mp[apply][level] = rs.getInt('_DecreaseSP');
    skill.description[apply][level] = rs.getInt('_SkillExplanationID');
    skill.params[apply][level] = params;

    if (skill.sp) {
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
    }

    // add to messages
    data.messages.push(skill.description[apply][level]);

    paramsMessageIds.forEach(function (m) {
      data.messages.push(m);
    });
  }

  stmt.close();
};
