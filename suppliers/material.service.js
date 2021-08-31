const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    register,
    getAll,
    getSuppliers,
    getById,
    create,
    update,
    delete: _delete
};

async function register(params) {
    // create material object
    const material = new db.Material(params);
    // save material
    await material.save();
}

async function getAll() {
    const materials = await db.Material.findAll({include: [{model: db.Supplier, attributes: ['companyName'],}]
    });
    return materials;
    //return materials.map(x => basicDetails(x));
}

async function getSuppliers(){
    const suppliers = await db.Supplier.findAll();
    return suppliers.map(x => resumeSuppliers(x));
}

function resumeSuppliers(supplier){
    const {id, companyName, contactName,contactTitle,address,city,cp,country,phone} = supplier;
    return {id, companyName, contactName,contactTitle,address,city,cp,country,phone};
}

function basicDetails(material) {
    const { id, materialName, description, stock, supplierId, companyName } = material;
    return { id, materialName, description, stock, supplierId, companyName };
}

async function getById(id) {
    const material = await getMaterial(id);
    return basicDetails(material);
}

// helper functions

async function getMaterial(id) {
    const material = await db.Material.findByPk(id);
    if (!material) throw 'Material no encontrado';
    return material;
}

async function create(params) {
    const material = new db.Material(params);
    // save account
    await material.save();
    return basicDetails(material);
}

async function update(id, params) {
    let material = await getMaterial(id);
    // copy params to account and save
    Object.assign(material, params);
    await material.save();
    return basicDetails(material);
}

async function _delete(id) {
    const material = await getMaterial(id);
    await material.destroy();
}