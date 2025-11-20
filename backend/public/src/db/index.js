import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import { createRequire } from "module";
import ConversationModelDefault from "./models/conversations.model.js";

dotenv.config();

// Create require for CommonJS modules
const require = createRequire(import.meta.url);

// Initialize Sequelize connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Load all models
const UserModel = require("./models/user.cjs");
const CallHistoryModel = require("./models/call.history.model.cjs");
const ConversationModel = ConversationModelDefault;

// Initialize models
// Note: Conversation model uses Sequelize (capital S) instead of DataTypes
const User = UserModel(sequelize, DataTypes);
const Conversation = ConversationModel(sequelize, Sequelize);
const CallHistory = CallHistoryModel(sequelize, DataTypes);

// Define associations
const models = {
    User,
    Conversation,
    CallHistory
};

// Set up associations if models have associate method
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Export sequelize instance and models
export { sequelize, models, User, Conversation, CallHistory };
export default {
    sequelize,
    User,
    Conversation,
    CallHistory
};

