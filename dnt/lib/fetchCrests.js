/**
 * Fills out the weapon info
 *
 * @param connection the jdbc ocnnection
 * @param job the job object
 * @returns {{crests: {}, messages: []}}
 */
function fetchCrests(connection, job) {
  const startTime = System.currentTimeMillis();
  print("    fetchCrests(${job.ascendancies[2].slug}) - started");

  const pstmt = connection.prepareStatement(sqls['get-crests.prepared.sql']);
  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  const rs = pstmt.executeQuery();
  const crests = {};
  const messages = [];


  while (rs.next()) {
    const id = rs.getInt('_SkillID');

    const descriptionId = rs.getInt('_DescriptionID');
    const descriptionParams = rs.getString('_DescriptionIDParam');
    const descriptionParamsMessageIds = getParamMessageIds(descriptionParams);

    const crest = {
      description: descriptionId,
      params: descriptionParams
    };

    crests[id] = crests[id] ? crests[id].concat(crest) : [crest];

    // add to messages
    messages.push(descriptionId);

    // add description param message ids to messages
    descriptionParamsMessageIds.forEach(function (m) {
      messages.push(m);
    });
  }

  pstmt.close();

  const durationTime = System.currentTimeMillis() - startTime;
  print("    fetchCrests(${job.ascendancies[2].slug}) - completed in ${durationTime} ms");

  return { crests: crests, messages: messages };
}
