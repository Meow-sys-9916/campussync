const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Event', {
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
      type: DataTypes.TEXT
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
      allowNull: false
    },
    image: {
      type: DataTypes.STRING 
    },
    organizer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // ✅ ADD THIS: Stores who is going
    attendees: {
      type: DataTypes.JSON, 
      defaultValue: [] 
    }
  });
};