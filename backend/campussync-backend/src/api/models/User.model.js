const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'First name cannot be empty' },
                len: { args: [2, 50], msg: 'First name must be between 2 and 50 characters' }
            }
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Last name cannot be empty' },
                len: { args: [2, 50], msg: 'Last name must be between 2 and 50 characters' }
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'Must be a valid email address' }
            },
            set(value) {
                this.setDataValue('email', value.toLowerCase());
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
            }
        },
        role: {
            type: DataTypes.ENUM('student', 'faculty', 'admin'),
            defaultValue: 'student'
        },
        studentId: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: true
        },
        major: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
<<<<<<< Updated upstream
=======
        
        // --- NEW SEMESTER FIELD ---
        semester: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        // --------------------------

>>>>>>> Stashed changes
        phone: {
            type: DataTypes.STRING(15),
            validate: {
                is: { args: /^[+]?[(]?[\\d\\s\\-()]{10,}$/, msg: 'Invalid phone number format' }
            }
        },
        profilePhoto: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: { include: ['password'] }
            }
        }
    });
    
    return User;
};