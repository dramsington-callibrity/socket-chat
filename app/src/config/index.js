const issuer = process.env.REACT_APP_ISSUER;
const client_id = process.env.REACT_APP_SECRET;

export const oktaConfig = {
  issuer,
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id
};
