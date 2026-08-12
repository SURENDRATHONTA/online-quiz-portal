const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

const adminsList = [
    { name: "surendra", email: "surendrathonta@gmail.com", password: "surendra" },
    { name: "Admin Two", email: "admin2@example.com", password: "password123" },
    { name: "Admin Three", email: "admin3@example.com", password: "password123" },
    { name: "Admin Four", email: "admin4@example.com", password: "password123" },
    { name: "Admin Five", email: "admin5@example.com", password: "password123" }
];

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected for admin seeding...");

        for (let adminData of adminsList) {
            const existingUser = await User.findOne({ email: adminData.email });
            if (existingUser) {
                console.log(`User ${adminData.email} already exists. Skipping.`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(adminData.password, 10);

            await User.create({
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword,
                role: "admin",
                isVerified: true
            });

            console.log(`✅ Created admin: ${adminData.email}`);
        }

        console.log("All team admins seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedAdmins();