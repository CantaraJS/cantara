import greet from './src';

export const handler = (event, context, cb) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      hello: greet(),
      secret: process.env.SECRET_API_KEY,
    }),
    isBase64Encoded: false,
  };

  cb(null, response);
};
