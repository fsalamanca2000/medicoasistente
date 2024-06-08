const video = document.getElementById('video');
const input = document.getElementById('input');
const responses = document.getElementById('responses');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing media devices.', err);
    });

    function sendMessage() {
        const inputBox = document.getElementById('inputBox');
        const chatbox = document.getElementById('chatbox');
        const userMessage = inputBox.value;
        console.log(userMessage);
    
        if (userMessage.trim() === '') return;
    
        // Mostrar mensaje del usuario en el chatbox
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.textContent = userMessage;
        chatbox.appendChild(userDiv);
    
        // Limpiar el input
        inputBox.value = '';
        const url = "http://localhost:11434/api/generate";
        const headers = {
            "Content-Type": "application/json"
        };
        const data = {
            "prompt": "Responde como si fueras un médico: Tu texto aquí",
            "other_parameters": "Otros parámetros necesarios"
        };

        fetch('/chat', {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
        // Enviar mensaje al servidor utilizando fetch
        // fetch('/http_chat', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ question: userMessage }),
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     // Mostrar la respuesta del servidor en la interfaz de usuario
        //     const responseDiv = document.createElement('div');
        //     responseDiv.className = 'response';
        //     responseDiv.textContent = `Médico AI: ${data.response}`;
        //     chatbox.appendChild(responseDiv);
        // })
        // .catch(error => {
        //     console.error('Error sending message:', error);
        // });
    }
//otra opción
/*
$.ajax({
    type: "POST",
    url: "http://localhost:11434/api/generate", // Cambia el puerto si es diferente
    data: JSON.stringify(cuerpo),
    contentType: "application/json",
    xhrFields: {
        onprogress: function (e) {
            var response = e.currentTarget.response;
            var lines = response.split('\n');
            var respuestaAcumulada = ""; // Variable para acumular la respuesta
            lines.forEach(function (line) {
                if (line.trim() !== '') {
                    try {
                        var responseObject = JSON.parse(line);
                        if (responseObject && responseObject.response) {
                            respuestaAcumulada += responseObject.response + " "; // Acumular la respuesta
                            $("#textaRespuesta").val(respuestaAcumulada); // Mostrar la respuesta acumulada en el textarea mientras se recibe
                        }
                    } catch (e) {
                        console.error("Error parsing line: ", line);
                    }
                }
            });
        }
    }
});
*/