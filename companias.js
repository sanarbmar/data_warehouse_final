const getHtml = (companias) => {

    let html ="";

    if(companias.error){
        
        Swal.fire("Atencion", companias.error , "error");

    }

    if(companias.length > 0){

    html = `<table class="table table-bordered table-hover dt-responsive tablas">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Direccion</th>
        <th scope="col">Email</th>
        <th scope="col">Telefono</th>
        <th scope="col">Pais</th>
        <th scope="col">Region</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
  `;

    companias.forEach(compania => {


        html += `<tr>
         <th scope="row">${compania.id}</th>
         <td>${compania.nombre}</td>
         <td>${compania.direccion}</td>
         <td>${compania.email}</td>
         <td>${compania.telefono}</td>
         <td>${compania.pais}</td>
         <td>${compania.region}</td>
         <td>`;   
         
         html += `
         </td>
         <td>
         <button type="button" class="btn btn-outline-warning btn-sm btnEditarCompania" idCompania="${compania.id}" onClick="vistaEditarCompania(event)">Editar</button>
         <button type="button" class="btn btn-outline-danger btn-sm btnEliminarCompania" nombreCompania="${compania.nombre + " " + compania.direccion}" idCompania="${compania.id}" onClick="eliminarCompania(event)" >Eliminar</button>
         </td>
       </tr>`     

    });

    html += `  
   
     </tbody>
   </table>`;

} 

    return html;

}


btnCompanias.addEventListener('click', async (e) => {
    e.preventDefault();
    const divBusqueda = document.createElement("div");
    divBusqueda.classList.add("divBusqueda");
    divBusqueda.innerHTML = `
    <div class="d-flex justify-content-center"><button type="button" class="btn btn-success" data-toggle="modal" data-target="#nuevoCompania">Crear Compania</button></div>
      <form>
      <div class="input-group busquedaCompania d-flex justify-content-around">
      <input type="text" class="form-control col-4" id="nombreBusqueda" placeholder="Nombre" >
      <input type="text" class="form-control col-4" id="direccionBusqueda" placeholder="direccion">
      <input type="text" class="form-control col-4" id="emailBusqueda" placeholder="Email">
      <input type="text" class="form-control col-4" id="paisBusqueda" placeholder="Pais">
      <input type="text" class="form-control col-4" id="regionBusqueda" placeholder="Region">
      <button type="submit" class="btn btn-primary" id="buscarCompania" onClick="buscarCompanias(event)" >Buscar</button>
      <button type="reset" class="btn btn-danger" id="borrar" >Borrar</button>
      </div>
    </form>

  `;
  
    contenidoMostrar.innerHTML = '<div class="alert alert-info" role="alert">Listado de Companias</div>';
    contenidoMostrar.appendChild(divBusqueda);

    const divTabla = document.createElement("div");
    divTabla.classList.add("divTabla")
    contenidoMostrar.appendChild(divTabla);

    const ext = '/v1/paises/';
    const cuerpo = {};

    const metodo = 'GET';

    const paises = await fetcheo(url, ext, cuerpo, metodo);
    const clase = ".selectNuevoPaisCompania";
    const selector = document.querySelector(clase);

    mostrarPaises(await paises, selector, clase);


});

function mostrarPaises(paises , selector ,clase){

    if(clase === ".selectNuevoPaisCompania"){

      select = "<select class='selectpicker nuevoPaisCompania' id='nuevoPaisCompania' data-live-search='true' title='Elija Pais...'>" ;
      
    } else{
        
        select = "<select class='selectpicker editarPaisCompania' id='editarPaisCompania' data-live-search='true' title='Elija Pais...'>" ;

    }
    

    paises.forEach((pais)=>{
        select += `<option value="${pais.nombre}">${pais.nombre}</option>`;
    });

    select += "</select>" 

    selector.innerHTML =select;

    $('#nuevoPaisCompania').html(select).selectpicker('refresh');
    $('#editarPaisCompania').html(select).selectpicker('refresh');
  };


async function buscarCompanias (e){
    const divTabla = document.querySelector(".divTabla");

    e.preventDefault();

    try {

        divTabla.innerHTML = "";
        const nombre = document.querySelector('#nombreBusqueda').value;
        const direccion = document.querySelector('#direccionBusqueda').value;
        const email = document.querySelector('#emailBusqueda').value;
        const pais = document.querySelector('#paisBusqueda').value;
        const region = document.querySelector('#regionBusqueda').value;

        const ext = '/v1/companiasFiltro/';
        const cuerpo = {
            "nombre": nombre,
            "direccion": direccion,
            "email": email,
            "pais": pais,
            "region": region
        };

        const metodo = 'POST';

        let companias = await fetcheo(url, ext, cuerpo, metodo);

        if (companias) {

            const tabla = getHtml(companias);
            divTabla.innerHTML = tabla;


        } else if (companias.error) { alert(companias.error); }
        else { alert("No hay companias para mostar") }

    } catch (err) {
        alert(err)
    }


};

