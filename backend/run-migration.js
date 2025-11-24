import { sequelize } from './public/src/db/index.js';

async function runMigration() {
  try {
    console.log('Running migration to remove username unique constraint...');
    
    // Find and drop unique indexes on username
    const [indexes] = await sequelize.query(
      `SHOW INDEX FROM auth_users WHERE Column_name = 'username' AND Non_unique = 0`
    );
    
    console.log('Found unique indexes:', indexes);
    
    for (const index of indexes) {
      await sequelize.query(
        `ALTER TABLE auth_users DROP INDEX \`${index.Key_name}\``
      );
      console.log(`Dropped index: ${index.Key_name}`);
    }

    // Remove unique constraint from username column
    await sequelize.query(
      `ALTER TABLE auth_users MODIFY COLUMN username VARCHAR(255) NOT NULL COMMENT 'Username for authentication'`
    );
    console.log('Modified username column to remove unique constraint');

    // Add non-unique index on username for performance
    await sequelize.query(
      `CREATE INDEX idx_auth_users_username ON auth_users(username)`
    );
    console.log('Added non-unique index on username');

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

