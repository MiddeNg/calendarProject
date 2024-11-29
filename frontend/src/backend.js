const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

const backendService = {
  async login(idToken) {
    const response = await fetch( baseUrl+ '/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id_token: idToken}),
    });
    if (response.ok) {
      return response;
    } else {
      return Promise.reject(response);
    }
  },
};

export default backendService