/**
 * Given a result set that is assumed to be from a skill table,
 * will fill out a skill object and return it.
 */

var mapSkill = function (rs) {
  var skill = {
    id: rs.getInt('_SkillID'),
    nameId: rs.getInt('_NameID'),
    iconIndex: rs.getInt('_IconImageIndex'),
    maxLevel: rs.getInt('_MaxLevel'),
    type: rs.getInt('_SkillType'),
    durationType: rs.getInt('_DurationType'),
    element: rs.getInt('_Element'),
    base: rs.getInt('_BaseSkillID'),
    group: rs.getInt('_SkillGroup'),
    need: {
      jobId: rs.getInt('_NeedJob'),
      weapons: [rs.getInt('_NeedWeaponType1'), rs.getInt('_NeedWeaponType2')].filter(notNeg1),
    },

    // apply type specific stuff
    cd: [[], []],
    hp: [[], []],
    mp: [[], []],
    description: [[], []],
    params: [[], []],

    // not apply type specific, is level specific
    levelReq: [],
    sp: [],
    spTotal: []
  };

  var globalCdPvE = rs.getInt('_GlobalCoolTimePvE'),
      globalCdPvP = rs.getInt('_GlobalCoolTimePvP');

  if (globalCdPvE) {
    skill.cdOverride = [globalCdPvE, globalCdPvP];
  }

  return skill;
};