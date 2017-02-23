/**
 * Helps remove alt skills that aren't relevant to this skill tree.
 *
 * @param skills the list of skill data
 * @param key the field of the skill data to filter out
 */
function removeUnrelatedSkills(skills, key) {

  Object.keys(skills)
    .forEach(function (id) {
      const skill = skills[id];

      if (skill[key]) {
        skill[key] = skill[key].filter(function (keyId) {
          return skills[keyId];
        });
      }
    });
}
