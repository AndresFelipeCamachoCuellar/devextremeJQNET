
var nuPageLengthClientData = 10;

$(document).ready(function () {

    $('#viewDetails').hide();
    $('#viewEdit').hide();

    getTipoContratos(0, nuPageLengthClientData);
    fetchEmpresas();
});

function getTipoContratos(nuPage, nuRowsPerPage) {

    nuPageLengthClientData = nuRowsPerPage; 
    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage
    };

    var objRequestParams = {
        CBFunction: "cbGetTipoContratos",
        Action: "../TipoContrato/GetTipoContratos",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }

    getDataFromADS(objRequestParams);
}

function cbGetTipoContratos(jsonResp) {

    if (jsonResp.resp) {

        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }

        var botones = [
            { ICON: "fa-edit", EVENT: "getTipoContratoDetail", TITLE: "Click para editar." },
            { ICON: "fa-trash", EVENT: "changeStateTipoContrato", TITLE: "Click para habilitar/inhabilitar." }
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Descripción", "Empresa", "Estado", "Creado", "Fecha de Creación", "Acciones"],
            COLS: ["Descripcion", "DescripcionEmpresa", "Estado", "CreadoPor", "FechaCreacion"],
            ID: "TipoContratoData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'getTipoContratos',
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

function createTipoContrato() {

    var blValidateFields = validateEmptyFields(["txtDescripcion", "slcEmpresa" ]);

    if (blValidateFields)
    {
        var strDescripcion = $('#txtDescripcion').val();
        var strEmpresaId = $('#slcEmpresa').val();
        var strCreadoPor = $('#txtCreadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "EmpresaID": strEmpresaId, "CreadoPor": strCreadoPor };

        var objRequestParams = {
            CBFunction: "cbCreateTipoContrato",
            Action: "../TipoContrato/CreateTipoContrato",
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

function cbCreateTipoContrato(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getTipoContratos(0, nuPageLengthClientData);
            $('#txtDescripcion').val('');
            $('#slcEmpresa').val('');
            showITCMessage({ Title: "Información", Msg: "Insertado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function changeStateTipoContrato(jsonRowData) {

    var objJsonParams = { "ID": jsonRowData.TipoContratoID };

    var objRequestParams = {
        CBFunction: "cbChangeStateTipoContrato",
        Action: "../TipoContrato/ChangeStateTipoContrato",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbChangeStateTipoContrato(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getTipoContratos(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function getTipoContratoDetail(jsonResp) {
    ID = jsonResp.TipoContratoID;
    $('#txtModalDescripcion').val(jsonResp.Descripcion);
    $('#slcModalEmpresa').val(jsonResp.EmpresaID);
    $('#divModalTipoContratoDetail').modal("show");
}

var ID = '';

function updateTipoContrato() {

    var blValidateFields = validateEmptyFields(["txtModalDescripcion", "slcModalEmpresa"]);

    if (blValidateFields)
    {
        var strDescripcion = $('#txtModalDescripcion').val();
        var strEmpresaId = $('#slcModalEmpresa').val();
        var strModificadoPor = $('#txtModalModificadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "EmpresaID": strEmpresaId, "ModificadoPor": strModificadoPor, "ID": ID };

        var objRequestParams = {
            CBFunction: "cbUpdateTipoContrato",
            Action: "../TipoContrato/UpdateTipoContrato",
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

function cbUpdateTipoContrato(jsonResp) {

    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            $('#divModalTipoContratoDetail').modal("hide");
            getTipoContratos(0, nuPageLengthClientData);
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