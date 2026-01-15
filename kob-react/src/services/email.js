/**
 * Email Service - Notification System
 * Sends transactional emails for orders, support, etc.
 * 
 * In production, this would integrate with SendGrid, Mailgun, or Firebase Functions
 * For now, this is a template service that logs to console
 * 
 * Environment variables required:
 * - VITE_EMAIL_SERVICE_URL (backend endpoint for sending emails)
 */

export class EmailService {
  constructor() {
    this.serviceUrl = import.meta.env.VITE_EMAIL_SERVICE_URL
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(email, orderDetails) {
    try {
      const emailData = {
        to: email,
        templateId: 'order_confirmation',
        data: {
          orderNumber: orderDetails.orderId,
          totalAmount: orderDetails.totalAmount,
          productTitle: orderDetails.productTitle,
          sellerName: orderDetails.sellerName,
          sellerEmail: orderDetails.sellerEmail,
          orderDate: new Date().toLocaleDateString('en-NG'),
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Order confirmation sent' }
    } catch (error) {
      console.error('Error sending order confirmation:', error)
      throw error
    }
  }

  /**
   * Send seller notification about new order
   */
  async sendSellerNotification(sellerEmail, orderDetails) {
    try {
      const emailData = {
        to: sellerEmail,
        templateId: 'seller_new_order',
        data: {
          orderNumber: orderDetails.orderId,
          productTitle: orderDetails.productTitle,
          buyerName: orderDetails.buyerName,
          buyerEmail: orderDetails.buyerEmail,
          amount: orderDetails.totalAmount,
          orderDate: new Date().toLocaleDateString('en-NG'),
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Seller notification sent' }
    } catch (error) {
      console.error('Error sending seller notification:', error)
      throw error
    }
  }

  /**
   * Send support request confirmation
   */
  async sendSupportConfirmation(email, subject, ticketNumber) {
    try {
      const emailData = {
        to: email,
        templateId: 'support_confirmation',
        data: {
          subject,
          ticketNumber,
          submittedAt: new Date().toLocaleString('en-NG'),
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Support confirmation sent' }
    } catch (error) {
      console.error('Error sending support confirmation:', error)
      throw error
    }
  }

  /**
   * Send review notification to seller
   */
  async sendReviewNotification(sellerEmail, reviewDetails) {
    try {
      const emailData = {
        to: sellerEmail,
        templateId: 'new_review',
        data: {
          productTitle: reviewDetails.productTitle,
          rating: reviewDetails.rating,
          reviewText: reviewDetails.reviewText,
          reviewerName: reviewDetails.reviewerName,
          reviewDate: new Date().toLocaleDateString('en-NG'),
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Review notification sent' }
    } catch (error) {
      console.error('Error sending review notification:', error)
      throw error
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email, resetToken, resetLink) {
    try {
      const emailData = {
        to: email,
        templateId: 'password_reset',
        data: {
          resetLink,
          expiresIn: '24 hours',
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Password reset email sent' }
    } catch (error) {
      console.error('Error sending password reset email:', error)
      throw error
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(email, userName, userRole) {
    try {
      const emailData = {
        to: email,
        templateId: 'welcome',
        data: {
          userName,
          userRole,
          joinDate: new Date().toLocaleDateString('en-NG'),
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Welcome email sent' }
    } catch (error) {
      console.error('Error sending welcome email:', error)
      throw error
    }
  }

  /**
   * Send product listed notification
   */
  async sendProductListedNotification(sellerEmail, productDetails) {
    try {
      const emailData = {
        to: sellerEmail,
        templateId: 'product_listed',
        data: {
          productTitle: productDetails.title,
          productPrice: productDetails.price,
          productCategory: productDetails.category,
          listedAt: new Date().toLocaleString('en-NG'),
        },
      }

      await this.send(emailData)
      return { success: true, message: 'Product listing confirmation sent' }
    } catch (error) {
      console.error('Error sending product listing email:', error)
      throw error
    }
  }

  /**
   * Generic email send method
   * In production, this would call a backend API
   */
  async send(emailData) {
    // For development, log to console
    console.log('📧 Email would be sent:', emailData)

    // In production, uncomment and use:
    /*
    if (!this.serviceUrl) {
      throw new Error('Email service URL not configured')
    }

    const response = await fetch(this.serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return await response.json()
    */
  }

  /**
   * Queue email for later sending (useful for bulk operations)
   */
  async queueEmail(emailData) {
    console.log('📧 Email queued:', emailData)
    // Implementation would depend on backend queue system
  }

  /**
   * Get email template preview (for testing)
   */
  async getTemplatePreview(templateId, data) {
    const templates = {
      order_confirmation: this.orderConfirmationTemplate(data),
      seller_new_order: this.sellerOrderTemplate(data),
      support_confirmation: this.supportConfirmationTemplate(data),
      new_review: this.reviewTemplate(data),
      password_reset: this.passwordResetTemplate(data),
      welcome: this.welcomeTemplate(data),
      product_listed: this.productListedTemplate(data),
    }

    return templates[templateId] || 'Unknown template'
  }

  // Template generators
  orderConfirmationTemplate(data) {
    return `
      <h2>Order Confirmation - ${data.orderNumber}</h2>
      <p>Your order has been confirmed!</p>
      <p><strong>Product:</strong> ${data.productTitle}</p>
      <p><strong>Amount:</strong> ₦${data.totalAmount}</p>
      <p><strong>Seller:</strong> ${data.sellerName}</p>
      <p><strong>Date:</strong> ${data.orderDate}</p>
      <p>You can contact the seller at: ${data.sellerEmail}</p>
    `
  }

  sellerOrderTemplate(data) {
    return `
      <h2>New Order - ${data.orderNumber}</h2>
      <p>You have a new order!</p>
      <p><strong>Product:</strong> ${data.productTitle}</p>
      <p><strong>Buyer:</strong> ${data.buyerName}</p>
      <p><strong>Amount:</strong> ₦${data.amount}</p>
      <p><strong>Date:</strong> ${data.orderDate}</p>
      <p>Contact buyer at: ${data.buyerEmail}</p>
    `
  }

  supportConfirmationTemplate(data) {
    return `
      <h2>Support Request Received</h2>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Ticket:</strong> ${data.ticketNumber}</p>
      <p><strong>Submitted:</strong> ${data.submittedAt}</p>
      <p>We'll respond to your request within 24 hours.</p>
    `
  }

  reviewTemplate(data) {
    return `
      <h2>New Review on Your Product</h2>
      <p><strong>Product:</strong> ${data.productTitle}</p>
      <p><strong>Rating:</strong> ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</p>
      <p><strong>Review:</strong> ${data.reviewText}</p>
      <p><strong>By:</strong> ${data.reviewerName}</p>
      <p><strong>Date:</strong> ${data.reviewDate}</p>
    `
  }

  passwordResetTemplate(data) {
    return `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${data.resetLink}">Reset Password</a></p>
      <p>This link expires in ${data.expiresIn}</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  }

  welcomeTemplate(data) {
    return `
      <h2>Welcome to Katsina Online Business!</h2>
      <p>Hi ${data.userName},</p>
      <p>Thank you for joining us as a ${data.userRole}!</p>
      <p>Joined: ${data.joinDate}</p>
      <p>Start exploring the marketplace now!</p>
    `
  }

  productListedTemplate(data) {
    return `
      <h2>Your Product Has Been Listed!</h2>
      <p><strong>Product:</strong> ${data.productTitle}</p>
      <p><strong>Price:</strong> ₦${data.productPrice}</p>
      <p><strong>Category:</strong> ${data.productCategory}</p>
      <p><strong>Listed:</strong> ${data.listedAt}</p>
      <p>Your product is now visible to all buyers!</p>
    `
  }
}

// Create singleton instance
export const emailService = new EmailService()

/**
 * Helper function for sending emails from components
 */
export async function sendEmail(type, recipient, data) {
  try {
    switch (type) {
      case 'order_confirmation':
        return await emailService.sendOrderConfirmation(recipient, data)
      case 'seller_notification':
        return await emailService.sendSellerNotification(recipient, data)
      case 'support_confirmation':
        return await emailService.sendSupportConfirmation(recipient, data.subject, data.ticketNumber)
      case 'review_notification':
        return await emailService.sendReviewNotification(recipient, data)
      case 'password_reset':
        return await emailService.sendPasswordReset(recipient, data.token, data.link)
      case 'welcome':
        return await emailService.sendWelcomeEmail(recipient, data.name, data.role)
      case 'product_listed':
        return await emailService.sendProductListedNotification(recipient, data)
      default:
        throw new Error(`Unknown email type: ${type}`)
    }
  } catch (error) {
    console.error(`Error sending ${type} email:`, error)
    throw error
  }
}
