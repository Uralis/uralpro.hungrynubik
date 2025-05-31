const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
    user: "uralis@a1132798",
    password: "3XbXJneNc39xYLR",
    host: "ftp.testnov3434323.ru",
    port: 21,
    localRoot: __dirname + "/build",
    remoteRoot: "/public_html",
    include: ["*", "**/*", ".htaccess"],
    exclude: [],
    deleteRemote: false,
    forcePasv: true
};

ftpDeploy
    .deploy(config)
    .then(res => console.log("Deploy finished:", res))
    .catch(err => console.log("Deploy error:", err)); 