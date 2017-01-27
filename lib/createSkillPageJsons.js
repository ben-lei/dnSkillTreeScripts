/**
 * This function gets all skills of individual jobs + their skill tree,
 * and writes it to a given output directory.
 */

var GET_JOB_LIST = readFully("${CWD}/sql/get-job-list.sql");

var createSkillPageJsons = function (connection) {
  print("Creating skill page related jsons.");
  print();

  var stmt = connection.createStatement(),
      rs = stmt.executeQuery(GET_JOB_LIST),
      maxSP;

  if (config.levelCap < 51) {
    maxSP = (config.levelCap - 1) * 3;
  } else {
    maxSP = 147 + (config.levelCap - 50) * 2;
  }

  var ext = {
    weapons: fetchWeapons(connection),
    techs: fetchTechableSkills(connection)
  };

  while (rs.next()) {
    var job = {
      ascendancies: [
        {
          id: rs.getInt('_Basic'),
          name: rs.getString('_BasicName'),
          icon: rs.getInt('_BasicJobIcon'),
          sp: Math.floor(rs.getFloat('_MaxSPJob0') * maxSP)
        },
        {
          id: rs.getInt('_First'),
          name: rs.getString('_FirstName'),
          icon: rs.getInt('_FirstJobIcon'),
          sp: Math.floor(rs.getFloat('_MaxSPJob1') * maxSP)
        },
        {
          id: rs.getInt('ID'),
          name: rs.getString('_Name'),
          icon: rs.getInt('_JobIcon'),
          sp: Math.floor(rs.getFloat('_MaxSPJob2') * maxSP)
        },
      ],

      sp: maxSP,
      slug: rs.getString('_EnglishName'),
      tree: [],
      messages: [],
      skills: {},
      weapons: {},
      crests: {}
    };

    fetchSkillTree(connection, job, ext);

    var slug = job.slug;

    // remove id from each job.ascendancies (useless)
    delete job.ascendancies[0].id;
    delete job.ascendancies[1].id;
    delete job.ascendancies[2].id;
    delete job.slug;

    write(config.output.skilltrees, slug, job);
    print();
  }

  stmt.close();

  print("Finished creating skill jsons.");
};