import nodemailer from 'nodemailer';
import config from '../config';
// 메일발송 객체
const mailSender = {
    // 메일발송 함수
    sendGmail: function (param) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // 메일 보내는 곳
            auth: {
                user: config.mail.user, // 보내는 메일의 주소
                pass: config.mail.pass, // 보내는 메일의 비밀번호
            },
        });
        // 메일 옵션
        const mailOptions = {
            from: config.mail.user, // 보내는 메일의 주소
            to: param.toEmail, // 수신할 이메일
            subject: param.subject, // 메일 제목
            text: param.text, // plain text body
            html: param.html, //html body
            attachments: param.attachments,
        };

        // 메일 발송
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            transporter.close();
        });
    },
};

export default mailSender;
