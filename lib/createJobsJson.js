/**
 * This function is used to generate a job list for use in displaying
 * all the jobs.
 */

var GET_JOBS_TREE = readFully("${CWD}/sql/get-jobs-tree.sql");

var createSkillJsons = function (connection) {
  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_JOBS_TREE);
  var data = {"groups": [], "jobs": {}};

  while (rs.next()) {
    var base = rs.getInt('_BaseClass');
    var slug = rs.getString('_EnglishName');

    if (!data.groups[base]) {
      data.groups[base] = [];
    }

    data.groups[base].push(slug);
    data.jobs[slug] = {"name": rs.getString('JobName'), "icon": rs.getInt('_JobIcon'), "slug": slug};
  }

  stmt.close();

  write(config.output.jobs, "jobs.json", data);
};
