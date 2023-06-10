let socket = io();
let user = '';
let chatBox = document.getElementById('chatBox');

Swal.fire({
  title: 'Authentication',
  input: 'text',
  text: 'Set username for the chat',
  inputValidator: (value) => {
    return !value.trim() && 'Please. Write a username!';
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  document.getElementById('username').innerHTML = user;
  socket = io({
    query: {
      user,
    },
  });
});

socket.on('newUser', (user) => {
  if (user !== socket.id) {
    Swal.fire({
      html: `user ${user} - connected`,
      toast: true,
      position: 'top-right',
      icon: 'question',
      timer: 5000,
      timerProgressBar: true,
    });
  }
});

chatBox.addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', {
        user,
        message: chatBox.value,
      });
    }
    chatBox.value = '';
  }
});

socket.on('history', (data) => {
  let history = document.getElementById('history');
  let messages = '';
  data.reverse().forEach((item) => {
    messages += `<p>[<i>${item.user}</i>] say: ${item.message}<br />`;
  });
  history.innerHTML = messages;
});

// receive messages
socket.on('logs', (data) => {
  const divLog = document.getElementById('messageLogs');
  let messages = '';

  data.reverse().forEach((message) => {
    messages += `<p><i>${message.user}</i>: ${message.message}</p>`;
  });
  divLog.innerHTML = messages;
});