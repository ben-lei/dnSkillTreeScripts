/**
 * Given a result set that is assumed to be from a skill table,
 * will fill out a skill object and return it.
 *
 * @param rs the jdbc result set
 * @param job the job data
 * @param ext the extension data
 * @returns the skill data
 */
function mapSkill(rs, job, ext) {
  const skill = {
    id: rs.getInt('_SkillID'),
    name: rs.getInt('_NameID'),
    type: rs.getInt('_SkillType'),
    durationType: rs.getInt('_DurationType'),
    element: rs.getInt('_Element'),
    weapons: [rs.getInt('_NeedWeaponType1'), rs.getInt('_NeedWeaponType2')].filter(notNeg1),

    // apply type specific stuff
    cd: [[], []],
    hp: [[], []],
    mp: [[], []],
    description: [[], []],
    params: [[], []]
  };

  const globalCdPvE = rs.getInt('_GlobalCoolTimePvE');
  const globalCdPvP = rs.getInt('_GlobalCoolTimePvP');

  if (globalCdPvE) {
    skill.cdOverride = [globalCdPvE, globalCdPvP];
  }

  if (!skill.weapons.length) {
    delete skill.weapons;
  } else {
    // add weapons to job
    skill.weapons.forEach(function (type) {
      if (!job.weapons[type]) {
        job.weapons[type] = ext.weapons[type];
        job.messages.push(ext.weapons[type]);
      }
    });
  }

  return skill;
}