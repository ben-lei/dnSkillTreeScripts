/**
 * This function is used to generate a job list for use in displaying
 * all the jobs.
 *
 * @param connection the jdbc connection
 */
function createJobListJson(connection) {
  print('Creating job list json.');

  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(sqls['get-jobs-tree.sql']);
  const data = [];

  while (rs.next()) {
    const base = rs.getInt('_BaseClass');
    const slug = rs.getString('_EnglishName');

    if (!data[base]) {
      data[base] = [];
    }

    data[base].push({
      name: rs.getString('JobName'),
      icon: rs.getInt('_JobIcon'),
      slug: slug,
      awakened: rs.getInt('_Awakened'),
    });
  }

  stmt.close();

  write(config.output.jobs, 'jobs', data);

  print();
}
