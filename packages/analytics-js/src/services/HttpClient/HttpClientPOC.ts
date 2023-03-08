class HttpClientPOC {
  get(url: string) {
    return fetch('/dummyUrlToTestFetch')
      .then(response => {
        if (response.ok) {
          return response;
        }
        // convert non-2xx HTTP responses into errors:
        const error = new Error(response.statusText);
        (error as any).response = response;
        return Promise.reject(error);
      })
      .then(response => response.json())
      .then(data => data);
  }
}

export { HttpClientPOC };
