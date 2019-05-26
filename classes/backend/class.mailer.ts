import * as nodemailer from 'nodemailer'



class Mailer {
    

    constructor() {
        let trans = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 465,
            secure: true,
            auth: {
                user: "apikey",
                pass:"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"
            }
        });

    }


}