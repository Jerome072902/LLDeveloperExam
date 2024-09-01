const sql = require("mssql");

const config = {
  server: "DESKTOP-7UVS9SJ",
  database: "LLDeveloperExam",
  user: "admin_jerome",
  password: "1234",
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

module.exports = {
  connect: () => sql.connect(config),
  sql,
};
