
var nuPageLengthClientData = 10;

$(document).ready(function () {

    $('#viewDetails').hide();
    $('#viewEdit').hide();

    getTipoSolicitudes(0, nuPageLengthClientData);
    fetchEmpresas();
});

function getTipoSolicitudes(nuPage, nuRowsPerPage) {

    nuPageLengthClientData = nuRowsPerPage;

    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage
    };

    var objRequestParams = {
        CBFunction: "cbGetTipoSolicitudes",
        Action: "../TipoSolicitud/GetTipoSolicitudes",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }

    getDataFromADS(objRequestParams);
}

function cbGetTipoSolicitudes(jsonResp) {

    if (jsonResp.resp) {

        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }

        var botones = [
            { ICON: "fa-edit", EVENT: "getTipoSolicitudDetail", TITLE: "Click para editar." },
            { ICON: "fa-trash", EVENT: "changeStateTipoSolicitud", TITLE: "Click para Habilitar/Inhabilitar." }
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Descripción", "Empresa", "Estado", "Creado", "Fecha de Creación", "Acciones"],
            COLS: ["Descripcion", "DescripcionEmpresa", "Estado", "CreadoPor", "FechaCreacion"],
            ID: "TipoSolicitudData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'getTipoSolicitudes',
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

function createTipoSolicitud() {

    var blValidateFields = validateEmptyFields(["txtDescripcion", "slcEmpresa"]);

    if (blValidateFields)
    {
        var strDescripcion = $('#txtDescripcion').val();
        var strEmpresaId = $('#slcEmpresa').val();
        var strCreadoPor = $('#txtCreadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "EmpresaID": strEmpresaId, "CreadoPor": strCreadoPor };

        var objRequestParams = {
            CBFunction: "cbCreateTipoSolicitud",
            Action: "../TipoSolicitud/CreateTipoSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
    else
    {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Los campos descripción y empresa son obligatorios",
            Type: "Warning"
        };
        showITCMessage(jsonMsg);
    }
}

function cbCreateTipoSolicitud(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getTipoSolicitudes(0, nuPageLengthClientData);
            $('#txtDescripcion').val('');
            $('#slcEmpresa').val('');
            showITCMessage({ Title: "Información", Msg: "Insertado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function changeStateTipoSolicitud(jsonRowData) {

    var objJsonParams = { "ID": jsonRowData.TipoSolicitudID };

    var objRequestParams = {
        CBFunction: "cbChangeStateTipoSolicitud",
        Action: "../TipoSolicitud/ChangeStateTipoSolicitud",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbChangeStateTipoSolicitud(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getTipoSolicitudes(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function getTipoSolicitudDetail(jsonResp) {
    ID = jsonResp.TipoSolicitudID;
    $('#txtModalDescripcion').val(jsonResp.Descripcion);
    $('#slcModalEmpresa').val(jsonResp.EmpresaID);
    $('#divModalTipoSolicitudDetail').modal("show");
}

var ID = '';

function updateTipoSolicitud() {

    var blValidateFields = validateEmptyFields(["txtModalDescripcion", "slcModalEmpresa"]);

    if (blValidateFields)
    {
        var strDescripcion = $('#txtModalDescripcion').val();
        var strEmpresaId = $('#slcModalEmpresa').val();
        var strModificadoPor = $('#txtModalModificadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "EmpresaID": strEmpresaId, "ModificadoPor": strModificadoPor, "ID": ID };

        var objRequestParams = {
            CBFunction: "cbUpdateTipoSolicitud",
            Action: "../TipoSolicitud/UpdateTipoSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
    else
    {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Los campos descripción y empresa son obligatorios",
            Type: "Warning"
        };
        showITCMessage(jsonMsg);
    }
}

function cbUpdateTipoSolicitud(jsonResp) {

    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            $('#divModalTipoSolicitudDetail').modal("hide");
            getTipoSolicitudes(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: "Actualizado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
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

function cbFetchEmpresas(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        const arrayEmpresas = tryParseJson(objJsonResponse.data, identity, () => []);
        loadCombo('slcEmpresa', 'EmpresaID', 'Descripcion', arrayEmpresas);
        loadCombo('slcModalEmpresa', 'EmpresaID', 'Descripcion', arrayEmpresas);
    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}