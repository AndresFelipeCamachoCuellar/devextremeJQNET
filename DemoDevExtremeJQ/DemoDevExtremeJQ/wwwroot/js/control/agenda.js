var objValidationRulesAgenda = {
    fecha: { required: true },
    txtHoraIni: { required: true },
    txtHoraFin: { required: true },
    txtAsunto: { required: true },
    txtLocalizacion: { required: true },
    txtMensaje: { required: true },
    slcTipoComite: { required: true }
}

function validateFormAgenda() {
    $("#formAgenda").validate({
        rules: objValidationRulesAgenda,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            fecha: { required: "El campo es requerido" },
            txtHoraIni: { required: "El campo es requerido" },
            txtHoraFin: { required: "El campo es requerido" },
            txtAsunto: { required: "El campo es requerido" },
            txtLocalizacion: { required: "El campo es requerido" },
            txtMensaje: { required: "El campo es requerido" },
            slcTipoComite: { required: "El campo es requerido" }
        }
    });
}

var nuPageLengthClientData = 10;

$(document).ready(function () {
    buscarTipoComite(); //busca el rol la regional establece los comites y hace la consulta despues con getagenda.
    validateFormAgenda();
});

function SubirPresentacion() {
    var formData = new FormData();
    var jsonMsg;

    $("#formAgenda").find("input[type=file]").each(function (index, field) {
        if (field.files.length > 0) {
            const flName = field.files[0].name;
            const strLastDot = flName.lastIndexOf('.');
            const strExt = flName.substring(strLastDot + 1);
            formData.append('files', field.files[0], field.id + "." + strExt);
        }
    });

    let file;
    var strFileName;
    var nuFileSize;

    // Comprobando archivos
    for (var fdItem of formData.entries()) {
        file = fdItem[1];
        strFileName = file.name;
        nuFileSize = file.size;

        if (nuFileSize > 0) {
            nuFileSize = nuFileSize / 1024 / 1024;
        }

        if (nuFileSize > 20) {
            jsonMsg = {
                Title: "Información",
                Msg: "El archivo " + strFileName + " supera el máximo permitido son 20MB.",
                Type: "Warning"
            };
            return jsonMsg;
        }
    }

    const objRequestParams = {
        CBFunction: "cbSubirPresentacion",
        Action: "Agenda/SubirPresentacion",
        Data: formData,
        Loading: true,
        LoaderText:"Subiendo Archivo"
    };
    getFormDataFromADS(objRequestParams);
}

function cbSubirPresentacion(jsonResp) {
    if (jsonResp.resp) {
        showITCMessage({ Title: "Información", Msg: "Comité Agendado", Type: "Success" });
        $('#divModalAgendaDetail').modal("hide");
        strUriActual = "./Agenda/ComitesAgendados";
        $('#divContenido').load("./Agenda/ComitesAgendados");
    } else {
        showITCMessage({ Title: "Información", Msg: "No se pudo subir el archivo al comité agendado", Type: "Error" })
    }
}

function getAgenda(nuPage, nuRowsPerPage) {

    nuPageLengthClientData = nuRowsPerPage;
    var strTipoComite = $("#slcVerTipoComite").val();
    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage,
        TipoComite: strTipoComite
    };

    var objRequestParams = {
        CBFunction: "cbGetAgenda",
        Action: "../Agenda/GetAgenda",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true,
        LoaderText: "<br/>Consultando comités agendados"
    }

    getDataFromADS(objRequestParams);
}

function cbGetAgenda(jsonResp) {

    if (jsonResp.resp) {
        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }

        var botones = [
            { ICON: "fa-search", EVENT: "verComiteAgendado", TITLE: "Click para ver." },
            { ICON: "fa-edit", EVENT: "getAgendaDetail", TITLE: "Click para editar." },
            { ICON: "fa-trash", EVENT: "mostrarConfirmacion", TITLE: "Click para eliminar." }
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Asunto", "Fecha", "Hora Inicial", "Hora Final", "Fecha de Creación", "Acciones"],
            COLS: ["Asunto", "Fecha", "HoraInicial", "HoraFinal", "FechaCreacion"],
            ID: "AgendaData",
            ORDERPOSITION: 0,
            ES_AGENDA: true,
            BUTTONS: botones,
            CBPaginate: 'getAgenda',
            ROWS: jsonResp.count,
            PAGE: jsonResp.index,
            PAGELENGTH: nuPageLengthClientData
        };

        buildTbl(jsonTable);

    } else {

        var jsonMsg = {
            Title: "Mensaje",
            Msg: jsonResp.msg,
            Type: jsonResp.type
        };

        showITCMessage(jsonMsg);
    }
}

