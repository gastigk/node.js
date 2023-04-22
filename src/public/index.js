let socket;
let user = '';
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: 'Chat de Lonne Open',
    input: 'text',
    text: 'Ingrese su Nombre de Usuario para comenzar',
    inputValidator: value => {
        return !value.trim() && 'Por favor ingrese su Nombre de Usuario'
    },
    allowOutsideClick: false
})
    .then(result => {
        user = result.value;
        document.getElementById('username').innerHTML = user;
        socket = io({
            query: {
                user
            }
        });

        socket.on('newUser', (user) => {

            if (user !== socket.id) {
                Swal.fire({
                    html: `Se ha conectado el Usuario: ${user}`,
                    toast: true,
                    position: "top-right",
                    icon: 'question',
                    timer: 10000,
                    timerProgressBar: true,
                });
            }
        });

        chatBox.addEventListener('keyup', evt => {
            if (evt.key === "Enter") {
                if (chatBox.value.trim().length > 0) {
                    socket.emit('message', {
                        user,
                        message: chatBox.value
                    });
                }
                chatBox.value = "";
            }
        });

        socket.on('history', data => {
            let history = document.getElementById('history');
            let messages = '';
            data.reverse().forEach(item => {
                messages += `<p>[<i>${item.user}</i>] Dice: ${item.message}<br />`;
            });
            history.innerHTML = messages;
        });
    });
