const { User, Conversation } = require('../db/models');

class WhatsAppService {
    
    /**
     * Find or create a user when they send a message
     * @param {Object} contactData - Contact data from WhatsApp webhook
     * @returns {Promise<Object>} User object
     */
    static async findOrCreateUser(contactData) {
        const { phoneNumber, name, whatsapp_id, profile_picture } = contactData;
        
        try {
            // First, try to find existing user by phone number
            let user = await User.findOne({
                where: { phoneNumber: phoneNumber }
            });
            
            if (!user) {
                // Create new user if not found
                user = await User.create({
                    phoneNumber: phoneNumber,
                    name: name || null,
                    whatsapp_id: whatsapp_id || null,
                    profile_picture: profile_picture || null,
                    firstContactAt: new Date(),
                    lastMessageAt: new Date(),
                    totalMessages: 1,
                    isActive: true
                });
                console.log(`New user created: ${user.id} - ${user.phoneNumber}`);
            } else {
                // Update existing user's last message time and increment count
                await user.update({
                    lastMessageAt: new Date(),
                    totalMessages: user.totalMessages + 1,
                    name: name || user.name, // Update name if provided
                    profile_picture: profile_picture || user.profile_picture
                });
                console.log(`Existing user found: ${user.id} - ${user.phoneNumber}`);
            }
            
            return user;
        } catch (error) {
            console.error('Error in findOrCreateUser:', error);
            throw error;
        }
    }
    
    /**
     * Save a conversation message
     * @param {Object} messageData - Message data from WhatsApp webhook
     * @param {Number} userId - User ID from users table
     * @returns {Promise<Object>} Conversation object
     */
    static async saveConversation(messageData, userId) {
        const {
            sender_id,
            receiver_id,
            whatsapp_message_id,
            message_type,
            message_content,
            sender_type,
            receiver_type,
            status,
            thread_id,
            contact_name,
            contact_phone,
            contact_wa_id
        } = messageData;
        
        try {
            const conversation = await Conversation.create({
                user_id: userId,
                sender_id: sender_id,
                receiver_id: receiver_id,
                whatsapp_message_id: whatsapp_message_id,
                message_type: message_type,
                message_content: message_content,
                sender_type: sender_type,
                receiver_type: receiver_type,
                status: status,
                thread_id: thread_id,
                contact_name: contact_name,
                contact_phone: contact_phone,
                contact_wa_id: contact_wa_id,
                is_sent_to_contact: sender_type === 'agent',
                is_delivered_to_contact: false,
                is_read_by_contact: false,
                is_read: false,
                is_failed: false
            });
            
            console.log(`Conversation saved: ${conversation.id} for user: ${userId}`);
            return conversation;
        } catch (error) {
            console.error('Error in saveConversation:', error);
            throw error;
        }
    }
    
    /**
     * Get user's conversation history
     * @param {Number} userId - User ID
     * @param {Number} limit - Number of messages to retrieve
     * @returns {Promise<Array>} Array of conversations
     */
    static async getUserConversations(userId, limit = 50) {
        try {
            const conversations = await Conversation.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                limit: limit,
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'phoneNumber']
                }]
            });
            
            return conversations;
        } catch (error) {
            console.error('Error in getUserConversations:', error);
            throw error;
        }
    }
    
    /**
     * Get user by phone number
     * @param {String} phoneNumber - Phone number
     * @returns {Promise<Object|null>} User object or null
     */
    static async getUserByPhone(phoneNumber) {
        try {
            const user = await User.findOne({
                where: { phoneNumber: phoneNumber }
            });
            
            return user;
        } catch (error) {
            console.error('Error in getUserByPhone:', error);
            throw error;
        }
    }
    
    /**
     * Process incoming WhatsApp message
     * @param {Object} webhookData - Complete webhook data from WhatsApp
     * @returns {Promise<Object>} Processed result
     */
    static async processIncomingMessage(webhookData) {
        try {
            // Extract contact and message data from webhook
            const contact = webhookData.entry[0].changes[0].value.contacts?.[0];
            const message = webhookData.entry[0].changes[0].value.messages?.[0];
            
            if (!contact || !message) {
                throw new Error('Invalid webhook data: missing contact or message');
            }
            
            // Find or create user
            const user = await this.findOrCreateUser({
                phoneNumber: contact.wa_id,
                name: contact.profile?.name,
                whatsapp_id: contact.wa_id,
                profile_picture: contact.profile?.picture
            });
            
            // Prepare message data
            const messageData = {
                sender_id: message.from,
                receiver_id: message.to,
                whatsapp_message_id: message.id,
                message_type: message.type,
                message_content: message.text?.body || message.image?.caption || '',
                sender_type: 'contact',
                receiver_type: 'agent',
                status: 'received',
                thread_id: null, // You can implement threading logic here
                contact_name: contact.profile?.name,
                contact_phone: contact.wa_id,
                contact_wa_id: contact.wa_id
            };
            
            // Save conversation
            const conversation = await this.saveConversation(messageData, user.id);
            
            return {
                user: user,
                conversation: conversation,
                success: true
            };
            
        } catch (error) {
            console.error('Error in processIncomingMessage:', error);
            throw error;
        }
    }
}

module.exports = WhatsAppService;
