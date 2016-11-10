/**
 * Fills out the weapon info
 */

var GET_CRESTS = readFully("${CWD}/sql/get-crests.prepared.sql");

var fetchCrests = function (connection, job) {
  print("Fetching crests for " + job.slug);

  var pstmt = connection.prepareStatement(GET_CRESTS);
  pstmt.setInt(1, job.basic.id);
  pstmt.setInt(2, job.first.id);
  pstmt.setInt(3, job.id);

  var rs = pstmt.executeQuery(),
      crests = {},
      messages = [];

  while (rs.next()) {
    var id = rs.getString('_SkillID').split(';')[0],
        descriptionId = rs.getInt('_SummaryDescription'),
        descriptionParams = rs.getString('_SummaryDescriptionParam'),
        descriptionParamsMessageIds = getParamMessageIds(descriptionParams);

    //paramsMessageIds = getParamMessageIds(params)
    var crest = {
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

  return {crests: crests, messageIds: messages};
};
