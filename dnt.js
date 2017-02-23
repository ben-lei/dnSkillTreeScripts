// imports
const System = java.lang.System;
const DriverManager = java.sql.DriverManager;
const FileOutputStream = java.io.FileOutputStream;
const File = java.io.File;
const StandardCharsets = java.nio.charset.StandardCharsets;
const HashSet = java.util.HashSet;

// necessary var
const CWD = System.getProperty("dncli.cwd");

// extra imports
const libFiles = new File(CWD, "/dnt/lib").listFiles();
const sqlFiles = new File(CWD, "/dnt/sql").listFiles();
const sqls = {};

for (let i = 0; i < libFiles.length; i++) {
  if (libFiles[i].isFile()) {
    load(libFiles[i].getAbsolutePath());
  }
}

for (let i = 0; i < sqlFiles; i++) {
  if (sqlFiles[i].isFile()) {
    sqls[sqlFiles[i].getName()] = readFully(sqlFiles[i].getAbsolutePath());
  }
}

// fields
const config = JSON.parse(readFully("${CWD}/config.json"));
let connection;


const normalizeName = function (name) {
  if (name == 'uistring') {
    return 'message';
  }

  return name.substring(0, name.indexOf('table'));
};

const getConnection = function () {
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


const close = function () {
  const connection = getConnection();
  connection.close();
};


const write = function (path, filename, json) {
  const output = new File(path);
  if (!output.exists()) {
    output.mkdirs();
  }

  const out = new FileOutputStream(new File(output, `${filename}.json`));
  out.write(JSON.stringify(json).getBytes(StandardCharsets.UTF_8));
  out.close();
};

const process = function () {
  const connection = getConnection();
  const levelCap = getLevelCap(connection);

  createLevelCapFile(levelCap);

  createJobListJson(connection);
  createSkillPageJsons(connection, levelCap);
};