const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const config = require("../config/config");

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail_username,
        pass: config.gmail_password
    }
});
module.exports = function emailHandler(){
    this.sendConfirmation = function(id, email, hostname){
        let secret = id;
        const confirmationLink = 'https://' + hostname + '/verify/' + secret;
        const options={
            from: config.gmail_username,
            to: email,
            subject: config.site_url + ' Confirm your account',
            html: '<body class="body" style="font-family: -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, Helvetica, sans-serif; line-height: initial; max-width: 580px;" data-gr-c-s-loaded="true" cz-shortcut-listen="true"> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <title>Confirm your Lowkey email address</title> <style type="text/css"> @media (min-width: 500px){.avatar__media .media__fluid{margin-top: 3px !important;}}@media (min-width: 500px){.button,.button__shadow{font-size: 16px !important;display: inline-block !important;width: auto !important;}}@media (min-width: 500px){footer li{display: inline-block !important;margin-right: 20px !important;}}@media (min-width: 500px){.mt1--lg{margin-top: 10px !important;}}@media (min-width: 500px){.mt2--lg{margin-top: 20px !important;}}@media (min-width: 500px){.mt3--lg{margin-top: 30px !important;}}@media (min-width: 500px){.mt4--lg{margin-top: 40px !important;}}@media (min-width: 500px){.mb1--lg{margin-bottom: 10px !important;}}@media (min-width: 500px){.mb2--lg{margin-bottom: 20px !important;}}@media (min-width: 500px){.mb3--lg{margin-bottom: 30px !important;}}@media (min-width: 500px){.mb4--lg{margin-bottom: 40px !important;}}@media (min-width: 500px){.pt1--lg{padding-top: 10px !important;}}@media (min-width: 500px){.pt2--lg{padding-top: 20px !important;}}@media (min-width: 500px){.pt3--lg{padding-top: 30px !important;}}@media (min-width: 500px){.pt4--lg{padding-top: 40px !important;}}@media (min-width: 500px){.pb1--lg{padding-bottom: 10px !important;}}@media (min-width: 500px){.pb2--lg{padding-bottom: 20px !important;}}@media (min-width: 500px){.pb3--lg{padding-bottom: 30px !important;}}@media (min-width: 500px){.pb4--lg{padding-bottom: 40px !important;}}@media (min-width: 500px){pre{font-size: 14px !important;}.body{font-size: 14px !important; line-height: 24px !important;}h1{font-size: 22px !important;}h2{font-size: 16px !important;}small{font-size: 12px !important;}}@media (min-width: 500px){.user-content pre, .user-content code{font-size: 14px !important; line-height: 24px !important;}.user-content ul, .user-content ol, .user-content pre{margin-top: 12px !important; margin-bottom: 12px !important;}.user-content hr{margin: 12px 0 !important;}.user-content h1{font-size: 22px !important;}.user-content h2{font-size: 16px !important;}.user-content h3{font-size: 14px !important;}}</style> <h1 style="box-sizing: border-box; font-size: 1.25rem; margin: 0; margin-bottom: 0.5em; padding: 0;">Thanks for joining Lowkey World!</h1> <p style="box-sizing: border-box; margin: 0; margin-bottom: 0.5em; padding: 0;">Please confirm that your email address is correct to continue. Click the link below to get started.</p><p class="mt2 mb2 mt3--lg mb3--lg" style="box-sizing: border-box; margin: 0; margin-bottom: 20px; margin-top: 20px; padding: 0;"> <span class="button__shadow" style="border-bottom: 2px solid rgba(0,0,0,0.1); border-radius: 4px; box-sizing: border-box; display: block; width: 100%;"> <a class="button" href="' + confirmationLink + '"style="background: #204dd5; border: 1px solid #000; border-radius: 3px; box-sizing: border-box; color: white; display: block; font-size: 1rem; font-weight: 600; padding: 12px 20px; text-align: center; text-decoration: none; width: 100%;" target="_blank"> Confirm Email Address </a> </span></p><p class="db mb1 gray" style="box-sizing: border-box; color: #999; display: block; margin: 0; margin-bottom: 10px; padding: 0;">You may also enter your confirmation link:</p><p style="box-sizing: border-box; margin: 0; margin-bottom: 0.5em; padding: 0;"> </p><pre style="background: #f6f6f3; border: 1px solid #d8d7d4; border-radius: 3px; display: inline-block; font-family: monospace; font-size: 1rem; font-weight: 600; line-height: 1em; margin: 0; padding: 5px 8px;">' + confirmationLink + '</pre> <p></p><footer class="mt2 mt4--lg" style="border-top: 1px solid #D9D9D9; margin-top: 20px; padding: 20px 0;"> <ul style="box-sizing: border-box; list-style: none; margin: 0; margin-bottom: 0; padding: 0;"> <li style="box-sizing: border-box; margin: 0; margin-bottom: 10px; padding: 0;"> <small style="box-sizing: border-box; color: #999;"><a href="https://'+config.site_url+'" style="border-bottom: 1px solid #E6E6E6; box-sizing: border-box; color: inherit; text-decoration: none;" target="_blank">Lowkey World</a></small> </li><li style="box-sizing: border-box; margin: 0; margin-bottom: 10px; padding: 0;"> <small style="box-sizing: border-box; color: #999;"><a href="https://'+config.site_url+'/privacy-policy" style="border-bottom: 1px solid #E6E6E6; box-sizing: border-box; color: inherit; text-decoration: none;" target="_blank">Privacy</a></small> </li><li style="box-sizing: border-box; margin: 0; margin-bottom: 10px; padding: 0;"> <small style="box-sizing: border-box; color: #999;"><a href="https://'+config.site_url+'/terms-of-service" style="border-bottom: 1px solid #E6E6E6; box-sizing: border-box; color: inherit; text-decoration: none;" target="_blank">Terms</a></small> </li></ul> </footer></body>'
        }
        emailTransporter.sendMail(options, function(error, response){
            if(error){
                console.log('error: ' + error );
            }
            else{
                console.log('sent');
            }
        });
    };
    this.sendPasswordReset = function(id, email, passwordHash, hostname){
        let secret = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(5), null);
        const passwordRestLink = 'https://' + hostname + '/reset/' + secret + '/' + email;
        const options={
            from: config.gmail_username,
            to: email,
            subject: config.site_url + ' Reset your password',
            html: '<body class="body" style="font-family: -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, Helvetica, sans-serif; line-height: initial; max-width: 580px;" data-gr-c-s-loaded="true" cz-shortcut-listen="true"> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <title>Reset your '+config.site_url+' password</title> <style type="text/css"> @media (min-width: 500px){.avatar__media .media__fluid{margin-top: 3px !important;}}@media (min-width: 500px){.button,.button__shadow{font-size: 16px !important;display: inline-block !important;width: auto !important;}}@media (min-width: 500px){footer li{display: inline-block !important;margin-right: 20px !important;}}@media (min-width: 500px){.mt1--lg{margin-top: 10px !important;}}@media (min-width: 500px){.mt2--lg{margin-top: 20px !important;}}@media (min-width: 500px){.mt3--lg{margin-top: 30px !important;}}@media (min-width: 500px){.mt4--lg{margin-top: 40px !important;}}@media (min-width: 500px){.mb1--lg{margin-bottom: 10px !important;}}@media (min-width: 500px){.mb2--lg{margin-bottom: 20px !important;}}@media (min-width: 500px){.mb3--lg{margin-bottom: 30px !important;}}@media (min-width: 500px){.mb4--lg{margin-bottom: 40px !important;}}@media (min-width: 500px){.pt1--lg{padding-top: 10px !important;}}@media (min-width: 500px){.pt2--lg{padding-top: 20px !important;}}@media (min-width: 500px){.pt3--lg{padding-top: 30px !important;}}@media (min-width: 500px){.pt4--lg{padding-top: 40px !important;}}@media (min-width: 500px){.pb1--lg{padding-bottom: 10px !important;}}@media (min-width: 500px){.pb2--lg{padding-bottom: 20px !important;}}@media (min-width: 500px){.pb3--lg{padding-bottom: 30px !important;}}@media (min-width: 500px){.pb4--lg{padding-bottom: 40px !important;}}@media (min-width: 500px){pre{font-size: 14px !important;}.body{font-size: 14px !important; line-height: 24px !important;}h1{font-size: 22px !important;}h2{font-size: 16px !important;}small{font-size: 12px !important;}}@media (min-width: 500px){.user-content pre, .user-content code{font-size: 14px !important; line-height: 24px !important;}.user-content ul, .user-content ol, .user-content pre{margin-top: 12px !important; margin-bottom: 12px !important;}.user-content hr{margin: 12px 0 !important;}.user-content h1{font-size: 22px !important;}.user-content h2{font-size: 16px !important;}.user-content h3{font-size: 14px !important;}}</style> <h1 style="box-sizing: border-box; font-size: 1.25rem; margin: 0; margin-bottom: 0.5em; padding: 0;">Thanks for joining Lowkey World!</h1> <p style="box-sizing: border-box; margin: 0; margin-bottom: 0.5em; padding: 0;">If you did not try to reset your password ignore this email, else click the button to continue</p><p class="mt2 mb2 mt3--lg mb3--lg" style="box-sizing: border-box; margin: 0; margin-bottom: 20px; margin-top: 20px; padding: 0;"> <span class="button__shadow" style="border-bottom: 2px solid rgba(0,0,0,0.1); border-radius: 4px; box-sizing: border-box; display: block; width: 100%;"> <a class="button" href="' + passwordRestLink + '"style="background: #204dd5; border: 1px solid #000; border-radius: 3px; box-sizing: border-box; color: white; display: block; font-size: 1rem; font-weight: 600; padding: 12px 20px; text-align: center; text-decoration: none; width: 100%;" target="_blank"> Reset Password </a> </span></p><p class="db mb1 gray" style="box-sizing: border-box; color: #999; display: block; margin: 0; margin-bottom: 10px; padding: 0;">You may also enter your password reset link:</p><p style="box-sizing: border-box; margin: 0; margin-bottom: 0.5em; padding: 0;"> </p><pre style="background: #f6f6f3; border: 1px solid #d8d7d4; border-radius: 3px; display: inline-block; font-family: monospace; font-size: 1rem; font-weight: 600; line-height: 1em; margin: 0; padding: 5px 8px;">' + passwordRestLink + '</pre> <p></p><footer class="mt2 mt4--lg" style="border-top: 1px solid #D9D9D9; margin-top: 20px; padding: 20px 0;"> <ul style="box-sizing: border-box; list-style: none; margin: 0; margin-bottom: 0; padding: 0;"> <li style="box-sizing: border-box; margin: 0; margin-bottom: 10px; padding: 0;"> <small style="box-sizing: border-box; color: #999;"><a href="https://'+config.site_url+'" style="border-bottom: 1px solid #E6E6E6; box-sizing: border-box; color: inherit; text-decoration: none;" target="_blank">Lowkey World</a></small> </li><li style="box-sizing: border-box; margin: 0; margin-bottom: 10px; padding: 0;"> <small style="box-sizing: border-box; color: #999;"><a href="https://'+config.site_url+'/privacy-policy" style="border-bottom: 1px solid #E6E6E6; box-sizing: border-box; color: inherit; text-decoration: none;" target="_blank">Privacy</a></small> </li><li style="box-sizing: border-box; margin: 0; margin-bottom: 10px; padding: 0;"> <small style="box-sizing: border-box; color: #999;"><a href="https://'+config.site_url+'/terms-of-service" style="border-bottom: 1px solid #E6E6E6; box-sizing: border-box; color: inherit; text-decoration: none;" target="_blank">Terms</a></small> </li></ul> </footer></body>'
        }
        emailTransporter.sendMail(options, function(error, response){
            if(error){
                console.log('error: ' + error );
            }
            else{
                console.log('sent');
            }
        });
    }
}
