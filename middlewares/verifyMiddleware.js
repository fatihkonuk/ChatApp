const nodemailer = require('nodemailer');

const sendCode = async (req,res,next) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: "no1.fatih@gmail.com",
              pass: "rslftqlafzkuvfxw",
            },
        });
        const code = Math.floor(Math.random() * (10000 - 1000)) + 1000;
        const mailOptions = {
            from: 'chatapp@gmail.com',
            to: req.body.email,
            subject: 'Verify',
            html: `Verify Code: ${code}`
        }
        await transporter.sendMail(mailOptions);

        req.session.verifyCode = code;
        req.session.verifyUser = req.body;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}

const checkCode = (req,res,next) => {
    if (req.session.verifyCode == req.body.verifyCode) {
        next();
    }else {
        res.status(400).send('Kod Hatalı');
    }
}

module.exports = {
    sendCode,
    checkCode
}