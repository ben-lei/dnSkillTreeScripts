/**
 * This function gets all skills of individual jobs + their skill tree,
 * and writes it to a given output directory.
 *
 * @param connection the jdbc connection
 * @param levelCap the level cap
 */
function createSkillPageJsons(connection, levelCap) {
  const startTime = System.currentTimeMillis();

  print("createSkillPageJsons() - started\n");

  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(sqls['get-job-list.sql']);
  let maxSP = 147 + (levelCap - 50) * 2;

  if (levelCap < 51) {
    maxSP = (levelCap - 1) * 3;
  }

  const ext = {
    weapons: fetchWeapons(connection),
    techs: fetchTechableSkills(connection)
  };

  while (rs.next()) {
    const job = {
      ascendancies: [
        {
          id: rs.getInt('_Basic'),
          name: rs.getString('_BasicName'),
          icon: rs.getInt('_BasicJobIcon'),
          slug: rs.getString('_BasicEnglishName'),
          sp: Math.floor(rs.getFloat('_MaxSPJob0') * maxSP)
        },
        {
          id: rs.getInt('_First'),
          name: rs.getString('_FirstName'),
          icon: rs.getInt('_FirstJobIcon'),
          slug: rs.getString('_FirstEnglishName'),
          sp: Math.floor(rs.getFloat('_MaxSPJob1') * maxSP)
        },
        {
          id: rs.getInt('ID'),
          name: rs.getString('_Name'),
          icon: rs.getInt('_JobIcon'),
          slug: rs.getString('_EnglishName'),
          sp: Math.floor(rs.getFloat('_MaxSPJob2') * maxSP)
        },
      ],

      awakened: rs.getInt('_Awakened'),
      sp: maxSP,
      tree: [],
      messages: [],
      skills: {},
      weapons: {},
      crests: {},
    };

    fetchSkillTree(connection, job, ext);

    const slug = job.ascendancies[2].slug;

    // remove id from each job.ascendancies (useless)
    delete job.ascendancies[0].id;
    delete job.ascendancies[1].id;
    delete job.ascendancies[2].id;

    writeJson(config.output.skilltrees, slug, job);
    print();
  }

  stmt.close();

  const durationTime = System.currentTimeMillis() - startTime;
  print("createSkillPageJsons() - completed in ${durationTime} ms");
}