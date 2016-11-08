/**
 * This function is used to generate a job list for use in displaying
 * all the jobs.
 */

var GET_JOBS_TREE = readFully("${CWD}/sql/get-jobs-tree.sql");

var createJobListJson = function (connection) {
  print("Creating job list json.");

  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(GET_JOBS_TREE);
  var data = {"groups": [], "jobs": {}};
  var num = 0;

  while (rs.next()) {
    var base = rs.getInt('_BaseClass');
    var slug = rs.getString('_EnglishName');

    if (!data.groups[base]) {
      data.groups[base] = [];
    }

    data.groups[base].push(slug);
    data.jobs[slug] = {"name": rs.getString('JobName'), "icon": rs.getInt('_JobIcon'), "slug": slug};
    num++;
  }

  stmt.close();

  write(config.output.jobs, "jobs", data);

  print();
};