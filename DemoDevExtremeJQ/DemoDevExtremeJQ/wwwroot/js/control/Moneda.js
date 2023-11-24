
var nuPageLengthClientData = 10;

$(document).ready(function () {

    $('#viewDetails').hide();
    $('#viewEdit').hide();

    getTipoMoneda(0, nuPageLengthClientData);
    fetchEmpresas();
});

function getTipoMoneda(nuPage, nuRowsPerPage) {

    nuPageLengthClientData = nuRowsPerPage; 
    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage
    };

    var objRequestParams = {
        CBFunction: "cbGetTipoMoneda",
        Action: "../TipoMoneda/GetTipoMoneda",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }

    getDataFromADS(objRequestParams);
}

function cbGetTipoMoneda(jsonResp) {

    if (jsonResp.resp) {

        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }

        var botones = [
            { ICON: "fa-edit", EVENT: "getTipoMonedaDetail", TITLE: "Click para editar." },
            { ICON: "fa-trash", EVENT: "cambiarEstadoTipoMoneda", TITLE: "Click para habilitar/inhabilitar." }
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Codigo", "Descripción", "Empresa", "Estado", "Acciones"],
            COLS: ["Codigo","Descripcion", "DescripcionEmpresa", "Estado" ],
            ID: "TipoMonedaData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'getTipoMoneda',
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

function crearTipoMoneda() {

    var blValidateFields = validateEmptyFields(["txtDescripcion", "slcEmpresa" ]);

    if (blValidateFields)
    {
        var strCodigo = $('#txtCodigo').val();
        var strDescripcion = $('#txtDescripcion').val();
        var strEmpresaId = $('#slcEmpresa').val();
        var strCreadoPor = $('#txtCreadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "EmpresaID": strEmpresaId, "CreadoPor": strCreadoPor, "Codigo":strCodigo };

        var objRequestParams = {
            CBFunction: "cbcrearTipoMoneda",
            Action: "../TipoMoneda/crearTipoMoneda",
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

function cbcrearTipoMoneda(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getTipoMoneda(0, nuPageLengthClientData);
            $('#txtDescripcion').val('');
            $('#slcEmpresa').val('');
            showITCMessage({ Title: "Información", Msg: "Insertado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function cambiarEstadoTipoMoneda(jsonRowData) {

    var objJsonParams = { "ID": jsonRowData.MonedaID };

    var objRequestParams = {
        CBFunction: "cbCambiarEstadoTipoMoneda",
        Action: "../TipoMoneda/cambiarEstadoTipoMoneda",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbCambiarEstadoTipoMoneda(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getTipoMoneda(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function getTipoMonedaDetail(jsonResp) {
    ID = jsonResp.MonedaID;
    $('#txtModalDescripcion').val(jsonResp.Descripcion);
    $('#slcModalEmpresa').val(jsonResp.EmpresaID);
    $('#txtModalCodigo').val(jsonResp.Codigo);
    $('#divModalTipoMonedaDetail').modal("show");
}

var ID = '';

function actualizarTipoMoneda() {

    var blValidateFields = validateEmptyFields(["txtModalDescripcion", "slcModalEmpresa"]);

    if (blValidateFields)
    {
        var strCodigo = $('#txtModalCodigo').val();
        var strDescripcion = $('#txtModalDescripcion').val();
        var strEmpresaId = $('#slcModalEmpresa').val();
        var strModificadoPor = $('#txtModalModificadoPor').val();
        var objJsonParams = { "Codigo": strCodigo, "Descripcion": strDescripcion, "EmpresaID": strEmpresaId, "ModificadoPor": strModificadoPor, "ID": ID };

        var objRequestParams = {
            CBFunction: "cbActualizarTipoMoneda",
            Action: "../TipoMoneda/actualizarTipoMoneda",
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

function cbActualizarTipoMoneda(jsonResp) {

    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            $('#divModalTipoMonedaDetail').modal("hide");
            getTipoMoneda(0, nuPageLengthClientData);
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