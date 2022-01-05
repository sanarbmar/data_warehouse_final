const express = require('express');
const bodyParser = require('body-parser');
const expressJwt = require("express-jwt");
const { firma, puerto } = require('./configuracion/configuracion.js');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressJwt({ secret: firma, algorithms: ["HS512"] })
	.unless({
		path: [{ url: '/v1/ingreso', methods: ['POST'] },
		{ url: '/v1/usuarios', methods: ['POST'] },
		{ url: '/v1/paises', methods: ['GET'] }]
	})
);

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
	  return res.status(403).send({
		error: "Debe Enviar Token Valido o Su Token Expiro"
	  });
	}
  });


const usuariosRutas = require('./rutas/usuarios.rutas.js');
const contactosRutas = require('./rutas/contactos.rutas.js');
const paisesRutas = require('./rutas/paises.rutas.js');


usuariosRutas(app);
contactosRutas(app);
paisesRutas(app);

app.listen(puerto, () => {
    console.clear();
    console.log(`Servidor Inicializado en el puerto :  ${puerto}`)
});
