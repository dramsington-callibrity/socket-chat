import { useState, useEffect } from 'react';

export default (isAuthenticated, auth) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user === null && !loading) {
      retrieveUser();
    }
  });

  const retrieveUser = async () => {
    setLoading(true);
    setUser(await auth.getUser());
    setLoading(false);
  };

  return [ user ];
};
