const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const PlaidItem = require("../models/Plaid");

const migrateSchema = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        const allItems = await PlaidItem.find({}).select("+encryptedAccessToken");
        console.log(`Found ${allItems.length} PlaidItem documents to migrate`);

        for (const item of allItems) {
            if (!item.items || item.items.length === 0) {
                if (item.plaidItemId && item.encryptedAccessToken) {
                    const updatedItem = await PlaidItem.findByIdAndUpdate(
                        item._id,
                        {
                            $set: {
                                items: [
                                    {
                                        plaidItemId: item.plaidItemId,
                                        encryptedAccessToken: item.encryptedAccessToken,
                                        institutionName: item.institutionName || "Unknown",
                                        institutionId: null,
                                        createdAt: item.createdAt || new Date()
                                    }
                                ],
                                updatedAt: new Date()
                            },
                            $unset: {
                                plaidItemId: "",
                                encryptedAccessToken: "",
                                institutionName: ""
                            }
                        },
                        { new: true }
                    );
                    console.log(`✓ Migrated user ${updatedItem.userId}`);
                }
            } else {
                console.log(`✓ Already migrated user ${item.userId}`);
            }
        }

        console.log("✓ Migration completed successfully!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("✗ Migration failed:", error.message);
        process.exit(1);
    }
};

migrateSchema();
