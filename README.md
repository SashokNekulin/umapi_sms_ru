# umapi_sms_ru
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

|Параметр|Обязательный|Описание                                                                           |
|--------|------------|-----------------------------------------------------------------------------------|
|to|Да|Номер телефона получателя (либо несколько номеров, через запятую — до 100 штук за один запрос).|
|msg|Да|Текст сообщения в кодировке UTF-8|
|from|Нет|Имя отправителя (должно быть согласовано с администрацией). Если не заполнено, в качестве отправителя будет указан ваш отправитель по умолчанию.|
|ip|Нет|Если СМС сообщение отправляется в ответ на действия пользователя (например сообщение содержит код авторизации), то мы можем защитить вас на случай от действий злоумышленников, которые вынуждают вас отправлять много сообщений на один или разные номера (к примеру, регистрируясь много раз подряд на вашем сайте с одного IP адреса). В этом параметре вы можете передать нам IP адрес вашего пользователя, и, если мы заметим, что с этим IP связано большое количество сообщений, то мы их начнем блокировать (ограничение настраивается в разделе "Настройки").|
|time|Нет|Если вам нужна отложенная отправка, то укажите время отправки. Указывается в формате UNIX TIME (пример: 1280307978). Должно быть не больше 2 месяцев с момента подачи запроса. Если время меньше текущего времени, сообщение отправляется моментально.|
|daytime|Нет|Учитывает часовой пояс получателя. Если у получателя сейчас ночь (уже наступило время 20:00), то откладывает отправку до 10 часов утра. Если указан этот параметр, то параметр time игнорируется. 0 - не учитывать 1 - учитывать По умолчанию 0|
|translit|Нет|Переводит все русские символы в латинские. 0 - не переводить 1 - переводить По умолчанию 0|
|test|Нет|Имитирует отправку сообщения для тестирования ваших программ на правильность обработки ответов сервера. При этом само сообщение не отправляется и баланс не расходуется. 0 - обычная отправка 1 - тестовая отправка По умолчанию 0|

```js
sms.send( to, msg, from , ip, time, daytime, translit, test)
.then(e => console.log(e.data))
.catch(console.error)
```


## Автор

[Alexandr Nikulin](https://github.com/SashokNekulin/), e-mail: [nekulin@mail.ru](mailto:nekulin@mail.ru)
