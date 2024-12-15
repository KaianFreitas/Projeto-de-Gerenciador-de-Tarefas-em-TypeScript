"use strict";
(function () {
    //junta todas as plataformas que podem notificar e coloca no Array
    var NotificationPlataform;
    (function (NotificationPlataform) {
        NotificationPlataform["SMS"] = "SMS";
        NotificationPlataform["EMAIL"] = "EMAIL";
        NotificationPlataform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificationPlataform || (NotificationPlataform = {}));
    var viewMode;
    (function (viewMode) {
        viewMode["TODO"] = "TODO";
        viewMode["REMINDER"] = "REMINDER";
    })(viewMode || (viewMode = {}));
    var UUID = function () {
        return Math.random().toString(32).substr(2, 9);
    };
    //Formata a vizualização da data
    var DateUtils = {
        tomorrow: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        today: function () {
            return new Date();
        },
        formatDate: function (date) {
            return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
        },
    };
    var Reminder = /** @class */ (function () {
        function Reminder(description, date, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.date = DateUtils.tomorrow();
            this.notifications = [NotificationPlataform.EMAIL];
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }
        Reminder.prototype.render = function () {
            return "\n            ---> Lembrete <---\n            Descri\u00E7\u00E3o: ".concat(this.description, "\n            Data: ").concat(DateUtils.formatDate(this.date), "\n            Plataforma: ").concat(this.notifications.join(', '), "\n            ");
        };
        return Reminder;
    }());
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            return "\n            ---> Tarefa <---\n            Descri\u00E7\u00E3o: ".concat(this.description, "\n            Finalizada: ").concat(this.done ? 'Sim' : 'Não', "\n            ");
        };
        return Todo;
    }());
    //representa oque é um todo e um reminder
    var todo = new Todo('Tarefa criada com a classe');
    var reminder = new Reminder('Lembrete criado com a classe', new Date(), [NotificationPlataform.EMAIL]);
    //ponto em que o codigo renderiza os todos e reminders
    var taskView = {
        //Extrai os valores digitados nos formulários e cria-los dentro do objeto tasks
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            console.log('Valores do formulário:', {
                notificação: form.notification.value,
                data: form.scheduleDate.value,
                descrição: form.reminderDescription.value
            });
            var reminderNotifications = [
                form.notification.value,
            ];
            var reminderDate = new Date(form.scheduleDate.value);
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        //recebe lista das tasks
        render: function (tasks, mode) {
            var tasksList = document.getElementById('tasksList');
            //limpa a lista de tasks 
            while (tasksList === null || tasksList === void 0 ? void 0 : tasksList.firstChild) {
                tasksList === null || tasksList === void 0 ? void 0 : tasksList.removeChild(tasksList.firstChild);
            }
            //cria lista de tasks
            tasks.forEach(function (task) {
                var li = document.createElement('li');
                var textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList === null || tasksList === void 0 ? void 0 : tasksList.appendChild(li);
            });
            //comfig do switch
            var todoSet = document.getElementById('todoSet');
            var reminderSet = document.getElementById('reminderSet');
            if (mode === viewMode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: block');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute('disabled');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: none');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('disabled', 'true');
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: block');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute('disabled');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: none');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('disabled', 'true');
            }
        },
    };
    //garante quando a view deve renderizar e tambem armazenar em memoria dentro do navegador as nossas tasks
    var taskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = viewMode.TODO;
        var handleEvent = function (event) {
            event.preventDefault();
            var form = event.target;
            switch (mode) {
                case viewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case viewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        //Função que alterna entre todo e remind
        var handleToggleMode = function () {
            switch (mode) {
                case viewMode.TODO:
                    mode = viewMode.REMINDER;
                    break;
                case viewMode.REMINDER:
                    mode = viewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document
            .getElementById('toggleMode')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleToggleMode);
        (_b = document.getElementById('taskForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', handleEvent);
    };
    taskController(taskView);
})();
