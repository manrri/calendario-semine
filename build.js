const fs = require('fs');

fs.mkdir('public/css', { recursive: true }, (err) => {
  if (err) throw err;
});

fs.copyFile('node_modules/@picocss/pico/css/pico.min.css', 'public/css/pico.min.css', (err) => {
  if (err) throw err;
});