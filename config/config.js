const convict = require("convict");
const convict_format_with_validator = require("convict-format-with-validator");
const parameter = require("../parameterStore");

convict.addFormats(convict_format_with_validator);

let jsonObject = {};

// Define a schema
var config = convict({
  env: {
    doc: "The application environment.",
    format: ["prod", "dev", "test"],
    default: "dev",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port",
  },
  redis_port: {
    doc: "redis port to connect to.",
    format: "port",
    default: 6379,
    env: "REDIS_PORT",
    arg: "redisport",
  },
  redis_host: {
    doc: "redis hostname",
    format: String,
    default: "redis",
    env: "REDIS_HOST",
    arg: "redishost",
  },
  db: {
    host: {
      doc: "",
      format: "*",
      default: "jsonObject.DB_HOST",
      env: "DB_HOST",
    },
    name: {
      doc: "",
      format: "*",
      default: "jsonObject.DB_NAME",
      env: "DB_NAME",
    },
    db_url: {
      format: "*",
      default: "jsonObject.DB_URL",
      env: "DB_URL",
    },
    password: {
      doc: "",
      format: "*",
      default: "jsonObject.MON_PASS",
      sensitive: true,
      env: "MON_PASS",
    },
  },
  secret: {
    doc: "Secret used for session cookies and CSRF tokens",
    format: "*",
    default: ".",
    sensitive: true,
    env: "SESSION_SECRET",
  },
  test_username: {
    doc: "Secret used for session cookies and CSRF tokens",
    format: "*",
    default: "",
    sensitive: true,
    env: "TEST_USER_NAME",
  },
  test_password: {
    doc: "Secret used for session cookies and CSRF tokens",
    format: "*",
    default: "",
    sensitive: true,
    env: "TEST_PASSWORD",
  },
});

async function getParameter() {
  try {
    const parameterValue = await parameter.getParameter();
    jsonObject = JSON.parse(parameterValue);
    config.set("db.host", jsonObject.DB_HOST);
    config.set("db.name", jsonObject.DB_NAME);
    config.set("db.db_url", jsonObject.DB_URL);
    config.set("db.password", jsonObject.MON_PASS);

    return config;
  } catch (error) {
    console.error("Error getting parameter:", error);
  }
}

var env = config.get("env");
config.loadFile("./config/" + env + ".json");

// Perform validation
config.validate({ allowed: "strict" });

module.exports = { config, getParameter };
