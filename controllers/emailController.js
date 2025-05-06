const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendVerificationEmail = async (email, nombre, token) => {
    const verificationUrl = `http://localhost:3001/auth/verify-email/${token}`;

    const emailData = {
        sender: { name: 'KidsTube', email: 'TU_CORREO_REMITE@gmail.com' },
        to: [{ email: email, name: nombre }],
        subject: 'Verifica tu cuenta en KidsTube',
        htmlContent: `
      <h1>Hola, ${nombre} 👋</h1>
      <p>Gracias por registrarte en KidsTube.</p>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationUrl}">Verificar mi cuenta</a>
      <p>Si tú no hiciste esta solicitud, puedes ignorar este correo.</p>
    `
    };

    try {
        await apiInstance.sendTransacEmail(emailData);
        console.log('Correo de verificación enviado');
    } catch (error) {
        console.error('Error al enviar correo de verificación:', error);
    }
};

module.exports = { sendVerificationEmail };