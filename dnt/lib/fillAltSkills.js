/**
 * Finds all the alt skills and fills it into data object.
 * Returns the found skill ids.
 *
 * @param connection the jdbc connection
 * @param job the job object
 * @param data the skill tree data object
 * @param altSkillIds the list of alternative skill ids
 * @returns []
 */
function fillAltSkills(connection, job, data, altSkillIds) {
  print("Filling alt skills for ${job.ascendancies[2].slug}");

  // const altSkillIdsStr = altSkillIds.join(',');
  const query = sqls['get-alt-skills.prepared.sql']; //.replace('(?)', "(${altSkillIdsStr})");
  const pstmt = connection.prepareStatement(query);

  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  const skillIds = [];

  altSkillIds.forEach(function (altSkillId) {
    pstmt.setInt(4, altSkillId);

    const rs = pstmt.executeQuery();

    rs.next(); // get self

    let skill = mapSkill(rs);

    if (skill.id != altSkillId) { // how'd this pop up here?
      print("Could not find ${altSkillId} in database for this class.");
      return;
    }

    const needJob = rs.getInt('_NeedJob');

    if (needJob != job.ascendancies[2].id) {
      let prevId = altSkillId;
      let found = false;

      while (rs.next()) {
        const skill1 = mapSkill(rs);

        if (prevId - skill1.id != 1) { // contigous ids are class specific
          break;
        }

        // save this id
        prevId = skill1.id;

        const needJob1 = rs.getInt('_NeedJob');
        if (needJob1 == job.ascendancies[2].id) { // found a second ascendancy skill contiguous to other skills
          found = true;
          break;
        }
      }

      if (!found) {
        print("Alt Skill ${altSkillId} was determined to not be for this ascendancy.");
        skill = null;
      }
    }

    if (skill) {
      data.messages.push(skill.name);
      data.skills[skill.id] = skill;
      skillIds.push(skill.id);
    }

    rs.close();
  });

  pstmt.close();

  return skillIds;
}