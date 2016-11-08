/**
 * Helps remove alt skills that aren't relevant to this skill tree.
 * @param skills
 */
var removeUnrelatedAltSkills = function (skills) {
  for (var id in skills) {
    var skill = skills[id];
    if (skill.alts) {
      skill.alts = skill.alts.filter(function (alt) {
        return skills[alt];
      });
    }
  }
};