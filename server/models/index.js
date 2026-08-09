const User = require('./User');
const Listing = require('./Listing');
const Roommate = require('./Roommate');
const Chat = require('./Chat');
const Message = require('./Message');
const Review = require('./Review');
const Payment = require('./Payment');

// User <-> Listing (1:N)
User.hasMany(Listing, { foreignKey: 'userId', as: 'listings' });
Listing.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

// User (Buyer) <-> Listing (1:N)
User.hasMany(Listing, { foreignKey: 'buyerId', as: 'boughtListings' });
Listing.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

// User (Reserver) <-> Listing (1:N)
User.hasMany(Listing, { foreignKey: 'reservedBy', as: 'reservedListings' });
Listing.belongsTo(User, { foreignKey: 'reservedBy', as: 'reserver' });

// User <-> Roommate (1:N)
User.hasMany(Roommate, { foreignKey: 'userId', as: 'roommatePosts' });
Roommate.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User <-> Chat (User1 & User2)
User.hasMany(Chat, { foreignKey: 'user1Id', as: 'chatsAsUser1' });
User.hasMany(Chat, { foreignKey: 'user2Id', as: 'chatsAsUser2' });
Chat.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Chat.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

// Chat <-> Message (1:N)
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

// Chat <-> Listing (1:1/1:N)
Chat.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
Listing.hasMany(Chat, { foreignKey: 'listingId', as: 'chats' });

// User <-> Message (Sender & Receiver)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Review Associations (Reviewer & TargetUser)
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'givenReviews' });
User.hasMany(Review, { foreignKey: 'targetUserId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });

// User <-> Payment (1:N)
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId' });

// Listing <-> Payment (1:N)
Listing.hasMany(Payment, { foreignKey: 'listingId', as: 'payments' });
Payment.belongsTo(Listing, { foreignKey: 'listingId' });

module.exports = {
  User,
  Listing,
  Roommate,
  Chat,
  Message,
  Review,
  Payment,
};
