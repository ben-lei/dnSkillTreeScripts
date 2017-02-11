var GET_JOB_SKILLTREE_PREPARED = readFully("${CWD}/sql/get-job-skilltree.prepared.sql");

var fetchSkillTree = function (connection, job, ext) {
  print("Fetching skill tree of " + job.ascendancies[2].slug);

  var pstmt = connection.prepareStatement(GET_JOB_SKILLTREE_PREPARED);
  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

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

    skill.maxLevel = rs.getInt('_MaxLevel');
    skill.spMaxLevel = rs.getInt('_SPMaxLevel');
    skill.job = rs.getInt('_JobNumber');
    skill.levelReq = [];
    skill.sp = [];
    skill.spTotal = [];

    skill.ascendancies = [];

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
      skill.parents = parents;
    }

    if (alts.length) {
      skill.alts = alts;
    }

    if (related.length) {
      skill.related = related;
    }

    // skill.slot = treeSlotIndex;
    skill.jobIndex = jobIndex;
    skill.index = (jobIndex * 24) + treeSlotIndex;

    skill.icon = rs.getInt('_IconImageIndex');

    skill.ascendancies = [
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
    for (var type in weapons) {
      type = weapons[type];
      if (!job.weapons[type]) {
        job.weapons[type] = ext.weapons[type];
        job.messages.push(ext.weapons[type]);
      }
    }

    // setup skill tree
    if (!job.tree[jobIndex]) {
      job.tree[jobIndex] = [];
      job.tree[jobIndex][23] = null; // auto-create 24 entries
    }

    job.tree[jobIndex][treeSlotIndex] = skill.id;
    job.messages.push(skill.name);
    job.skills[skill.id] = skill;
  }

  pstmt.close();

  skillIds = skillIds.concat(fillAltSkills(connection, job, job, altSkillIds));

  removeUnrelatedSkills(job.skills, 'related');
  removeUnrelatedSkills(job.skills, 'alts');

  fillSkillLevels(connection, job, job, skillIds);

  var crestData = fetchCrests(connection, job);

  job.crests = crestData.crests;
  job.messages = job.messages.concat(crestData.messages);
  job.messages = aggregateMessages(connection, job.messages);

  // remove useless duplicate text from crests
  for (var i in crestData.messages) {
    var messageId = crestData.messages[i];
    var message = job.messages[messageId];
    var lastIndex = message.lastIndexOf('\\n\\n');
    if (lastIndex !== -1) {
      job.messages[messageId] = message.substring(lastIndex + 4);
    }
  }
};