function agendarComite() {

    if ($('#formAgenda').valid()) {
        var usuario = $('#userEmail').val();
        var horaIni = $('#txtHoraIni').val();
        var horaFin = $('#txtHoraFin').val();
        var asunto = $('#txtAsunto').val();
        var mensaje = $('#txtMensaje').val();
        var fecha = $('#dtFecha').val();
        var localizacion = $('#txtLocalizacion').val();
        var asistentes = $('#txtAsistentes').val();
        var videoConferencia = $('#ckVideoLlamada').is(":checked");
        var lstAsistentes = [];
        var TipoComite = $('#slcTipoComite').val();
        lstAsistentes[0] = {
            emailAddress: {
                address: usuario
            },
            type: "required"
        };
        var lstTemporal = [];
        lstTemporal = asistentes.trim().split(';');
        for (var i = 0; i < lstTemporal.length; i++) {
            lstAsistentes.push({
                emailAddress: {
                    address: lstTemporal[i]
                },
                type: "required"
            });
        }

        var objJsonParams = {
            start: {
                dateTime: fecha + "T" + horaIni,
                timeZone: "America/Bogota"
            },
            end: {
                dateTime: fecha + "T" + horaFin,
                timeZone: "America/Bogota"
            },
            subject: asunto,
            body: {
                contentType: "HTML",
                content: mensaje
            },
            location: {
                displayName: localizacion
            },
            isOnlineMeeting: videoConferencia,
            attendees: lstAsistentes
        };
        
        var objJsonFullEvent = { "Event": objJsonParams, "TipoComite": TipoComite }
       
        var objRequestParams = {
            CBFunction: "cbAgendarComite",
            Action: "/Agenda/AgendarComite",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonFullEvent) }),
            Loading: true,
            LoaderText: "Agendando comité"
        };
        getDataFromADS(objRequestParams);
    }
}

