/**
 * Given a result set that is assumed to be from a skill table,
 * will fill out a skill object and return it.
 */

var mapSkill = function (rs) {
  var skill = {
    id: rs.getInt('_SkillID'),
    name: rs.getInt('_NameID'),
    type: rs.getInt('_SkillType'),
    durationType: rs.getInt('_DurationType'),
    element: rs.getInt('_Element'),

    // apply type specific stuff
    cd: [[], []],
    hp: [[], []],
    mp: [[], []],
    description: [[], []],
    params: [[], []]
  };

  var globalCdPvE = rs.getInt('_GlobalCoolTimePvE'),
      globalCdPvP = rs.getInt('_GlobalCoolTimePvP');

  if (globalCdPvE) {
    skill.cdOverride = [globalCdPvE, globalCdPvP];
  }

  return skill;
};