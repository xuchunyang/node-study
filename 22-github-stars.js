const https = require("https");
const axios = require("axios").default;
const tunnel = require("tunnel");

const IPLocationAPIURL = "https://ip-location-lookup.vercel.app/api/ip";
const tunnelingAgent = tunnel.httpsOverHttp({
  proxy: {
    host: "172.23.48.1",
    port: 1080,
  },
});

const githubStarsAPIURL = "https://api.github.com/user/starred";

const TOKEN = Buffer.from(
  "NGQ5YjMzYzdhZWViYjgyOTRlMDNlNTFiZmY3MWU4YzI1MWVkNjdlYw==",
  "base64"
).toString("ascii");

// debug(`TOKEN is ${TOKEN}`);

listMyGitHubStars();

// todo list all stars, not just 30
// https://docs.github.com/en/rest/guides/traversing-with-pagination
// https://www.npmjs.com/package/parse-link-header
async function listMyGitHubStars() {
  try {
    const resp = await axios.get(githubStarsAPIURL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "token " + TOKEN,
      },
      httpsAgent: tunnelingAgent,
      proxy: false,
    });
    // console.log(resp);
    console.log(resp.headers);
    const repos = resp.data;
    repos.forEach((r, i) => {
      console.log(`${i + 1} ${r.name}`);
    });
  } catch (error) {
    console.error(error);
  }
}

function axiosGetExample() {
  axios
    .get(IPLocationAPIURL)
    .then((resp) => {
      // https://github.com/axios/axios#response-schema
      console.log(resp);
      console.log(resp.data);
    })
    .catch((err) => console.error(err.message));
}

// 不行
// Client network socket disconnected before secure TLS connection was established
function axiosProxyExample() {
  axios
    .get(IPLocationAPIURL, {
      proxy: {
        // protocol: "http",
        // /etc/resolved.conf
        host: "172.23.48.1",
        port: 1080,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.error(err.message));
}

// https://segmentfault.com/a/1190000039412894
function axiosProxyViaTunnel() {
  axios
    .get(IPLocationAPIURL, {
      httpsAgent: tunnelingAgent,
      proxy: false,
    })
    .then((resp) => console.log(resp))
    .catch((err) => console.error(err.message));
}

// axiosProxyViaTunnel();
// axiosProxyExample();
// axiosGetExample();

function main1() {
  getStars((error, stars) => {
    if (error) {
      console.error(error.message);
      return;
    }

    console.log("No errors");
    console.log(stars.length);
    console.log(stars);
  });
}

// https://docs.github.com/en/rest/reference/activity#list-repositories-starred-by-the-authenticated-user

// curl \
//   -H "Accept: application/vnd.github.v3+json" \
//   https://api.github.com/user/starred
function getStars(callback) {
  https
    .get(
      "https://api.github.com/user/starred",
      {
        headers: {
          "User-Agent": "node.js",
          Accept: "application/vnd.github.v3+json",
          Authorization: "token " + TOKEN,
        },
      },
      (res) => {
        debug(res.statusCode);
        debug(JSON.stringify(res.headers, null, 4));

        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const stars = JSON.parse(body);
          callback(null, stars);
        });
        res.on("error", (err) => {
          debug("error");
          debug(err);
        });
        res.on("close", () => {
          debug("close");
        });
      }
    )
    .on("error", (error) => {
      callback(error, null);
    });
}

function debug(msg) {
  console.error("DEBUG: " + msg);
}
