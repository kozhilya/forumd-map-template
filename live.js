const liveServer = require("live-server");
 
var params = {
    port: 8181,         // Установка порта
    host: "0.0.0.0",    // IP-адрес, на которую будет ссылка
    root: "./public",   // Корневая папка
    open: false,        // Не открывать браузер при запуске локального сервера
    file: "index.html", // Файл по умолчанию
    wait: 1000,         // Ожидание перед перезагрузкой после изменения файла
    logLevel: 2,        // Писать все сообщения
};
 
liveServer.start(params); 
