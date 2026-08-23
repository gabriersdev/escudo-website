const moment = require('moment');

// try parsing without locale import
let d1 = moment('20 AGO 2026', 'DD MMM YYYY');
console.log('Without pt-br:', d1.isValid(), d1.toISOString());

require('moment/locale/pt-br');
moment.locale('pt-br');

let d2 = moment('20 AGO 2026', 'DD MMM YYYY');
console.log('With pt-br:', d2.isValid(), d2.toISOString());

let d3 = moment('20 AGO 2026');
console.log('Without format, native parse:', d3.isValid(), d3.toISOString());
