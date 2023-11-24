var nuPageLengthClientData = 10;
var Agenda = {};
var SolicitudID = "";

function aprobarContrato() {
    strSolicitudId = $("#txtSolicitudID").val();
    objJsonParams = { "solicitudId": strSolicitudId };

    var objRequestParams = {
        CBFunction: "cbAprobarContrato",
        Action: "../Solicitud/AprobarContrato",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}


function cbAprobarContrato(jsonResp) {
    if (jsonResp.resp) {
        var jsonMsg = {
            Title: "Mensaje",
            Msg: "El contrato se creó satisfactoriamente con id " + jsonResp.data,
            Type: "Success"
        };
        strUriActual = "./Solicitud/Index";
        $('#divContenido').load("./Solicitud/Index");
    } else {
        var jsonMsg = {
            Title: "Error",
            Msg: jsonResp.Msg,
            Type: "Success"
        };
    }
    showITCMessage(jsonMsg);
}

//metodo que estructura la ventana modal dependiendo de la accion a tomar
function mostrarModal(strAccion) {
    var jsonMsg = null;
    switch (strAccion) {
        case "Aprobar":
            jsonMsg = {
                CBFunction: "aprobarContrato",
                Title: "Aprobar contrato",
                Body: "<label>¿Esta seguro que desea aprobar la creación del contrato?</label>",
                Data: strAccion
            };
            showITCConfirm(jsonMsg);
            break;
        case "NoAprobar":
            jsonMsg = {
                CBFunction: "Accion",
                Title: "No aprobación de contrato",
                Body: "<label>Motivo: </label> <br/><select id='slcSelectModal' class='form-control activeInput'></select>" +
                    "<br /> <label>Observación:</label><br/><input id='txtMotivoNoAprob' class='form-control activeInput'></input>",
                Data: strAccion
            };
            showITCConfirm(jsonMsg);
            buildSelect(PARAM.MotivoNoAprobacionContrato, "slcSelectModal", "");
            break;
        case "Aplazar":
            jsonMsg = {
                CBFunction: "Accion",
                Title: "Aplazar solicitud",
                Body: "<label>Motivo: </label> <br/><select id='slcSelectModal' class='form-control activeInput'></select>" +
                    "<br /> <label>Observación:</label><br/><input id='txtMotivoNoAprob' class='form-control activeInput'></input>",
                Data: strAccion
            };
            showITCConfirm(jsonMsg);
            buildSelect(PARAM.MotivoAplazamientoSolicitud, "slcSelectModal", "");
            break;
        case "Recomendar":
            //se le da la opcion de escoger la bandeja a recomendar
            jsonMsg = {
                CBFunction: "Accion",
                Title: "Recomendar solicitud",
                Body: "<label>Seleccione la bandeja a la cual desea recomendar la solicitud: </label> <br/><select id='slcSelectModal' class='form-control activeInput'></select>",
                Data: strAccion
            };
            showITCConfirm(jsonMsg);
            buildSelect(PARAM.Bandeja, "slcSelectModal", "");
            break;
        case "Agendar":
            jsonMsg = {
                Title: "Agendar solicitud",
                Body: "<div id='divTableAgendaModalData' class='table-responsive' style='max-height:400px'></div>",
                Button: "<button type='button' class='btn btn-secondary' id='btnModalAccionCancelar' onclick='ocultarModalAccion()'>Cancelar</button>"
            };
            $('#modalTitulo').html(jsonMsg.Title);
            $('#divModalAccionCuerpo').html(jsonMsg.Body);
            $('#divModalAccionbotones').html(jsonMsg.Button);
            BuscarAgendaModal(0, nuPageLengthClientData);
            break;
    }
}

function ocultarModalAccion() {
    $('#divModalConfirmarAccion').modal('hide');
}

function Accion(strAccion) {
    var objJsonParams = {};
    switch (strAccion) {
        case "NoAprobar":
            objJsonParams = {
                "solicitudNo": strSolicitudNo,
                "columns": [
                    "EstadoSolicitud",
                    "EstadoAuxSolicitud"
                ],
                "values": [
                    "NoAprobado",
                    ""
                ]
            };
            break;
        case "Aplazar":
            objJsonParams = {
                "solicitudNo": strSolicitudNo,
                "columns": [
                    "EstadoSolicitud",
                    "EstadoAuxSolicitud"
                ],
                "values": [
                    "Aplazada",
                    ""
                ]
            };
            break;
        case "Recomendar":
            var strbandejaID = $('#slcSelectModal').val();
            var fechaActual = new Date();
            objJsonParams = {
                "solicitudNo": strSolicitudNo,
                "columns": [
                    "EstadoSolicitud",
                    "EstadoAuxSolicitud",
                    "BandejaID",
                    "FechaBandeja",
                    "Asignado"
                ],
                "values": [
                    "Recomendado",
                    "AsignadoABandeja",
                    strbandejaID,
                    fechaActual.toISOString(),
                    ""
                ]
            };
            break;
    }
    const objRequestParams = {
        CBFunction: "cbAccion",
        Action: "Solicitud/ActualizarSolicitud",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }
    getDataFromADS(objRequestParams);
}

function cbAccion(jsonResp) {
    //aqui se debe crear un log
    //en el caso de no aprobacion si está en bandejagerencia cambia a bandejacomite
    var jsonMsg = {
        Title: "Actualización finalizada",
        Msg: jsonResp.msg,
        Type: jsonResp.type
    };
    showITCMessage(jsonMsg);
    strUriActual = "./Solicitud/Index";
    $('#divContenido').load("./Solicitud/Index");
}


function BuscarAgendaModal(nuPage, nuRowsPerPage) {
    nuPageLengthClientData = nuRowsPerPage;
    var strBandeja = jsonObjSolicitud.BandejaID;
    var strComite = "";
    switch (strBandeja) {
        case "b931d98b-2ba2-46bc-a262-2871e41aa65f":
            strComite = "Comité Regional Noroccidente";
            break;
        case "749d33c0-e90b-4a8a-a063-5f027c5c1453":
            strComite = "Comité Regional Centroriente";
            break;
        case "9911b1a7-7885-4dd0-87de-0f44b5a11cb1":
            strComite = "Comité Regional Suroccidente";
            break;
        case "a0dd83f1-2ab9-438b-a393-2b4554ebee6d":
            strComite = "Comité Regional Eje Cafetero";
            break;
        case "29d84372-755d-4d54-98e1-21936d6abeb9":
            strComite = "Comité Regional Caribe";
            break;
        case "0e4c9601-4c28-44b6-a472-442bae11e1db":
            strComite = "Comité Regional Nororiente";
            break;
        case "76c89b81-2b1f-4c68-b517-a0f7af645876":
            strComite = "Comité Nacional";
            break;
        case "c4048ef7-6ba5-4375-a316-2e7a55f5f1c5":
            strComite = "Junta Directiva";
            break;
    }
    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage,
        TipoComite: strComite
    };

    var objRequestParams = {
        CBFunction: "cbBuscarAgendaModal",
        Action: "../Agenda/GetAgenda",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true,
        LoaderText: "<br/>Consultando comités agendados"
    }
    getDataFromADS(objRequestParams);
}

