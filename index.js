/**
 * @ Author: <Alexandr Nikulin> (nekulin@mail.ru)
 * @ Github: https://github.com/SashokNekulin
 * @ Create Time: 2020-07-15 13:05:37
 * @ Modified time: 2021-03-09 12:07:45
 * @ Copyrights: (c) 2020 umapi.ru
 * @ License: MIT
 * @ Description:
 */

const axios = require('axios')
const querystring = require('querystring');
const code = require('./code.json')

const editCode = (type, path, maps) => {
    if (typeof maps === 'object') {
        for (const key in maps) {
            if (key === "status_code") {
                const status_title = code[type + path] && code[type + path][maps[key]]
                    ? code[type + path][maps[key]]
                    : maps['status_text']
                        ? maps['status_text']
                        : ''
                maps["status_title"] = status_title
            }
            maps[key] = editCode(type, path, maps[key])
        }
    }
    return maps
}

const zapros = (type, path, formData) => {
    return new Promise((resolve, reject) => {
        try {
            axios.post(`https://sms.ru/${type}/${path}`, querystring.stringify(formData))
                .then(r => resolve(editCode(type, path, r.data)))
                .catch(reject)
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = class UMAPI_SMS_RU {

    /**
     * Конструктор
     *
     * @param {string} api_key Ключ API
     */
    constructor(api_key) {
        this.api_key = api_key
    }

    /**
     * Отправить СМС сообщение
     *
     * @param {string} to Номер телефона получателя (либо несколько номеров, через запятую — до 100 штук за один запрос).
     * Вы также можете указать номера в виде массива to[номер получателя]=текст&to[номер получателя]=текст.
     * Если вы указываете несколько номеров и один из них указан неверно, то вместо идентификатора сообщения в выдаче вы получите трехзначный код ошибки.
     * Если вы отправляете более, чем на 10 номеров за раз, то рекомендуем параметр to передавать в теле запроса методом POST, а не в адресной строке.
     * @param {string} msg Текст сообщения в кодировке UTF-8
     * @param {string} from Имя отправителя (должно быть согласовано с администрацией). Если не заполнено, в качестве отправителя будет указан ваш отправитель по умолчанию.
     * @param {string} ip Если СМС сообщение отправляется в ответ на действия пользователя (например сообщение содержит код авторизации),
     * то мы можем защитить вас на случай от действий злоумышленников, которые вынуждают вас отправлять много сообщений на один или разные номера
     * (к примеру, регистрируясь много раз подряд на вашем сайте с одного IP адреса). В этом параметре вы можете передать нам IP адрес вашего пользователя,
     *  и, если мы заметим, что с этим IP связано большое количество сообщений, то мы их начнем блокировать (ограничение настраивается в разделе "Настройки").
     * @param {string} time Если вам нужна отложенная отправка, то укажите время отправки. Указывается в формате UNIX TIME (пример: 1280307978).
     * Должно быть не больше 2 месяцев с момента подачи запроса. Если время меньше текущего времени, сообщение отправляется моментально.
     * @param {string} daytime Учитывает часовой пояс получателя. Если у получателя сейчас ночь (уже наступило время 20:00), то откладывает отправку до 10 часов утра.
     * Если указан этот параметр, то параметр time игнорируется. Указать 1.
     * @param {string} translit Переводит все русские символы в латинские. Указать 1.
     * @param {string} test Имитирует отправку сообщения для тестирования ваших программ на правильность обработки ответов сервера.
     *  При этом само сообщение не отправляется и баланс не расходуется. Указать 1.
     *
     */
    send = (to, msg, from = null, ip = null, time = null, daytime = null, translit = null, test = null) => {
        const formData = {
            api_id: this.api_key,
            to,
            msg,
            json: 1,
            partner_id: 118841
        }
        if (ip) formData.ip = ip
        if (test) formData.test = test
        if (time) formData.time = time
        if (from) formData.from = from
        if (daytime) formData.daytime = daytime
        if (translit) formData.translit = translit
        return zapros('sms', 'send', formData)
    }

    /**
     * Проверить статус отправленных сообщений
     *
     * @param {string} sms_id Идентификатор сообщения, полученный при использовании метода sms/send.
     * Можно указать несколько идентификаторов через запятую (до 100 штук за раз).
     *
     */
    status = (sms_id) => {
        const formData = {
            api_id: this.api_key,
            sms_id,
            json: 1
        }
        return zapros('sms', 'status', formData)
    }

    /**
     * Проверить стоимость сообщений перед отправкой
     *
     * @param {string} to Номер телефона получателя (либо несколько номеров, через запятую — до 100 штук за один запрос).
     * Вы также можете указать номера в виде массива to[номер получателя]=текст&to[номер получателя]=текст.
     * Если вы указываете несколько номеров и один из них указан неверно, то вместо идентификатора сообщения в выдаче вы получите трехзначный код ошибки.
     * Если вы отправляете более, чем на 10 номеров за раз, то рекомендуем параметр to передавать в теле запроса методом POST, а не в адресной строке.
     * @param {string} msg Текст сообщения в кодировке UTF-8
     * @param {string} from Имя отправителя (должно быть согласовано с администрацией). Если не заполнено, в качестве отправителя будет указан ваш отправитель по умолчанию.
     * В этом случае, параметры to и msg использовать не нужно: каждое сообщение передается в виде multi[номер получателя]=текст&multi[номер получателя]=текст
     * Если вы указываете несколько номеров и один из них указан неверно, то вместо идентификатора сообщения в выдаче вы получите трехзначный код ошибки.
     * @param {string} translit
     *
     */
    cost = (to, msg, from = null, translit = null) => {
        const formData = {
            api_id: this.api_key,
            to,
            msg,
            json: 1
        }
        if (from) formData.from = from
        if (translit) formData.translit = translit
        return zapros('sms', 'cost', formData)
    }

    /**
     * Получить информацию о балансе
     *
     */
    balance = () => {
        const formData = {
            api_id: this.api_key,
            json: 1
        }
        return zapros('my', 'balance', formData)
    }

    /**
     * Получить информацию о дневном лимите и его использовании
     *
     */
    limit = () => {
        const formData = {
            api_id: this.api_key,
            json: 1
        }
        return zapros('my', 'limit', formData)
    }

    /**
     * Получение списка одобренных отправителей
     *
     */
    senders = () => {
        const formData = {
            api_id: this.api_key,
            json: 1
        }
        return zapros('my', 'senders', formData)
    }

    /**
     * Получить информацию о бесплатных сообщениях и его использовании
     *
     */
    free = () => {
        const formData = {
            api_id: this.api_key,
            json: 1
        }
        return zapros('my', 'free', formData)
    }

    /**
     * Добавление номера в стоплист
     *
     * @param {string} stoplist_phone Номер телефона, который необходимо добавить в стоплист
     * @param {string} stoplist_text Примечание к номеру (причина добавления в стоплист)
     */
    stoplist_add = (stoplist_phone, stoplist_text) => {
        const formData = {
            api_id: this.api_key,
            stoplist_phone,
            stoplist_text,
            json: 1
        }
        return zapros('stoplist', 'add', formData)
    }

    /**
     * Удаление номера из стоплиста
     *
     * @param {string} stoplist_phone Номер телефона, который необходимо удалить из стоплиста
     */
    stoplist_del = (stoplist_phone) => {
        const formData = {
            api_id: this.api_key,
            stoplist_phone,
            json: 1
        }
        return zapros('stoplist', 'del', formData)
    }

    /**
     * Выгрузить весь стоплист
     *
     */
    stoplist_get = () => {
        const formData = {
            api_id: this.api_key,
            json: 1
        }
        return zapros('stoplist', 'get', formData)
    }

    /**
     * Добавить callback обработчик
     *
     * @param {string} url Адрес обработчика (должен начинаться на http://).
     */
    callback_add = (url) => {
        const formData = {
            api_id: this.api_key,
            url,
            json: 1
        }
        return zapros('callback', 'add', formData)
    }

    /**
     * Удалить callback обработчик
     *
     * @param {string} url Адрес обработчика (должен начинаться на http://).
     */
    callback_del = (url) => {
        const formData = {
            api_id: this.api_key,
            url,
            json: 1
        }
        return zapros('callback', 'del', formData)
    }

    /**
     * Выгрузить весь список обработчиков
     *
     */
    callback_get = () => {
        const formData = {
            api_id: this.api_key,
            json: 1
        }
        return zapros('callback', 'get', formData)
    }

    /**
     * Авторизовать пользователя по звонку с его номера
     *
     * @param {string} phone Номер телефона пользователя, который необходимо авторизовать (с которого мы будем ожидать звонок)
     */
    callcheck_add = (phone) => {
        const formData = {
            api_id: this.api_key,
            phone,
            json: 1
        }
        return zapros('callcheck', 'add', formData)
    }

    /**
     * Проверка статуса звонка
     *
     * @param {string} check_id Идентификатор авторизации, полученный от нас в первом примере
     */
    callcheck_status = (check_id) => {
        const formData = {
            api_id: this.api_key,
            check_id,
            json: 1
        }
        return zapros('callcheck', 'status', formData)
    }
}
