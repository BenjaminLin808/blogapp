const AWS = require("aws-sdk");

async function getParameter() {
  const ssmClient = new AWS.SSM({
    apiVersion: "2014-11-06",
    region: "us-east-2",
  });

  return new Promise((resolve, reject) => {
    ssmClient.getParameter(
      {
        Name: "/blogapp/blog",
        WithDecryption: true,
      },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data.Parameter.Value);
      }
    );
  });
}

module.exports = { getParameter };
