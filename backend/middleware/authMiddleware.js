const jwtHeaderName = 'authorization';

const readBearerToken = request => String(request.headers[jwtHeaderName] || '').replace(/^Bearer\s+/i, '');

module.exports = {
  readBearerToken,
};
