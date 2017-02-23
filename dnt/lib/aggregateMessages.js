/**
 * Given a list of message ids, this function will return their
 * corresponding message.
 *
 * @param connection the jdbc connection
 * @param messageIds the message ids
 * @returns {}
 */
function aggregateMessages(connection, messageIds) {
  const messageIdsStr = messageIds.join(',');
  const query = sqls['get-messages.prepared.sql'].replace('?', messageIdsStr);
  const stmt = connection.createStatement();
  const rs = stmt.executeQuery(query);
  const messages = {};

  while (rs.next()) {
    messages[rs.getInt('ID')] = rs.getString('_Message');
  }

  stmt.close();

  return messages;
}