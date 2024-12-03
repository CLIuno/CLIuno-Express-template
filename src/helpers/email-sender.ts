import dotenv from 'dotenv'
import mailer from 'nodemailer'

import logThisError from '@/helpers/error-logger'
interface MailOptions {
  from: any
  to: string
  subject: string
  html: string
  templates: {
    [key: string]: string
    resetPassword: string
    verifyEmail: string
  }
}

dotenv.config()

const smtp = mailer.createTransport({
  host: process.env.MAIL_HOST || 'localhost',
  port: parseInt(process.env.MAIL_PORT || '1025'),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

const mailOptions: MailOptions = {
  from: process.env.MAIL_FROM_ADDRESS,
  to: '',
  subject: '',
  html: '',
  templates: {
    resetPassword: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello,</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease; cursor: pointer;"
           onmouseover="this.style.backgroundColor='#0056b3';"
           onmouseout="this.style.backgroundColor='#007bff';">
          Reset Password
        </a>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,<br>Your Company Team</p>
      </div>
    `,
    verifyEmail: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello,</h2>
        <p>Thank you for registering. Click the button below to verify your email address:</p>
        <a href="${process.env.FRONTEND_URL}/auth/verify-email?token=" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease; cursor: pointer;"
           onmouseover="this.style.backgroundColor='#218838';"
           onmouseout="this.style.backgroundColor='#28a745';">
          Verify Email
        </a>
        <p>If you did not register for an account, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,<br>Your Company Team</p>
      </div>
    `
  }
}

const SEND = async (emailType: string, to: string, token: string, userId: string) => {
  smtp.sendMail(
    {
      ...mailOptions,
      to,
      html:
        mailOptions.templates[emailType]?.replace('token=', `token=${token}&userId=${userId}`) || ''
    },
    (error, info) => {
      if (!error) {
        logThisError(`Email sent: ${info.response}`)
      } else {
        logThisError(`Error sending email: ${error}`)
      }
      smtp.close()
    }
  )
}

export const sendEmail = {
  resetPassword: async (to: string, token: string, userId: string) => {
    await SEND('resetPassword', to, token, userId)
  },
  verifyEmail: async (to: string, token: string, userId: string) => {
    await SEND('verifyEmail', to, token, userId)
  }
}
