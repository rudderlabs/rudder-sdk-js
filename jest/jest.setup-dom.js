jest.setTimeout(60000);

const documentHTML = '<script></script>';

global.window.document.body.innerHTML = documentHTML;
global.window.innerWidth = 1680;
global.window.innerHeight = 1024;
