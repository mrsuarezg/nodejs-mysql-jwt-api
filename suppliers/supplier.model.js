const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        companyName: { type: DataTypes.STRING, allowNull: false},
        contactName: { type: DataTypes.STRING, allowNull: false},
        contactTitle: { type: DataTypes.STRING, allowNull: false},
        address: { type: DataTypes.STRING, allowNull: false},
        city: {type: DataTypes.STRING, allowNull: false},
        cp: {type: DataTypes.STRING, allowNull: false},
        country: {type: DataTypes.STRING, allowNull: false},
        phone: {type:DataTypes.BIGINT, allowNull:false,validate:
            {
               not:{
                   args:["[a-z]",'i'],
                   msg:"Por favor ingrese un número de telefono válido, evite agregar +."
                },
               len:{
                   args:[10,20],
                   msg:"La longitud minima para el número de telefono es de 10"
                }
            }
        }
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };

    return sequelize.define('supplier', attributes,options);
}