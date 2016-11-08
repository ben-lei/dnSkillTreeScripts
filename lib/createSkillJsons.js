/**
 * This function gets all skills of individual jobs + their skill tree,
 * and writes it to a given output directory.
 */

var GET_JOB_LIST = readFully("${CWD}/sql/get-job-list.sql");

var createSkillJsons = function (connection) {
  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_JOB_LIST);
  var maxSP;

  if (config.levelCap < 51) {
    maxSP = (config.levelCap - 1) * 3;
  } else {
    maxSP = 147 + (config.levelCap - 50) * 2;
  }

  while (rs.next()) {
    var job = {
      id: rs.getInt('ID'),
      slug: rs.getString('_EnglishName'),
      name: rs.getString('_Name'),
      icon: rs.getInt('_JobIcon'),

      basic: {
        id: rs.getInt('_Basic'),
        name: rs.getString('_BasicName'),
        icon: rs.getInt('_BasicJobIcon')
      },

      first: {
        id: rs.getInt('_First'),
        name: rs.getString('_FirstName'),
        icon: rs.getInt('_FirstJobIcon')
      },

      maxSP: [Math.floor(rs.getFloat('_MaxSPJob0') * maxSP),
        Math.floor(rs.getFloat('_MaxSPJob1') * maxSP),
        Math.floor(rs.getFloat('_MaxSPJob2') * maxSP)]
    };

    var data = processSkillTree(connection, job);

    write(config.output.skilltrees, job.slug, data);
  }

  stmt.close();
};