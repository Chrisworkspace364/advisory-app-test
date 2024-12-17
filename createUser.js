const bcrypt = require('bcryptjs');
const sequelize = require('./models/database');
const User = require('./models/User');

(async () => {
  try {
    // Encrypt the password
    const plaintextPassword = 'admin';
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role_type: 'a',
      password: hashedPassword,
    });

    console.log('User created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
})();