btnCrearCompania.addEventListener('click', async (e) => {

    e.preventDefault();

    const nombre = document.querySelector('.nuevoNombreCompania').value;
    const direccion = document.querySelector('.nuevodireccionCompania').value;
    const email = document.querySelector('.nuevoEmailCompania').value;
    const telefono = document.querySelector('.nuevoTelefonoCompania').value;
    const pais = document.querySelector('#nuevoPaisCompania').value;
      

    try {

        const ext = '/v1/companias/';
        const cuerpo = {
            "nombre": nombre,
            "direccion": direccion,
            "email": email,
            "telefono": telefono,
            "pais": pais
        };

        const metodo = 'POST';

        let crearCompania = await fetcheo(url, ext, cuerpo, metodo);

        if (crearCompania.mensaje) {

            $('#nuevoCompania').modal('hide');
            
            $('#nuevoCompania').on('hidden.bs.modal', function (e) {
                $(this)
                  .find("input, select")
                     .val('')
                     .end();
              })

              $("#nuevoPaisCompania").val('default');
              $("#nuevoPaisCompania").selectpicker("refresh");
              

              Swal.fire("Creado!", "Compania Creada Correctamente.", "success");
              document.querySelector(".divTabla").innerHTML ="";

        } else if (crearCompania.error) { alert(crearCompania.error); }

    } catch (err) {
        alert(err)
    }


});

async function vistaEditarCompania (e){

    e.preventDefault();

    const idCompania = await e.target.attributes.idCompania.value;

    $('#editarCompania').modal('show');
    $('#editarCompania').on('hidden.bs.modal', function (e) {
        $(this)
          .find("input,select")
             .val('')
             .end();
      })

    try {

        const ext = '/v1/companiasFiltro/';
        const cuerpo = {
            "id": idCompania
        };

        const metodo = 'POST';

        const traerCompania = await fetcheo(url, ext, cuerpo, metodo);

        if (traerCompania) {

            const ext = '/v1/paises/';
            const cuerpo = {};
        
            const metodo = 'GET';
        
            const paises = await fetcheo(url, ext, cuerpo, metodo);
            const clase = ".selectEditarPaisCompania";
            const selector = document.querySelector(clase);
        
            mostrarPaises(await paises, selector, clase);

            const canalesPreferidos = traerCompania[0].canal_preferido.split(",");
            const paisSeleccionado = traerCompania[0].pais;

            document.querySelector('.editarIdCompania').value = traerCompania[0].id;
            document.querySelector('.editarNombreCompania').value = traerCompania[0].nombre;
            document.querySelector('.editardireccionCompania').value = traerCompania[0].direccion;
            document.querySelector('.editarEmailCompania').value = traerCompania[0].email;
            document.querySelector('.editarTelefonoCompania').value = traerCompania[0].telefono;
            document.querySelector('.editarPaisCompania').value = traerCompania[0].pais;
           

            document.querySelectorAll('.editarPaisCompania option').forEach( o => {

                if(paisSeleccionado == o.value){

                    o.selected = "selected";
                    o.html = o.value;

                }

            })
            $('select[name=selValue]').val(1); $('.selectpicker').selectpicker('refresh');
        } else if (traerCompania.error) { alert(traerCompania.error); }

    }catch (err) {
        alert(err)
    }
    
};

async function eliminarCompania (e){

    e.preventDefault();
    
    const idCompania = await e.target.attributes.idCompania.value;
    const nombreCompania = await e.target.attributes.nombreCompania.value;

    Swal.fire({
        title: `¿Está segur@ de borrar a ${nombreCompania}?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Borrar`,
        denyButtonText: `NOOO !`,
      }).then(async (result)  => {
        if (result.isConfirmed) {
                    try {

            const ext = '/v1/companias/';
            const cuerpo = {
                "id": idCompania
            };
    
            const metodo = 'DELETE';
    
            const eliminarCompania = await fetcheo(url, ext, cuerpo, metodo);

            if (eliminarCompania.mensaje) {

                Swal.fire("Eliminado!", "Compania Eliminado Correctamente.", "success");
                document.querySelector(".divTabla").innerHTML ="";
    
    
            } else if (crearCompania.error) { alert(crearCompania.error); }

        }catch (err) {
            alert(err)
        }
          
        } else if (result.isDenied) {
          Swal.fire("Cancelado!", "Operacion Cancelada", "info");
        }
      })

};

btnEditarCompania.addEventListener('click', async (e) => {

    e.preventDefault();

    const id = document.querySelector('.editarIdCompania').value;
    const nombre = document.querySelector('.editarNombreCompania').value;
    const direccion = document.querySelector('.editardireccionCompania').value;
    const email = document.querySelector('.editarEmailCompania').value;
    const telefono = document.querySelector('.editarTelefonoCompania').value;
    const pais = document.querySelector('#editarPaisCompania').value; 

    try {

        const ext = '/v1/companias/';
        const cuerpo = {
            "id":id,
            "nombre": nombre,
            "direccion": direccion,
            "email": email,
            "telefono": telefono,
            "pais": pais
        };

        const metodo = 'PUT';

        let editarCompania = await fetcheo(url, ext, cuerpo, metodo);

        if (editarCompania.mensaje) {

            $('#editarCompania').modal('hide');
            
            $('#editarCompania').on('hidden.bs.modal', function (e) {
                $(this)
                  .find("input,select")
                     .val('')
                     .end();
              })

              Swal.fire("Editado!", "Compania Editado Correctamente.", "success");
              document.querySelector(".divTabla").innerHTML ="";

        } else if (editarCompania.error) { alert(editarCompania.error); }

    } catch (err) {
        alert(err)
    }


});