function cbBuscarAgendaModal(jsonResp) {
    if (jsonResp.resp) {
        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }

        var botones = [
            { ICON: "fa-edit", EVENT: "mostrarModalConfirmacion", TITLE: "Click para Agendar." },
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Asunto", "Fecha", "Hora Inicial", "Hora Final", "Fecha de Creación", "Acciones"],
            COLS: ["Asunto", "Fecha", "HoraInicial", "HoraFinal", "FechaCreacion"],
            ID: "AgendaModalData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'BuscarAgendaModal',
            ROWS: jsonResp.count,
            PAGE: jsonResp.index,
            PAGELENGTH: nuPageLengthClientData
        };

        buildTbl(jsonTable);
        setTimeout(() => { $('#divModalConfirmarAccion').modal('show') }, 400);

    }
}

function mostrarModalConfirmacion(jsonResp) {
    Agenda = jsonResp;
    SolicitudID = $('#txtSolicitudID').val();
    jsonMsg = {
        CBFunction: "agendarSolicitud",
        Title: "Agendar solicitud",
        Body: "<label>¿Desea agendar la solicitud a esta reunión con asunto " + Agenda.Asunto + "?</label>",
        Data: "Agendar"
    };
    showITCConfirm(jsonMsg);
}

function agendarSolicitud() {
    if (jsonObjSolicitud.EstadoSolicitud == "Aplazada") {
        objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "EstadoSolicitud",
                "EstadoAuxSolicitud"
            ],
            "values": [
                "Aplazada",
                "Agendada"
            ],
            "SolicitudID": SolicitudID,
            "AgendaID": Agenda.AgendaID
        };
    } else {
        objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "EstadoSolicitud",
                "EstadoAuxSolicitud"
            ],
            "values": [
                "Agendada",
                ""
            ],
            "SolicitudID": SolicitudID,
            "AgendaID": Agenda.AgendaID
        };
    }

    var objRequestParams = {
        CBFunction: "cbAgendarSolicitud",
        Action: "../Solicitud/AgendarSolicitud",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true,
        LoaderText: "<br/>Agendando solicitud"
    }
    getDataFromADS(objRequestParams);
}


function cbAgendarSolicitud(jsonResp) {
    ocultarModalAccion();
    var jsonMsg = {
        Title: "Agendar Solicitud",
        Msg: jsonResp.msg,
        Type: jsonResp.type
    };
    showITCMessage(jsonMsg);
    $('#divContenido').load("./Solicitud/Index");
}