/**
 * Given a list of message ids, this function will return their
 * corresponding message.
 */

var GET_MESSAGES_PREPARED = readFully("${CWD}/sql/get-messages.prepared.sql");

var aggregateMessages = function (connection, messageIds) {
  var messageIdsStr = messageIds.join(','),
      query = GET_MESSAGES_PREPARED.replace('?', messageIdsStr),
      stmt = connection.createStatement(),
      rs = stmt.executeQuery(query),
      messages = {};

  while (rs.next()) {
    messages[rs.getInt('ID')] = rs.getString('_Message');
  }

  stmt.close();

  return messages;
};