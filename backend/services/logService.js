const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const logActivity = async (action, file_name) => {
    await prisma.activity_logs.create({
        data: {
            action,
            file_name
        }
    });
};

module.exports = logActivity;