function cbAgendarComite(Resp) {
    if (Resp) {

        //getAgenda(0, nuPageLengthClientData);
        $('#txtHoraIni').val(null);
        $('#txtHoraFin').val(null);
        $('#txtAsunto').val(null);
        $('#txtMensaje').val(null);
        $('#dtFecha').val(null);
        $('#txtLocalizacion').val(null);
        $('#txtAsistentes').val(null);

        $("#formAgenda").find("input[type=file]").each(function (index, field) {
            if (field.files.length != 0) {
                SubirPresentacion();
            } else {
                showITCMessage({ Title: "Información", Msg: "Comité Agendado", Type: "Success" });
                strUriActual = "./Agenda/ComitesAgendados";
                $('#divContenido').load("./Agenda/ComitesAgendados");
            }
        });

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function mostrarConfirmacion(jsonResp) {
    $('#userEmail').val(jsonResp.CreadoPor);
    $('#lblConfirmar').text(jsonResp.Asunto);
    $('#IdComite').val(jsonResp.ID);
    $('#divModalEliminarAgenda').modal("show");
}

function eliminarComite() {
    
    var userID=$('#userEmail').val();
    var eventID=$('#IdComite').val();

    var objJsonParams = { "userID": userID, "eventID": eventID };

    var objRequestParams = {
        CBFunction: "cbEliminarComite",
        Action: "../Agenda/CancelarEvento",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };
    $('#divModalEliminarAgenda').modal("hide");
    getDataFromADS(objRequestParams);
}

function cbEliminarComite(jsonResp) {
    var jsonMsg = {
        Title: "Mensaje",
        Msg: jsonResp.msg,
        Type: jsonResp.type
    };
    showITCMessage(jsonMsg);
    getAgenda(0, nuPageLengthClientData);
}

function getAgendaDetail(jsonResp) {
    ID = jsonResp.AgendaID;
    $('#txtAgendaID').val(jsonResp.AgendaID);
    $('#txtHoraIni').val(jsonResp.HoraInicial);
    $('#txtHoraFin').val(jsonResp.HoraFinal);
    $('#txtAsunto').val(jsonResp.Asunto);
    $('#txtMensaje').val(jsonResp.Mensaje);
    $('#dtFecha').val(jsonResp.Fecha.split("T")[0]);
    $('#txtLocalizacion').val(jsonResp.Localizacion);
    $('#txtAsistentes').val(jsonResp.Asistentes);
    $('#txtId').val(jsonResp.ID);
    $('#ckVideoLlamada').attr('checked', jsonResp.VideoConferencia);
    $('#urlPresentacion').val(jsonResp.UrlArchivo);
    $('#slcTipoComite').val(jsonResp.TipoComite);
    $("#slcTipoComite").trigger("change");

    if (jsonResp.UrlArchivo != "") {
        removeInputFile('presentacion');
    } else {
        showInputFile('presentacion');
    }


    $('#divModalAgendaDetail').modal("show");


}

var ID = '';

async function actualizarAgenda() {
    if ($('#formAgenda').valid()) {
        var id = $('#txtId').val();
        var usuario = $('#userEmail').val();
        var horaIni = $('#txtHoraIni').val();
        var horaFin = $('#txtHoraFin').val();
        var asunto = $('#txtAsunto').val();
        var mensaje = $('#txtMensaje').val();
        var fecha = $('#dtFecha').val();
        var localizacion = $('#txtLocalizacion').val();
        var asistentes = $('#txtAsistentes').val();
        var videoConferencia = $('#ckVideoLlamada').is(":checked");
        var lstAsistentes = [];
        var TipoComite = $('#slcTipoComite').val();
        lstAsistentes[0] = {
            emailAddress: {
                address: usuario
            },
            type: "required"
        };
        var lstTemporal = [];
        lstTemporal = asistentes.trim().split(';');
        for (var i = 0; i < lstTemporal.length; i++) {
            lstAsistentes.push({
                emailAddress: {
                    address: lstTemporal[i]
                },
                type: "required"
            });
        }

        var evento = {
            start: {
                dateTime: fecha + "T" + horaIni,
                timeZone: "America/Bogota"
            },
            end: {
                dateTime: fecha + "T" + horaFin,
                timeZone: "America/Bogota"
            },
            subject: asunto,
            body: {
                contentType: "HTML",
                content: mensaje
            },
            location: {
                displayName: localizacion
            },
            isOnlineMeeting: videoConferencia,
            attendees: lstAsistentes
        };

        objJsonParams = { "Event": evento, "Id": id, "TipoComite": TipoComite }
        var objRequestParams = {
            CBFunction: "cbActualizarAgenda",
            Action: "/Agenda/ActualizarAgenda",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true,
            LoaderText: "Actualizando comité agendado"
        };
        getDataFromADS(objRequestParams);
    }
}

 function cbActualizarAgenda(jsonResp) {
    if (jsonResp.resp) {
            getAgenda(0, nuPageLengthClientData);
            $('#txtHoraIni').val(null);
            $('#txtHoraFin').val(null);
            $('#txtAsunto').val(null);
            $('#txtMensaje').val(null);
            $('#dtFecha').val(null);
            $('#txtLocalizacion').val(null);
            $('#txtAsistentes').val(null);

            $("#formAgenda").find("input[type=file]").each( async function (index, field) {
                if (field.files.length != 0) {
                    await eliminarArchivoEvento();
                    SubirPresentacion();
                } else {
                    showITCMessage({ Title: "Información", Msg: "Comité Editado", Type: "Success" });
                    $('#divModalAgendaDetail').modal("hide");
                }
            });

        } else {
            // No hay registros
            showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
        }
}

function DescargarArchivo(tipo) {
    var urlArchivo = "";
    switch (tipo) {
        case "presentacion" :
            urlArchivo = $('#urlPresentacion').val();
            break;
    }
    location.replace("Solicitud/DescargarDocumento?ruta=" + urlArchivo);
}

function removeInputFile(tipo) {
    switch (tipo) {
        case "presentacion":
            $('#presentacion').prop("hidden", true);
            $('#aDescargarPresentacion').prop("hidden", false);
            $('#aCambiarPresentacion').prop("hidden", false);
            break;
    }
}

function showInputFile(tipo) {
    switch (tipo) {
        case "presentacion":
            $('#presentacion').prop("hidden", false);
            $('#aDescargarPresentacion').prop("hidden", true);
            $('#aCambiarPresentacion').prop("hidden", true);
            break;
    }
}

function fetchEmpresas() {

    jsData = null;

    const objRequestParams =
    {
        CBFunction: "cbFetchEmpresas",
        Action: "Empresa/GetAllEmpresas",
        Data: jsData,
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

async function eliminarArchivoEvento() {
    await $.ajax({
        type: 'POST',
        url: "/Agenda/EliminarArchivoEvento",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(objJsonParams),
        dataType: 'json'
    });
}

function cbFetchEmpresas(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        const arrayEmpresas = tryParseJson(objJsonResponse.data, identity, () => []);
        loadCombo('slcEmpresa', 'EmpresaID', 'Descripcion', arrayEmpresas);
        loadCombo('slcModalEmpresa', 'EmpresaID', 'Descripcion', arrayEmpresas);
    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

function buscarTipoComite() {
    const objRequestParams =
    {
        CBFunction: "cbBuscarTipoComite",
        Action: "/Agenda/BuscarBandeja",
        Data: null,
        Loading: true
    };
    getDataFromADS(objRequestParams);
}

function cbBuscarTipoComite(jsonResp) {
    if (jsonResp.data != null) {
        var arrayDataTbl = JSON.parse("[]");
        arrayDataTbl = JSON.parse(jsonResp.data);
        buildSelect(arrayDataTbl, "slcTipoComite", "");
        buildSelect(arrayDataTbl, "slcVerTipoComite", "");
        $('#slcVerTipoComite option')[0].remove();
        $("#slcVerTipoComite option")[0].selected = true;
    }
    getAgenda(0, nuPageLengthClientData);
}

function getAgendaSolicitud() {
    var strAgendaID = $("#txtAgendaID").val();
    var objJsonParams = { "AgendaID": strAgendaID}
    var objRequestParams = {
        CBFunction: "cbGetAgendaSolicitud",
        Action: "../Agenda/GetAgendaSolicitud",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }
    getDataFromADS(objRequestParams);
}

function cbGetAgendaSolicitud(jsonResp) {
    if (jsonResp.resp) {
        var arrayDataTbl = JSON.parse("[]");
        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }
        var botones = [
            { ICON: "fa-search", EVENT: "getDetailView", TITLE: "Click para ver detalle." },
        ];
        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Solicitud No.", "Solicitante", "Tipo de solicitud", "No. Contrato", "Fecha de registro", "Estado", "Asignado a", "Contratista", "Acciones"],
            COLS: ["SolicitudNo", "Solicitante", "TipoSolicitud", "NumContrato", "FechaRegistro", "EstadoSolicitud", "Asignado", "NombreCompleto"],
            ID: "AgendaSolicitudData",
            ES_SOLICITUD: true,
            BUTTONS: botones
        };
        buildTbl(jsonTable);
    } else {
        var jsonMsg = {
            Title: "Mensaje",
            Msg: jsonResp.msg,
            Type: jsonResp.type
        };
        showITCMessage(jsonMsg);
        $('#divTableAgendaSolicitudData').html('<p><center>' + jsonResp.msg + '</center></p>');
    }
    $('#viewTable').show();
}

function getDetailView(objSolicitud) {
    $.get('/Solicitud/VerSolicitud'
        , {solicitudId: objSolicitud.id}
        , function (data) {
            if (data.length > 0) {
                strUriAnterior = './Agenda/VerComiteAgendado';
                strUriActual = './Solicitud/VerSolicitud';
                $('#divContenido').fadeOut(1);
                $('#divContenido').html(data).fadeIn(1500);
                window.scrollTo(0, 0);
            }
        });
}

function verComiteAgendado(jsonResp) {
    var AgendaSeleccionada = JSON.stringify(jsonResp);
    $.get('/Agenda/VerComiteAgendado'
        , { Agenda: AgendaSeleccionada }
        , function (data) {
            if (data.length > 0) {
                globalJson = AgendaSeleccionada;
                $('#divContenido').fadeOut(1);
                $('#divContenido').html(data).fadeIn(1500);
                window.scrollTo(0, 0);
            }
        });
}