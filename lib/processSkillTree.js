var GET_JOB_SKILLTREE_PREPARED = readFully("${CWD}/sql/get-job-skilltree.prepared.sql");

var processSkillTree = function (connection, job, weapons) {
  print("Processing skill tree of " + job.slug);

  var pstmt = connection.prepareStatement(GET_JOB_SKILLTREE_PREPARED);
  pstmt.setInt(1, job.basic.id);
  pstmt.setInt(2, job.first.id);
  pstmt.setInt(3, job.id);

  var data = {
    job: job,
    tree: [],
    messages: [],
    skills: {},
    weapons: {}
  };

  var rs = pstmt.executeQuery();
  var skillIds = [];
  var altSkillIds = [];

  while (rs.next()) {
    var skill = mapSkill(rs);
    skill.iconIndex = rs.getInt('_IconImageIndex');
    skill.jobSp = [rs.getInt('_NeedBasicSP1'), rs.getInt('_NeedFirstSP1'), rs.getInt('_NeedSecondSP1')];
    skill.alts = rs.getString('_ChangeSkill').split(';').filter(self).map(toInt);
    skill.parents = [
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

    // add to list of alts to get
    skillIds.push(skill.id);
    if (skill.alts) {
      altSkillIds = altSkillIds.concat(skill.alts);
    }

    for (var weapType in skill.need.weapons) {
      if (!data.weapons[weapType]) {
        data.weapons[weapType] = weapons[weapType];
        data.messages.push(weapons[weapType]);
      }
    }

    data.messages.push(skill.nameId);
    data.skills[skill.id] = skill;
  }

  pstmt.close();

  skillIds = skillIds.concat(fillAltSkills(connection, job, data, altSkillIds));

  removeUnrelatedAltSkills(data.skills);
  fillSkillLevels(connection, data, skillIds);

  data.messages = aggregateMessages(connection, data.messages);

  return data;
};