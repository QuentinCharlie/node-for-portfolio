var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');

var transport = {
    host: 'smtp-in.orange.fr', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var lang = req.body.lang;
  var content = `name: ${name} \n email: ${email} \n message: ${message} `;

  var mail = {
    from: email,
    to: 'quentin.box@orange.fr',  // Change to email address that you want to receive messages on
    subject: 'Portfolio : Nouveau message !',
    text: content
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } 
    else {
      res.json({
       status: 'success'
      })

      transporter.sendMail({
    	from: "noreply",
    	to: email,
    	subject: lang === "fr" ? "Votre message pour Quentin Charlie a été envoyé !" : "Your message to Quentin Charlie was sent !",
        text: lang === "fr" ? `Merci de m'avoir contacté ! Si votre message nécessite une réponse de ma part (suite à une question ou autre), je ferais au plus vite !
        \n\n
        Ce que vous m'avez envoyé :\n
         - Nom : ${name}\n
         - Email: ${email}\n
         - Message: ${message}
        \n\n
        Ceci est un message automatique.` 
        :
        `Thank you for contacting me ! If your message need a response from me (question or anything), i'll try to answer you ASAP !
        \n\n
        This is what you sent me :\n 
         - Name: ${name}\n
         - Email: ${email}\n
         - Message: ${message}
        \n\n
        This is an automated message.`
      },
      function(error, info){
    	if(error) {
      	    console.log(error);
        } 
        else {
      	    console.log('Message sent: ' + info.response);
    	}
      });
    }
  });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(3002);