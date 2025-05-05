const axios = require('axios');

const API_URL = 'https://api.mailersend.com/v1/email';

async function enviarCorreoBienvenida(nombre, destinatario) {
    try {
        const response = await axios.post(API_URL, {
            from: {
                email: 'prueba-86org8ee56egew13.mlsender.net',
                name: 'Gestión Académica'
            },
            to: [
                {
                    email: destinatario,
                    name: nombre
                }
            ],
            subject: '¡Bienvenido a la plataforma!',
            text: `Hola ${nombre}, gracias por registrarte.`,
            html: `<p>Hola <strong>${nombre}</strong>, gracias por registrarte en nuestra plataforma de gestión académica.</p>`
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Correo enviado con éxito:', response.status);
    } catch (error) {
        console.error('Error al enviar el correo:', error.response?.data || error.message);
    }
}

module.exports = { enviarCorreoBienvenida };
