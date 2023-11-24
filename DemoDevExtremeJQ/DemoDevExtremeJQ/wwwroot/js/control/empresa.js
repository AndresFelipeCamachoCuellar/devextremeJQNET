
var nuPageLengthClientData = 10;

$(document).ready(function () {

    $('#viewDetails').hide();
    $('#viewEdit').hide();

    getEmpresas(0, nuPageLengthClientData);
});

function getEmpresas(nuPage, nuRowsPerPage) {

    nuPageLengthClientData = nuRowsPerPage;

    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage
    };

    var objRequestParams = {
        CBFunction: "cbGetEmpresas",
        Action: "../Empresa/GetEmpresas",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }

    getDataFromADS(objRequestParams);
}

function cbGetEmpresas(jsonResp) {

    if (jsonResp.resp) {

        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {

            arrayDataTbl = JSON.parse(jsonResp.data);

        }

        var botones = [
            { ICON: "fa-edit", EVENT: "getEmpresaDetail", TITLE: "Click para editar." },
            { ICON: "fa-trash", EVENT: "deleteEmpresa", TITLE: "Click para eliminar." }
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Descripción", "Estado", "Creado", "Fecha de Creación", "Acciones"],
            COLS: ["Descripcion", "Estado", "CreadoPor", "FechaCreacion"],
            ID: "EmpresasData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'getEmpresas',
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

function createEmpresa() {

    var blValidateFields = validateEmptyFields(["txtDescripcion", "txtLogo", "txtFondo"]);

    if (blValidateFields) {
        var strDescripcion = $('#txtDescripcion').val();
        var strLogo = $('#txtLogo').val();
        var strFondo = $('#txtFondo').val();
        var strCreadoPor = $('#txtCreadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "Logo": strLogo, "Fondo": strFondo, "CreadoPor": strCreadoPor };

        var objRequestParams = {
            CBFunction: "cbCreateEmpresa",
            Action: "../Empresa/CreateEmpresa",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
    else {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Los campos descripción, logo y fondo son obligatorios",
            Type: "Warning"
        };
        showITCMessage(jsonMsg);
    }
}

function cbCreateEmpresa(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getEmpresas(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: "Insertado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function deleteEmpresa(jsonRowData) {

    var objJsonParams = { "ID": jsonRowData.EmpresaID };

    var objRequestParams = {
        CBFunction: "cbDeleteEmpresa",
        Action: "../Empresa/DeleteEmpresa",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbDeleteEmpresa(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getEmpresas(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: "Eliminado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function getEmpresaDetail(jsonResp) {
    ID = jsonResp.EmpresaID;
    $('#txtModalDescripcion').val(jsonResp.Descripcion);
    $('#txtModalLogo').val(jsonResp.LogoURL);
    $('#txtModalFondo').val(jsonResp.FondoURL);
    $('#divModalEmpresaDetail').modal("show");
}

var ID = '';

function updateEmpresa() {

    var blValidateFields = validateEmptyFields(["txtModalDescripcion", "txtModalLogo", "txtModalFondo"]);

    if (blValidateFields) {

        var strDescripcion = $('#txtModalDescripcion').val();
        var strLogo = $('#txtModalLogo').val();
        var strFondo = $('#txtModalFondo').val();
        var strModificadoPor = $('#txtModalModificadoPor').val();
        var objJsonParams = { "Descripcion": strDescripcion, "Logo": strLogo, "Fondo": strFondo, "ModificadoPor": strModificadoPor, "ID": ID };

        var objRequestParams = {
            CBFunction: "cbUpdateEmpresa",
            Action: "../Empresa/updateEmpresa",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
    else {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Los campos descripción, logo y fondo son obligatorios",
            Type: "Warning"
        };
        showITCMessage(jsonMsg);
    }
}

function cbUpdateEmpresa(jsonResp) {

    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            $('#divModalEmpresaDetail').modal("hide");
            getEmpresas(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: "Actualizado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}