/**
 * Gets all the skill levels of the skill ids and fills it into the
 * data object.
 *
 * @param connection the jdbc connection
 * @param job the job object
 * @param data the skilltree's data
 * @param skillIds the list of skill ids to look up
 */
function fillSkillLevels(connection, job, data, skillIds) {
  const startTime = System.currentTimeMillis();
  print("    fillSkillLevels(${job.ascendancies[2].slug}) - started");

  const skillIdsStr = skillIds.join(',');
  const query = sqls['get-job-skilllevel.prepared.sql'].replace('?', skillIdsStr);
  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(query);

  while (rs.next()) {
    const skillId = rs.getInt('_SkillID');
    const apply = rs.getInt('_ApplyType');
    const level = rs.getInt('_SkillLevel');
    const params = rs.getString('_SkillExplanationIDParam');
    const paramsMessageIds = getParamMessageIds(params);
    const skill = data.skills[skillId];

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

  const durationTime = System.currentTimeMillis() - startTime;
  print("    fillSkillLevels(${job.ascendancies[2].slug}) - completed in ${durationTime} ms");
}
