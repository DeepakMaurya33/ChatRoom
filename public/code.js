document.addEventListener('DOMContentLoaded', function() {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length === 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
        console.log(`User ${username} joined the chat`);
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
        console.log(`Message sent: ${message}`);
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
        console.log(`User ${uname} exited the chat`);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (!messageContainer) {
            console.error('Message container not found');
            return;
        }

        let el = document.createElement("div");
        if (type === "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    socket.on("update", function(updateMessage) {
        renderMessage("update", updateMessage);
        console.log(`Update: ${updateMessage}`);
    });

    socket.on("chat", function(message) {
        if (message.username !== uname) { // Only render if the message is from a different user
            renderMessage("other", message);
        }
        console.log(`Received message from ${message.username}: ${message.text}`);
    });
});