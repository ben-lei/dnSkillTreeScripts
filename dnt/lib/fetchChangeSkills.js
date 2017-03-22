function fetchChangeSkills(connection, job) {
  const startTime = System.currentTimeMillis();
  print("    fetchChangeSkills(${job.ascendancies[2].slug}) - started");

  const query = sqls['get-change-skills.prepared.sql'];
  const pstmt = connection.prepareStatement(query);

  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  const rs = pstmt.executeQuery();
  let skillIds = [];

  while (rs.next()) {
    skillIds = skillIds.concat(rs.getString('_ChangeSkill').split(';').map(toInt));
  }

  pstmt.close();

  const durationTime = System.currentTimeMillis() - startTime;
  print("    fetchChangeSkills(${job.ascendancies[2].slug}) - completed in ${durationTime} ms");

  return skillIds;
}
