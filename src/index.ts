(() => {
    //junta todas as plataformas que podem notificar e coloca no Array
    enum NotificationPlataform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }

    enum viewMode{
        TODO = 'TODO',
        REMINDER = 'REMINDER',
    }

    const UUID = (): string => {
        return Math.random().toString(32).substr(2, 9);
    };

    //Formata a vizualização da data
    const DateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },

        today(): Date {
            return new Date();
        },


        formatDate(date: Date): string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        },
    };
    //interface genérica que serve para todo e reminder
    interface Task {
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }

    class Reminder implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        date: Date = DateUtils.tomorrow();
        notifications: Array<NotificationPlataform> = [NotificationPlataform.EMAIL];

        constructor(description: string, date: Date, notifications: Array<NotificationPlataform>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string{
            return `
            ---> Lembrete <---
            Descrição: ${this.description}
            Data: ${DateUtils.formatDate(this.date)}
            Plataforma: ${this.notifications.join(', ')}
            `;
        }    
    }

    class Todo implements Task  {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        done: boolean = false;

        constructor(description: string) {
            this.description = description;
        }
        render(): string {
            return `
            ---> Tarefa <---
            Descrição: ${this.description}
            Finalizada: ${this.done ? 'Sim' : 'Não'}
            `;
        }
    }
    //representa oque é um todo e um reminder
    const todo = new Todo('Tarefa criada com a classe');

    const reminder = new Reminder('Lembrete criado com a classe', new Date(), [NotificationPlataform.EMAIL]);

    

    //ponto em que o codigo renderiza os todos e reminders
    const taskView = {
        //Extrai os valores digitados nos formulários e cria-los dentro do objeto tasks
        getTodo(form: HTMLFormElement): Todo {
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },

        getReminder(form: HTMLFormElement): Reminder {
            console.log('Valores do formulário:', {
                notificação: form.notification.value,
                data: form.scheduleDate.value,
                descrição: form.reminderDescription.value
            });
            
            const reminderNotifications = [
                form.notification.value as NotificationPlataform,
            ];
            const reminderDate = new Date(form.scheduleDate.value);
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        //recebe lista das tasks
        render(tasks: Array<Task>, mode: viewMode) {
            const tasksList = document.getElementById('tasksList');
            //limpa a lista de tasks 
            while(tasksList?.firstChild) {
                tasksList?.removeChild(tasksList.firstChild);
            }
            //cria lista de tasks
            tasks.forEach((task) => {
                const li = document.createElement('li');
                const textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList?.appendChild(li);
            });

            //comfig do switch
            const todoSet = document.getElementById('todoSet');
            const reminderSet = document.getElementById('reminderSet');

            if (mode === viewMode.TODO) {
                todoSet?.setAttribute('style', 'display: block');
                todoSet?.removeAttribute('disabled');
                reminderSet?.setAttribute('style', 'display: none');
                reminderSet?.setAttribute('disabled', 'true');
            } else {
                reminderSet?.setAttribute('style', 'display: block');
                reminderSet?.removeAttribute('disabled');
                todoSet?.setAttribute('style', 'display: none');
                todoSet?.setAttribute('disabled', 'true');
            }
        },
    };
    //garante quando a view deve renderizar e tambem armazenar em memoria dentro do navegador as nossas tasks
    const taskController = (view: typeof taskView) => {
        const tasks: Array<Task> = [];
        let mode: viewMode = viewMode.TODO;

        const handleEvent = (event: Event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            switch (mode as viewMode) {
                case viewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case viewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        }

        //Função que alterna entre todo e remind
        const handleToggleMode = () => {
            switch (mode as viewMode) {
                case viewMode.TODO:
                    mode = viewMode.REMINDER;
                    break;
                case viewMode.REMINDER:
                    mode = viewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };

        document
            .getElementById('toggleMode')
            ?.addEventListener('click', handleToggleMode);

        document.getElementById('taskForm')?.addEventListener('submit', handleEvent);
    };
    taskController(taskView);

}) ();