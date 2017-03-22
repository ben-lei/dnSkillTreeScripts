function cleanupSubs(skills) {
  const subList = [];
  Object.keys(skills)
    .forEach(function (id) {
      const skill = skills[id];
      const subSkillId = skill.sub;
      const subReq = skill.subReq;
      if (subSkillId && !skills[subReq]) {
        delete skill.sub;
        delete skill.subReq;
      } else if (subSkillId) {
        subList.push(subSkillId);
      }
    });

  return subList;
}