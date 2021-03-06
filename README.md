# umapi_sms_ru

sms_ru
======

Nodejs модуль для работы с API сервиса [umapi.sms.ru](http://umapi.sms.ru)

Официальная документация по работе с API – [http://umapi.sms.ru/?panel=api](http://umapi.sms.ru/?panel=api)
## Установка
```
npm install umapi_sms_ru
```

## Использование

Подключение:
```js
var UMAPI_SMS_RU = require('umapi_sms_ru');
```

Авторизация (с помощью api_id):
```js
var sms = new UMAPI_SMS_RU(api_id);
```


Отправка SMS:

|Параметр|Обязательный|Значение|Описание|
|--------|------------|--------|--------|
|to|Да|Значение|Описание|
|msg|Да|Значение|Описание|
|from|Нет|Значение|Описание|
|ip|Нет|Значение|Описание|
|time|Нет|Значение|Описание|
|daytime|Нет|Значение|Описание|
|translit|Нет|Значение|Описание|
|test|Нет|Значение|Описание|

```js
sms.send( to, msg, from , ip, time, daytime, translit, test)
.then(e => console.log(e.data))
.catch(console.error);
```


## Автор

[Alexandr Nikulin](https://github.com/SashokNekulin/), e-mail: [nekulin@mail.ru](mailto:nekulin@mail.ru)
