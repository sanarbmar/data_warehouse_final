const companiasServicios = require('../servicios/companias.servicios.js');
const { jwt, firma } = require("../configuracion/configuracion.js");


function validarDatos(req, res, next) {

    console.log("Validando Datos Completos la compañia");       

    const { nombre, apellido, email} = req.body;

    if ( !nombre || !apellido || !email ) {

        res.status(400).json({
            error: `Datos Incompletos ! al menos debe enviar Nombre, Apellido , Email`
        });

    } else {

        next();

    }

}

function validarId(req, res, next) {

    console.log("Validando Si envia el ID la compañia");       

    const {id} = req.body;

    if ( !id ) {

        res.status(400).json({
            error: `Datos Incompletos ! debe Enviar ID`
        });

    } else {

        next();

    }

}


async function validarExistencia(req, res, next) {

    const companiasServicios = require('../servicios/companias.servicios.js');

    console.log("Validando Compania");

    const consultaCompania = await companiasServicios.buscarCompania(req.body);

    console.log("Compania encontrado : ", consultaCompania);

    if (consultaCompania.length > 0) { res.status(409).json({
        error: `la Compania con Email ${req.body.email} ya existe en la base de datos`
    }); }

    else { next(); }

}

module.exports = { validarDatos, validarExistencia, validarId};