  // export const environment = {
  //   production: false,
  //   baseUrl: 'http://localhost:3000/api',
  // };
  const isLocalhost = typeof window !== 'undefined' && window.location.origin.includes("localhost");

  export const environment = {
    production: !isLocalhost,
    baseUrl: isLocalhost
      ? 'http://localhost:3000'
      : 'https://api.eventdesk.io',
  };
  