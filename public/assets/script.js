const chatForm = document.querySelector('#chat-form');
const messagesCon = document.querySelector('#messages');
const name = 'Saint Lion';

const dateSent = new Date();
const body = document.querySelector('#body');

console.log('date', dateSent);
let typingText = document.querySelector(".typing-text");
let sent = document.querySelector('.sent');
sent.textContent = 'Sent'


// socket connection
const socket = io.connect('http://localhost:3500/');

socket.on('chat', function(data) {
    console.log(data);
});

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (body.value === "") {
        alert('Please fill in the box')
    } else {

        let message = {
            body: body.value,
            name: name
        }

        socket.emit('message', message);
        socket.on('message', function(data) {
            console.log('we got it back', data);

            const demo = `
            <div class=" col-11 chat-box">
                <div class="chat-box-inner">
            <h4>${data.name}<span> Tody</span></h4>
                    <div class="card">
                        <div class="card-body">
                            <p>${data.body}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;

            const demo2 = `
            <div class=" col-11 chat-box">
                <div class="chat-box-inner">
            <h4>Solape <span> Tody</span></h4>
                    <div class="card">
                        <div class="card-body">
                            <p>${body.value}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;

            let you = document.createElement('div');
            you.classList.add('you', 'row');
            let me = document.createElement('div');
            me.classList.add('me', 'row');
            me.innerHTML = demo;
            you.innerHTML = demo2;;
            let success = messagesCon.appendChild(me);


            setTimeout(function() {
                typingText.style.visibility = 'visible';
            }, 1000);

            if (success) {
                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(function() {
                    messagesCon.appendChild(you);
                    window.scrollTo(0, document.body.scrollHeight);
                    typingText.style.visibility = 'hidden';
                }, 5000);
            }


        });






    }
});