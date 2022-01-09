const companiasServicios = require('../servicios/companias.servicios.js');
const { validarDatos, validarExistencia, validarId } = require('../middlewares/companias.middleware.js');

module.exports = (app) => {

    app.get("/v1/companias/", async (req, res) => {

        console.log("peticion GET a : /v1/companias/ ");

        try {

            const consultaCompanias = await companiasServicios.mostrarCompanias(req.body);

            if (consultaCompanias.length > 0) { res.status(200).json(consultaCompanias); }

            else { res.status(404).json({
                error: `No Hay datos para mostar`
            }); }

        } catch (error) { res.status(500).json({ Error: error.message }); }

    });

    app.post("/v1/companiasFiltro/", async (req, res) => {

        console.log("peticion POST a : /v1/companiasFiltro/ ");

        try {

            const consultaCompanias = await companiasServicios.mostrarCompanias(req.body);

            if (consultaCompanias.length > 0) { res.status(200).json(consultaCompanias); }

            else { res.status(404).json({
                error: `No Hay datos para mostar`
            }); }



        } catch (error) { res.status(500).json({ Error: error.message }); }

    });

    app.post("/v1/companias/", validarDatos, validarExistencia, async (req, res) => {

        console.log("peticion POST a : /v1/companias/ ");
        
        const crearCompania = await companiasServicios.crearCompania(req.body);

        if (crearCompania.length > 0) {
            res.status(201).json({
                mensaje: `Nueva Compania con nombre : " ${req.body.nombre} " creada correctamente ! `
            });
        }

        else { res.status(400).json({ mensaje: "Error al Crear Compania" }); }

    });

    app.put("/v1/companias/", validarId, async (req, res) => {

        console.log("peticion PUT a : /v1/companias/ ");

        console.log("Validando Si existe el Compania");

        if (req.body.id){

        const consultaCompania = await companiasServicios.buscarCompania(req.body);

        if (consultaCompania.length > 0) {

            const editarCompania = await companiasServicios.editarCompania(req.body);

            if (editarCompania.length > 0) {
                res.status(201).json({
                    mensaje: `El Compania con nombre : " ${req.body.nombre} " fue editada correctamente ! `
                });
            }

        }

        else { res.status(400).json({ mensaje: "Error al Editar el Compania" }); }

    } else { res.status(400).json({ mensaje: "Debe Enviar el Id de el Compania a Editar" }); }

    });

    app.delete("/v1/companias/", async (req, res) => {

        console.log("peticion DELETE a : /v1/companias/ ");

        console.log("Validando Si existe La Compania");

        if (req.body.id){

        const consultaCompania = await companiasServicios.buscarCompania(req.body);

        if (consultaCompania.length > 0) {

            const eliminarCompania = await companiasServicios.eliminarCompania(req.body);

            res.status(201).json({
                mensaje: `El Compania con nombre "${consultaCompania[0].nombre}" fue eliminado correctamente ! `
            });

        }

        else { res.status(400).json({ mensaje: "Error al Eliminar Compania" }); }

    } else { res.status(400).json({ mensaje: "Debe Enviar el Id del Compania a Eliminar" }); }

    });

    
}