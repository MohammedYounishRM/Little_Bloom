export const formatUserResponse = (userRow) => {
    if (!userRow) return null;
    
    const formatted = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        phone: userRow.phone,
        center_name: userRow.center_name,
        center_id: userRow.center_id,
        lastLogin: userRow.lastLogin,
        isVerified: userRow.isVerified,
        createdAt: userRow.createdAt,
        updatedAt: userRow.updatedAt
    };
    return formatted;
};