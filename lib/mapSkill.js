/**
 * Given a result set that is assumed to be from a skill table,
 * will fill out a skill object and return it.
 */

var mapSkill = function (rs) {
  var skill = {
    id: rs.getInt('_SkillID'),
    name: rs.getInt('_NameID'),
    icon: rs.getInt('_IconImageIndex'),
    maxLevel: rs.getInt('_MaxLevel'),
    type: rs.getInt('_SkillType'),
    // durationType: rs.getInt('_DurationType'),
    element: rs.getInt('_Element'),
    need: {
      job: rs.getInt('_JobNumber')
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