var GET_JOB_SKILLTREE_PREPARED = readFully("${CWD}/sql/get-job-skilltree.prepared.sql");

var fetchSkillTree = function (connection, job, ext) {
  print("Fetching skill tree of " + job.slug);

  var pstmt = connection.prepareStatement(GET_JOB_SKILLTREE_PREPARED);
  pstmt.setInt(1, job.jobs[0].id);
  pstmt.setInt(2, job.jobs[1].id);
  pstmt.setInt(3, job.jobs[2].id);

  var data = {
    slug: job.slug,
    jobs: job.jobs,
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
    var jobIndex = rs.getInt('_JobIndex'),
        treeSlotIndex = rs.getInt('_TreeSlotIndex'),
        base = rs.getInt('_BaseSkillID'),
        group = rs.getInt('_SkillGroup'),
        weapons = [rs.getInt('_NeedWeaponType1'), rs.getInt('_NeedWeaponType2')].filter(notNeg1),
        parents = [
          {id: rs.getInt('_ParentSkillID1'), level: rs.getInt('_NeedParentSkillLevel1')},
          {id: rs.getInt('_ParentSkillID2'), level: rs.getInt('_NeedParentSkillLevel2')},
          {id: rs.getInt('_ParentSkillID3'), level: rs.getInt('_NeedParentSkillLevel3')}
        ].filter(idNot0),
        alts = rs.getString('_ChangeSkill').split(';').filter(self).filter(not0).map(toInt),
        related = rs.getString('_TreeSkill').split(';').filter(self).filter(not0).map(toInt),
        skill = mapSkill(rs);

    if (base) {
      skill.base = base;
    }

    if (group) {
      skill.group = group;
    }

    if (weapons.length) {
      skill.weapons = weapons;
    }

    if (parents.length) {
      skill.need.parents = parents;
    }

    if (alts.length) {
      skill.alts = alts;
    }

    if (related.length) {
      skill.related = related;
    }

    skill.icon = rs.getInt('_IconImageIndex');

    skill.need.sp = [
      rs.getInt('_NeedBasicSP1'),
      rs.getInt('_NeedFirstSP1'),
      rs.getInt('_NeedSecondSP1')
    ];

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
    if (!data.tree[jobIndex]) {
      data.tree[jobIndex] = [];
      data.tree[jobIndex][23] = null; // auto-create 24 entries
    }

    data.tree[jobIndex][treeSlotIndex] = skill.id;
    data.messages.push(skill.name);
    data.skills[skill.id] = skill;
  }

  pstmt.close();

  skillIds = skillIds.concat(fillAltSkills(connection, job, data, altSkillIds));

  removeUnrelatedAltSkills(data.skills);
  fillSkillLevels(connection, job, data, skillIds);

  var crestData = fetchCrests(connection, job);

  data.crests = crestData.crests;
  data.messages = data.messages.concat(crestData.messages);
  data.messages = aggregateMessages(connection, data.messages);

  return data;
};