import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;
  private twilioClient: any;

  constructor(private configService: ConfigService) {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Initialize Twilio client (if configured)
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN
    ) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
        );
        this.logger.log('✅ Twilio initialized for WhatsApp notifications');
      } catch (error) {
        this.logger.warn('⚠️ Twilio not configured - WhatsApp disabled');
      }
    } else {
      this.logger.warn('⚠️ TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set - WhatsApp disabled');
    }
  }

  async sendTicketNotificationEmail(
    supportEmail: string,
    ticketData: {
      id: string;
      title: string;
      description?: string;
      priority: string;
      createdBy: string;
    },
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@helptidesk.com',
        to: supportEmail,
        subject: `[${ticketData.priority}] Nuevo Ticket: ${ticketData.title}`,
        html: `
          <h2>Nuevo Ticket de Soporte</h2>
          <p><strong>ID:</strong> ${ticketData.id}</p>
          <p><strong>Título:</strong> ${ticketData.title}</p>
          <p><strong>Prioridad:</strong> <span style="color: ${this.getPriorityColor(ticketData.priority)}">${ticketData.priority}</span></p>
          <p><strong>Descripción:</strong> ${ticketData.description || 'N/A'}</p>
          <p><strong>Creado por:</strong> ${ticketData.createdBy}</p>
          <p>Por favor, revisa el ticket en la plataforma.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email notification sent to ${supportEmail}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email: ${error.message}`);
    }
  }

  async sendTicketNotificationWhatsApp(
    phoneNumber: string,
    ticketData: {
      id: string;
      title: string;
      priority: string;
    },
  ): Promise<void> {
    try {
      if (!this.twilioClient) {
        this.logger.warn('⚠️ Twilio not configured - skipping WhatsApp');
        return;
      }

      const message = `🎫 *Nuevo Ticket de Soporte*

📌 *Título:* ${ticketData.title}
🔴 *Prioridad:* ${ticketData.priority}
🆔 *ID:* ${ticketData.id}

Por favor revisa el ticket en la plataforma.`;

      await this.twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
      });

      this.logger.log(`✅ WhatsApp notification sent to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send WhatsApp: ${error.message}`);
    }
  }

  private getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      URGENT: '#dc3545',
      HIGH: '#fd7e14',
      MEDIUM: '#ffc107',
      LOW: '#28a745',
    };
    return colors[priority] || '#000000';
  }
}
