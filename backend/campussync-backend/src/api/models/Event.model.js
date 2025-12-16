const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        venue: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            defaultValue: 'General'
        },
        organizer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        registeredCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
            defaultValue: 'upcoming'
        }
    });

    return Event;
};