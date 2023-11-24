var nuPageLengthClientData = 10;
var strEmailAbogado;

function mostrarModal(strAccion) {
        var jsonMsg = null;
        switch (strAccion) {
            case "AsignarAbogado":
                jsonMsg = {
                    Title: "Asignar Abogado",
                    Body: "<div id='divTableAbogadoModalData' class='table-responsive' style='max-height:400px'></div>",
                    Button: "<button type='button' class='btn btn-secondary' id='btnModalAccionCancelar' onclick='ocultarModalAccion()'>Cancelar</button>"
                };
                $('#modalTitulo').html(jsonMsg.Title);
                $('#divModalAccionCuerpo').html(jsonMsg.Body);
                $('#divModalAccionbotones').html(jsonMsg.Button);
                buscarAbogados(0, nuPageLengthClientData);
                break;            
        }
    }

function buscarAbogados(nuPage, nuRowsPerPage) {
    nuPageLengthClientData = nuRowsPerPage;
    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage,
    };

    var objRequestParams = {
        CBFunction: "cbBuscarAbogadoModal",
        Action: "../Contrato/GetAbogados",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true,
        LoaderText: "<br/>Consultando abogados"
    }
    getDataFromADS(objRequestParams);
}

function cbBuscarAbogadoModal(jsonResp) {
    if (jsonResp.resp) {
        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }
        var botones = [
            { ICON: "fa-folder-plus", EVENT: "mostrarModalConfirmacion", TITLE: "Click para asignar." },
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Email", "Rol", "Regional", "Acciones"],
            COLS: ["Email", "Rol", "Regional"],
            ID: "AbogadoModalData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'BuscarAbogadoModal',
            ROWS: jsonResp.count,
            PAGE: jsonResp.index,
            PAGELENGTH: nuPageLengthClientData
        };

        buildTbl(jsonTable);
        setTimeout(() => { $('#divModalConfirmarAccion').modal('show') }, 400);
    }
}

function mostrarModalConfirmacion(jsonResp) {
    strEmailAbogado = jsonResp.Email;
    jsonMsg = {
        CBFunction: "AsignarAbogado",
        Title: "Asignar abogado",
        Body: "<label>¿Desea asignar el contrato al abogado con correo " + jsonResp.Email + "?</label>",
        Data: "Agendar"
    };
    setTimeout(() => { showITCConfirm(jsonMsg) },400);
}

function AsignarAbogado() {
    var objJsonParams = {
        EmailAbogado: strEmailAbogado,
        ContratoID: $('#txtContratoID').val(),
        EmailSolicitante: $('#emailsolicitante').val(),
        NumContrato: $('#lblContratoId').text()
    };

    var objRequestParams = {
        CBFunction: "cbAsignarAbogado",
        Action: "../Contrato/AsignarAbogado",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true,
        LoaderText: "<br/>Asignando Abogado"
    }
    getDataFromADS(objRequestParams);
}

function cbAsignarAbogado(jsonResp) {
    if (jsonResp.resp) {
        var jsonMsg = {
            Title: "Mensaje",
            Msg: "La asignación se completó éxitosamente.",
            Type: "Success"
        };
        ocultarModalAccion();
        strUriActual = "./Contrato/Index";
        $('#divContenido').load("./Contrato/Index");
    } else {
        var jsonMsg = {
            Title: "Error",
            Msg: jsonResp.Msg,
            Type: "Success"
        };
    }
    setTimeout(() => { showITCMessage(jsonMsg) }, 400 );
}


function ocultarModalAccion() {
    $('#divModalConfirmarAccion').modal('hide')
}