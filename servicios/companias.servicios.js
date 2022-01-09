const { sequelize } = require("../configuracion/configuracion.js");

module.exports.mostrarCompanias = async (objCompania) => {

    let {id, email, nombre, direccion, pais, region } = objCompania;

    query = "SELECT * FROM companias WHERE 1 = 1"
    if (id) {query += " AND id = :id";}
    if (email) {query += " AND email = :email";} 
    if (nombre) {query += " AND nombre LIKE :nombre";} 
    if (direccion) {query += " AND direccion LIKE :direccion";} 
    if (pais) {query += " AND pais LIKE :pais";} 
    if (region) {query += " AND region LIKE :region";} 
    
    
    const respuesta =
        sequelize.query(query, {
            replacements: { id: id, email: email, nombre: `%${nombre}%`, direccion: `%${direccion}%`, pais: `%${pais}%`, region: `%${region}%`},
            type: sequelize.QueryTypes.SELECT
        });

    return respuesta;

}

module.exports.buscarCompania = async (objCompania) => {

    if (objCompania.id) {
        query = "SELECT * FROM companias WHERE id = :id";

    const respuesta =
        sequelize.query(query, {
            replacements: { id: objCompania.id },
            type: sequelize.QueryTypes.SELECT
        });

    return respuesta;
    
    } else if (objCompania.email) {

        query = "SELECT * FROM companias WHERE email = :email";

        const respuesta =
            sequelize.query(query, {
                replacements: { email: objCompania.email },
                type: sequelize.QueryTypes.SELECT
            });
    
        return respuesta;

        
    }else {

        return "Error, Debe enviar Email";

    }
    
}

module.exports.crearCompania = async (objCompania) => {


    const { nombre, direccion, email, telefono, pais } = objCompania;

    if (nombre) {

        query = "SELECT * FROM paises WHERE nombre LIKE :nombre";
        
        const respuesta =
            sequelize.query(query, {
                replacements: { nombre: `%${pais}%`},
                type: sequelize.QueryTypes.SELECT
            });
    
        const resultado = await respuesta;
        const region = await resultado[0].region;

        query = "INSERT INTO companias (nombre, direccion, email, telefono, pais, region) VALUES ( :nombre, :direccion, :email, :telefono, :pais, :region) ";

        const respuesta2 =
            sequelize.query(query, {
                replacements: { nombre, direccion, email, telefono, pais, region},
                type: sequelize.QueryTypes.INSERT
            });

         return respuesta2;

    }

}

module.exports.editarCompania = async (objCompania) => {

    const {id, nombre, direccion, email, telefono, pais } = objCompania;

    if (id) {

        query = "SELECT * FROM paises WHERE nombre LIKE :nombre";
        
        const respuesta =
            sequelize.query(query, {
                replacements: { nombre: `%${pais}%`},
                type: sequelize.QueryTypes.SELECT
            });
    
        const resultado = await respuesta;
        const region = await resultado[0].region;

        query = "UPDATE companias SET nombre = :nombre , direccion = :direccion, email  =:email, telefono = :telefono, pais = :pais, region = :region WHERE id = :id";

        const respuesta2 =
            sequelize.query(query, {
                replacements: {id, nombre, direccion, email, telefono, pais, region},
                type: sequelize.QueryTypes.UPDATE
            });

        return respuesta2;

    }

}


module.exports.eliminarCompania = async (objCompania) => {

    const id = objCompania.id;

    if (id) {

        query = "DELETE FROM companias WHERE id = :id";

        const respuesta =
            sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE
            });

        return respuesta;

    }

}