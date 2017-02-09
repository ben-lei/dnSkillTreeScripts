/**
 * Helps remove alt skills that aren't relevant to this skill tree.
 * @param skills
 * @param key
 */
var removeUnrelatedSkills = function (skills, key) {
  for (var id in skills) {
    var skill = skills[id];
    if (skill[key]) {
      skill[key] = skill[key].filter(function (id) {
        return skills[id];
      });
    }
  }
};