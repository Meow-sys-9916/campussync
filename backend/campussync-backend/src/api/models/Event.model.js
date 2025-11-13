const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM(
        'academic', 'sports', 'cultural',
        'social', 'workshop', 'seminar', 'other'
      ),
      defaultValue: 'other'
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    currentParticipants: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM(
        'upcoming', 'ongoing', 'completed', 'cancelled'
      ),
      defaultValue: 'upcoming'
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'events',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['eventDate'] },
      { fields: ['category'] },
      { fields: ['createdBy'] }
    ]
  });

  return Event;
};