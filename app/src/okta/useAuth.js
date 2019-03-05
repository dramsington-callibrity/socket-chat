import { useState, useEffect } from 'react';
import useUser from './useUser';

export default auth => {
  const [ isAuthenticated, setAuthenticated ] = useState(null);
  const [ user ] = useUser(isAuthenticated, auth);

  useEffect(() => {
    if (isAuthenticated === null) {
      checkAuthentication(auth);
    }
  });

  const checkAuthentication = async () => {
    const authenticated = await auth.isAuthenticated();
    if (authenticated !== isAuthenticated) {
      setAuthenticated(authenticated);
    }
  };

  return { isAuthenticated, user };
};
