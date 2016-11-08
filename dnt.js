// imports
var System = java.lang.System;
var DriverManager = java.sql.DriverManager;
var FileOutputStream = java.io.FileOutputStream;
var File = java.io.File;
var StandardCharsets = java.nio.charset.StandardCharsets;
var HashSet = java.util.HashSet;

// necessary var
var CWD = System.getProperty("dncli.cwd");

// extra imports
load("${CWD}/lib/higherOrderHelpers.js");
load("${CWD}/lib/aggregateMessages.js");
load("${CWD}/lib/createJobListJson.js");
load("${CWD}/lib/createSkillJsons.js");
load("${CWD}/lib/processSkillTree.js");
load("${CWD}/lib/mapSkill.js");
load("${CWD}/lib/fillAltSkills.js");
load("${CWD}/lib/fillSkillLevels.js");
load("${CWD}/lib/removeUnrelatedAltSkills.js");
load("${CWD}/lib/fetchWeapons.js");

// fields
var config = JSON.parse(readFully("${CWD}/config.json"));
var connection;

var normalizeName = function (name) {
  if (name == 'uistring') {
    return 'message';
  }

  return name.substring(0, name.indexOf('table'));
};

var getConnection = function () {
  if (connection) {
    return connection;
  }

  connection = DriverManager.getConnection("jdbc:mysql://localhost/maze?"
      + "user=root&"
      + "password=root&"
      + "useUnicode=true&"
      + "characterEncoding=utf-8&"
      + "useSSL=false");

  // connection = DriverManager.getConnection("jdbc:h2:mem:test;MODE=MYSQL;IGNORECASE=TRUE");

  return connection;
};


var close = function () {
  var connection = getConnection();
  connection.close();
};


var write = function (path, filename, json) {
  var output = new File(path);
  if (!output.exists()) {
    output.mkdirs();
  }

  var out = new FileOutputStream(new File(output, filename + ".json"));
  out.write(JSON.stringify(json).getBytes(StandardCharsets.UTF_8));
  out.close();
};

var process = function () {
  var connection = getConnection();

  createJobListJson(connection);
  createSkillJsons(connection);
};