const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        materialName: { type: DataTypes.STRING, allowNull: false},
        description: { type: DataTypes.STRING, allowNull: false},
        stock: { type: DataTypes.BIGINT, allowNull: false}
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };

    return sequelize.define('material', attributes,options);
}