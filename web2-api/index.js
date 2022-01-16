const fastify = require('fastify');
const dns = require('dns');
const utils = require('util');
const { TwitterApi } = require('twitter-api-v2');
const fastifyCors = require('fastify-cors');


const server = fastify();
server.register(fastifyCors);
const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN);
const roClient = twitterClient.readOnly;

server.get('/', async (request) => {
  const { name } = request.query;

  if (!name) return {};

  try {
    const [com, xyz, io, twitter] = await Promise.all([
      utils.promisify(dns.resolveNs)(name + ".com").then(() => ({})).catch(() => Promise.resolve(false)),
      utils.promisify(dns.resolveNs)(name + ".xyz").then(() => ({})).catch(() => Promise.resolve(false)),
      utils.promisify(dns.resolveNs)(name + ".io").then(() => ({})).catch(() => Promise.resolve(false)),
      roClient.v2.userByUsername(name).then(() => ({})).catch(() => Promise.resolve(false)),
    ]);
    return { name, com, xyz, io, twitter };
  } catch (error) {
    console.error(error);
    return {}
  }
});

const start = async () => {
  try {
    console.log("Starting on port", process.env.PORT || 9000);
    await server.listen(Number(process.env.PORT) || 9000);
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start();
