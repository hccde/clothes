let password = require('../password.js');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '1076663958@qq.com',
        pass: password.mail.password
    }
});

// setup email data with unicode symbols
function send(obj,str=''){
    let mailOptions = {
    from: '1076663958@qq.com', // sender address
    to: '1076663958@qq.com', // list of receivers
    subject: 'work finished', // Subject line
    text: 'Hello Master,I have finished my work', // plain text body
    html: (!str || str.length === 0) ? `<b>Hello Master,I have finished my work</b>
                <p>it's ${new Date()}</p>
                <br>
                <br>
                We have created  <strong> ${obj.createdNum} </strong>  goods items
                <br>
                And we have updated  <strong>  ${obj.updateNum} </strong> goods items
                <br>
                Here is part of warnLog and errorLog
                <h5>[error] ${obj.errorNum}</h5>
                ${obj.errorText}
                <br>
                 <h5>[warn] ${obj.warnNum}</h5>
                 ${obj.warnText}
                <br>
           <br>May you day`:'some error happened,I cant work correctly!'+ str
    };
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        //send a simpe mail
        if(str !== ''){ //avoid loop forever
            return false;
        }
        console.log(error);
        return send({},error.toString());
        
    }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

module.exports = {
    send
}