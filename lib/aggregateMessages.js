/**
 * Given a list of message ids, this function will return their
 * corresponding message.
 */

var GET_MESSAGES_PREPARED = readFully("${CWD}/sql/get-messages.prepared.sql");

var aggregateMessages = function (connection, messageIds) {
  var messageIdsStr = messageIds.join(',');
  var query = GET_MESSAGES_PREPARED.replace('?', messageIdsStr);
  var stmt = connection.createStatement();
  var rs = stmt.executeQuery(query);
  var messages = {};

  while (rs.next()) {
    messages[rs.getInt('ID')] = rs.getString('_Message');
  }

  stmt.close();

  return messages;
};