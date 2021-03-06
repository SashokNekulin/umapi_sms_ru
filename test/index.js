const UMAPI_SMS_RU = require('../index');
const API_KEY = "DAFC4B82-F76D-B62C-2BA8-04DC0E8F02C2"


const sms = new UMAPI_SMS_RU(API_KEY);
sms.send('89082903350', 'test', null, null, null, null, null, true).then(console.log).catch(console.error)

