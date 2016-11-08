var GET_JOB_SKILLTREE_PREPARED = readFully("${CWD}/sql/get-job-skilltree.prepared.sql");

var processSkillTree = function (connection, job) {
  var pstmt = connection.prepareStatement(GET_JOB_SKILLTREE_PREPARED);
  pstmt.setInt(1, job.basic.id);
  pstmt.setInt(2, job.first.id);
  pstmt.setInt(3, job.id);

  var data = {
    job: job,
    tree: [],
    messages: [],
    skills: {}
  };

  var rs = pstmt.executeQuery();
  var skillIds = [];
  var altSkillIds = [];

  while (rs.next()) {
    var skill = mapSkill(rs);
    skill.iconIndex = rs.getInt('_IconImageIndex');
    skill.jobSp = [rs.getInt('_NeedBasicSP1'), rs.getInt('_NeedFirstSP1'), rs.getInt('_NeedSecondSP1')];
    skill.weapons = [rs.getInt('_NeedWeaponType1'), rs.getInt('_NeedWeaponType2')].filter(notNeg1);
    skill.alts = rs.getString('_ChangeSkill').split(';').filter(self).map(toInt);
    skill.skills = [
      {id: rs.getInt('_ParentSkillID1'), level: rs.getInt('_NeedParentSkillLevel1')},
      {id: rs.getInt('_ParentSkillID2'), level: rs.getInt('_NeedParentSkillLevel2')},
      {id: rs.getInt('_ParentSkillID3'), level: rs.getInt('_NeedParentSkillLevel3')}
    ].filter(idNot0);


    var jobNumber = rs.getInt('_JobNumber'),
        treeSlotIndex = rs.getInt('_TreeSlotIndex');

    if (!data.tree[jobNumber]) {
      data.tree[jobNumber] = [];
      data.tree[jobNumber][23] = null; // auto-create 24 entries
    }

    data.tree[jobNumber][treeSlotIndex] = skill.id;

    skillIds.push(skill.id);
    if (skill.alts) {
      altSkillIds = altSkillIds.concat(skill.alts);
    }

    data.messages.push(skill.nameId);
    data.skills[skill.id] = skill;
  }

  pstmt.close();

  skillIds = skillIds.concat(fillAltSkills(connection, job, data, altSkillIds));

  fillSkillLevels(connection, data, skillIds);

  data.messages = aggregateMessages(connection, data.messages);

  return data;
};