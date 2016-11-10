var GET_JOB_SKILLTREE_PREPARED = readFully("${CWD}/sql/get-job-skilltree.prepared.sql");

var fetchSkillTree = function (connection, job, ext) {
  print("Fetching skill tree of " + job.slug);

  var pstmt = connection.prepareStatement(GET_JOB_SKILLTREE_PREPARED);
  pstmt.setInt(1, job.basic.id);
  pstmt.setInt(2, job.first.id);
  pstmt.setInt(3, job.id);

  var data = {
    job: job,
    tree: [],
    messages: [],
    skills: {},
    weapons: {},
    crests: {}
  };

  var rs = pstmt.executeQuery(),
      skillIds = [],
      altSkillIds = [];

  while (rs.next()) {
    var jobNumber = rs.getInt('_JobNumber'),
        treeSlotIndex = rs.getInt('_TreeSlotIndex'),
        skill = mapSkill(rs);

    skill.icon = rs.getInt('_IconImageIndex');
    skill.jobSp = [rs.getInt('_NeedBasicSP1'), rs.getInt('_NeedFirstSP1'), rs.getInt('_NeedSecondSP1')];
    skill.alts = rs.getString('_ChangeSkill').split(';').filter(self).map(toInt);
    skill.parents = [
      {id: rs.getInt('_ParentSkillID1'), level: rs.getInt('_NeedParentSkillLevel1')},
      {id: rs.getInt('_ParentSkillID2'), level: rs.getInt('_NeedParentSkillLevel2')},
      {id: rs.getInt('_ParentSkillID3'), level: rs.getInt('_NeedParentSkillLevel3')}
    ].filter(idNot0);

    // add available techs of skill
    if (ext.techs[skill.id]) {
      skill.techs = ext.techs[skill.id];
    }

    // add to list of alts to get
    skillIds.push(skill.id);
    if (skill.alts) {
      altSkillIds = altSkillIds.concat(skill.alts);
    }

    // add weapons for this job
    for (var type in skill.need.weapons) {
      if (!data.weapons[type]) {
        data.weapons[type] = ext.weapons[type];
        data.messages.push(ext.weapons[type]);
      }
    }

    // setup skill tree
    if (!data.tree[jobNumber]) {
      data.tree[jobNumber] = [];
      data.tree[jobNumber][23] = null; // auto-create 24 entries
    }

    data.tree[jobNumber][treeSlotIndex] = skill.id;
    data.messages.push(skill.name);
    data.skills[skill.id] = skill;
  }

  pstmt.close();

  skillIds = skillIds.concat(fillAltSkills(connection, job, data, altSkillIds));

  removeUnrelatedAltSkills(data.skills);
  fillSkillLevels(connection, data, skillIds);

  var crestData = fetchCrests(connection, job);

  data.crests = crestData.crests;
  data.messages = data.messages.concat(crestData.messageIds);
  data.messages = aggregateMessages(connection, data.messages);

  return data;
};