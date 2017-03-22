/**
 * Fetches skill tree data
 * @param connection the jdbc connection
 * @param job the job object
 * @param ext the additional information for job (techs, crests)
 */
function fetchSkillTree(connection, job, ext) {
  const startTime = System.currentTimeMillis();
  print("  fetchSkillTree(${job.ascendancies[2].slug}) - started");

  const pstmt = connection.prepareStatement(sqls['get-job-skilltree.prepared.sql']);
  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  const rs = pstmt.executeQuery();

  let skillIds = [];

  while (rs.next()) {
    const jobIndex = rs.getInt('_JobIndex');
    const treeSlotIndex = rs.getInt('_TreeSlotIndex');
    const base = rs.getInt('_BaseSkillID');
    const group = rs.getInt('_SkillGroup');
    const parents = [
      { id: rs.getInt('_ParentSkillID1'), level: rs.getInt('_NeedParentSkillLevel1') },
      { id: rs.getInt('_ParentSkillID2'), level: rs.getInt('_NeedParentSkillLevel2') },
      { id: rs.getInt('_ParentSkillID3'), level: rs.getInt('_NeedParentSkillLevel3') },
    ].filter(idNot0);
    const alts = rs.getString('_ChangeSkill').split(';').filter(self).filter(not0).map(toInt);
    const related = rs.getString('_TreeSkill').split(';').filter(self).filter(not0).map(toInt);
    const skill = mapSkill(rs, job, ext);

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

    const subId = rs.getInt('_SubSkillTableID');
    if (subId) {
      skill.sub = subId;
      skill.subReq = rs.getInt('_SkillConditionID');
    }

    // add to list of alts to get
    skillIds.push(skill.id);

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


  skillIds = skillIds.concat(fillAltSkills(connection, job, ext, fetchChangeSkills(connection, job)));

  removeUnrelatedSkills(job.skills, 'related');
  removeUnrelatedSkills(job.skills, 'alts');

  // cleanup sub skills + add to list of skill ids for filling skill levels
  skillIds = skillIds.concat(fillAltSkills(connection, job, ext, cleanupSubs(job.skills)));

  fillSkillLevels(connection, job, job, skillIds);

  const crestData = fetchCrests(connection, job);

  job.crests = crestData.crests;
  job.messages = job.messages.concat(crestData.messages);
  job.messages = aggregateMessages(connection, job.messages);

  // remove useless duplicate text from crests
  for (let i in crestData.messages) {
    const messageId = crestData.messages[i];
    const message = job.messages[messageId];

    const lastIndex = message.lastIndexOf('\\n\\n');
    if (lastIndex !== -1) {
      job.messages[messageId] = message.substring(lastIndex + 4);
    }
  }

  const durationTime = System.currentTimeMillis() - startTime;
  print("  fetchSkillTree(${job.ascendancies[2].slug}) - completed in ${durationTime} ms");
}