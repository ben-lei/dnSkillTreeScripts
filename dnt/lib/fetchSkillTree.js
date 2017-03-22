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
  let altSkillIds = [];

  while (rs.next()) {
    const jobIndex = rs.getInt('_JobIndex');
    const treeSlotIndex = rs.getInt('_TreeSlotIndex');
    const base = rs.getInt('_BaseSkillID');
    const group = rs.getInt('_SkillGroup');
    const weapons = [rs.getInt('_NeedWeaponType1'), rs.getInt('_NeedWeaponType2')].filter(notNeg1);
    const parents = [
      { id: rs.getInt('_ParentSkillID1'), level: rs.getInt('_NeedParentSkillLevel1') },
      { id: rs.getInt('_ParentSkillID2'), level: rs.getInt('_NeedParentSkillLevel2') },
      { id: rs.getInt('_ParentSkillID3'), level: rs.getInt('_NeedParentSkillLevel3') },
    ].filter(idNot0);
    const alts = rs.getString('_ChangeSkill').split(';').filter(self).filter(not0).map(toInt);
    const related = rs.getString('_TreeSkill').split(';').filter(self).filter(not0).map(toInt);
    const skill = mapSkill(rs);

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

    var subId = rs.getInt('_SubSkillTableID');
    if (subId) {
      if (skill.alts) {
        skill.alts.push(subId);
      } else {
        skill.alts = [subId];
      }
    }

    // add to list of alts to get
    skillIds.push(skill.id);
    if (skill.alts) {
      altSkillIds = altSkillIds.concat(skill.alts);
    }

    // add weapons for this job
    weapons.forEach(function (type) {
      if (!job.weapons[type]) {
        job.weapons[type] = ext.weapons[type];
        job.messages.push(ext.weapons[type]);
      }
    });

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