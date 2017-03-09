// imports
const System = java.lang.System;
const DriverManager = java.sql.DriverManager;
const FileOutputStream = java.io.FileOutputStream;
const File = java.io.File;
const StandardCharsets = java.nio.charset.StandardCharsets;

// necessary var
const CWD = System.getProperty('dncli.cwd');

// fields
const config = JSON.parse(readFully(new File(System.getProperty('dncli.config'))));
let connection;

function normalizeName(name) {
  if (name == 'uistring') {
    return 'message';
  }

  name = name.substring(0, name.indexOf('table'));
  if (name.indexOf('_') !== -1) {
    name = name.substring(0, name.indexOf('_'));
  }

  return name;
}

function getConnection() {
  if (connection) {
    return connection;
  }

  connection = DriverManager.getConnection(config.jdbc);

  // connection = DriverManager.getConnection('jdbc:h2:mem:test;MODE=MYSQL;IGNORECASE=TRUE');

  return connection;
}


function close() {
  const connection = getConnection();
  connection.close();
}


function writeJson(path, filename, data) {
  write(path, "${filename}.json", JSON.stringify(data));
}


function write(path, filename, data) {
  const output = new File(path);
  if (!output.exists()) {
    output.mkdirs();
  }

  const out = new FileOutputStream(new File(output, filename));
  out.write(data.getBytes(StandardCharsets.UTF_8));
  out.close();
}

function process() {
  const connection = getConnection();
  const levelCap = getLevelCap(connection);

  if (config.output.level) {
    createLevelCapFile(levelCap);
  }

  createJobListJson(connection);
  createSkillPageJsons(connection, levelCap);
}

// loading other stuff
const libFiles = new File(CWD, '/dnt/lib').listFiles();
const sqlFiles = new File(CWD, '/dnt/sql').listFiles();
const sqls = {};

for (let i = 0; i < libFiles.length; i++) {
  if (libFiles[i].isFile()) {
    load(libFiles[i].getAbsoluteFile());
  }
}

for (let i = 0; i < sqlFiles.length; i++) {
  if (sqlFiles[i].isFile()) {
    sqls[sqlFiles[i].getName()] = readFully(sqlFiles[i].getAbsoluteFile());
  }
}
