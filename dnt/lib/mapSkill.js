/**
 * Given a result set that is assumed to be from a skill table,
 * will fill out a skill object and return it.
 *
 * @param rs the jdbc result set
 * @returns the skill data
 */
function mapSkill(rs) {
  const skill = {
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

  const globalCdPvE = rs.getInt('_GlobalCoolTimePvE');
  const globalCdPvP = rs.getInt('_GlobalCoolTimePvP');

  if (globalCdPvE) {
    skill.cdOverride = [globalCdPvE, globalCdPvP];
  }

  return skill;
}