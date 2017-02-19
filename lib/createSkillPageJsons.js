/**
 * This function gets all skills of individual jobs + their skill tree,
 * and writes it to a given output directory.
 */

var GET_JOB_LIST = readFully("${CWD}/sql/get-job-list.sql");

var createSkillPageJsons = function (connection, levelCap) {
  print("Creating skill page related jsons.");
  print();

  var stmt = connection.createStatement(),
      rs = stmt.executeQuery(GET_JOB_LIST),
      maxSP;

  if (levelCap < 51) {
    maxSP = (levelCap - 1) * 3;
  } else {
    maxSP = 147 + (levelCap - 50) * 2;
  }

  var ext = {
    weapons: fetchWeapons(connection),
    techs: fetchTechableSkills(connection)
  };

  while (rs.next()) {
    var job = {
      level: levelCap,
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

      sp: maxSP,
      tree: [],
      messages: [],
      skills: {},
      weapons: {},
      crests: {}
    };

    fetchSkillTree(connection, job, ext);

    var slug = job.ascendancies[2].slug;

    // remove id from each job.ascendancies (useless)
    delete job.ascendancies[0].id;
    delete job.ascendancies[1].id;
    delete job.ascendancies[2].id;

    write(config.output.skilltrees, slug, job);
    print();
  }

  stmt.close();

  print("Finished creating skill jsons.");
};