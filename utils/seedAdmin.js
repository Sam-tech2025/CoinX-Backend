const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const { app_configuration } = require('../config/app.config');

async function seed() {
    const uri = app_configuration.MONGO_DETAILS;
    if (!uri) throw new Error('MONGO_URI not set');
    await mongoose.connect(uri);


    const email = process.env.ADMIN_EMAIL;
    const pwd = process.env.ADMIN_PASSWORD;
    if (!email || !pwd) throw new Error('ADMIN_EMAIL/ADMIN_PASSWORD must be set');


    const existing = await userModel.findOne({ email });
    if (existing) {
        console.log('Admin already exists');
        process.exit(0);
    }


    const hash = await bcrypt.hash(pwd, 10);
    const u = new userModel({ email, passwordHash: hash, role: 'super-admin' });
    await u.save();
    console.log('Admin created');
    process.exit(0);
}


seed().catch(err => { console.error(err); process.exit(1); });