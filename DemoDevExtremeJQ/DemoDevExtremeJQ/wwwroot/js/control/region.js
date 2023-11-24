var nuPageLengthClientData = 10;

$(document).ready(function () {

    $('#viewDetails').hide();
    $('#viewEdit').hide();

    getRegion(0, nuPageLengthClientData);
    fetchRegional();
});

function getRegion(nuPage, nuRowsPerPage) {

    nuPageLengthClientData = nuRowsPerPage; 
    var objJsonParams = {
        Page: nuPage,
        RowsPerPage: nuRowsPerPage
    };

    var objRequestParams = {
        CBFunction: "cbGetRegion",
        Action: "../Region/GetRegion",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }

    getDataFromADS(objRequestParams);
}

function cbGetRegion(jsonResp) {

    if (jsonResp.resp) {

        var arrayDataTbl = JSON.parse("[]");

        if (jsonResp.data != null) {
            arrayDataTbl = JSON.parse(jsonResp.data);
        }

        var botones = [
            { ICON: "fa-edit", EVENT: "getRegionDetail", TITLE: "Click para editar." },
            { ICON: "fa-trash", EVENT: "deleteRegion", TITLE: "Click para eliminar." }
        ];

        var jsonTable = {
            DATA: arrayDataTbl,
            LABEL: ["Codigo Departamento", "Departamento", "Codigo Municipio", "Municipio", "Regional", "Acciones"],
            COLS: ["vcCodDpto", "vcNomDpto", "vcCodMunicipio", "vcNomMunicipio", "NombreRegional"],
            ID: "RegionData",
            ORDERPOSITION: 0,
            BUTTONS: botones,
            CBPaginate: 'getRegion',
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

function createRegion() {

    var blValidateFields = validateEmptyFields(["txtCodDpto", "txtNomDpto", "txtCodMunicipio", "txtNomMunicipio", "slcRegional"]);

    if (blValidateFields) {

        var strCodDpto = $('#txtCodDpto').val();
        var strNomDpto = $('#txtNomDpto').val();
        var strCodMunicipio = $('#txtCodMunicipio').val();
        var strNomMunicipio = $('#txtNomMunicipio').val();
        var strRegionalId = $('#slcRegional').val();
        var objJsonParams = {
            "CodDpto": strCodDpto,
            "NomDpto": strNomDpto,
            "CodMunicipio": strCodMunicipio,
            "NomMunicipio": strNomMunicipio,
            "RegionalId": strRegionalId
        };

        var objRequestParams = {
            CBFunction: "cbCreateRegion",
            Action: "../Region/CreateRegion",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
    else
    {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Los campos Codigo de departamento, Nombre de departamento, Codigo de municipio, Nombre de municipio y Regional son obligatorios",
            Type: "Warning"
        };
        showITCMessage(jsonMsg);
    }
}

function cbCreateRegion(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getRegion(0, nuPageLengthClientData);
            $('#txtCodDpto').val('');
            $('#txtNomDpto').val('');
            $('#txtCodMunicipio').val('');
            $('#txtNomMunicipio').val('');
            $('#slcRegional').val('');
            showITCMessage({ Title: "Información", Msg: "Insertado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function deleteRegion(jsonRowData) {

    var objJsonParams = { "ID": jsonRowData.tbl_RegionID };

    var objRequestParams = {
        CBFunction: "cbDeleteRegion",
        Action: "../Region/DeleteRegion",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbDeleteRegion(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            getRegion(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function getRegionDetail(jsonResp) {

    ID = jsonResp.tbl_RegionID;
    $('#txtModalCodDpto').val(jsonResp.vcCodDpto);
    $('#txtModalNomDpto').val(jsonResp.vcNomDpto);
    $('#txtModalCodMunicipio').val(jsonResp.vcCodMunicipio);
    $('#txtModalNomMunicipio').val(jsonResp.vcNomMunicipio);
    $('#slcModalRegional').val(jsonResp.RegionalID);
    $('#divModalRegionDetail').modal("show");
}

var ID = '';

function updateRegional() {

    var blValidateFields = validateEmptyFields(["txtModalCodDpto", "txtModalNomDpto", "txtModalCodMunicipio", "txtModalNomMunicipio", "slcModalRegional"]);

    if (blValidateFields) {
        var strCodDpto = $('#txtModalCodDpto').val();
        var strNomDpto = $('#txtModalNomDpto').val();
        var strCodMunicipio = $('#txtModalCodMunicipio').val();
        var strNomMunicipio = $('#txtModalNomMunicipio').val();
        var strRegionalId = $('#slcModalRegional').val();
        var objJsonParams = {
            "CodDpto": strCodDpto,
            "NomDpto": strNomDpto,
            "CodMunicipio": strCodMunicipio,
            "NomMunicipio": strNomMunicipio,
            "RegionalId": strRegionalId,
            "ID": ID
        };

        var objRequestParams = {
            CBFunction: "cbUpdateRegion",
            Action: "../Region/UpdateRegion",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
    else
    {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Los campos Codigo de departamento, Nombre de departamento, Codigo de municipio, Nombre de municipio y Regional son obligatorios",
            Type: "Warning"
        };
        showITCMessage(jsonMsg);
    }
}

function cbUpdateRegion(jsonResp) {

    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            $('#divModalRegionDetail').modal("hide");
            getRegion(0, nuPageLengthClientData);
            showITCMessage({ Title: "Información", Msg: "Actualizado", Type: "Success" });
        }

    } else {
        // No hay registros
        showITCMessage({ Title: "Información", Msg: jsonResp.msg, Type: "Warning" });
    }
}

function fetchRegional() {

    jsData = null;

    const objRequestParams =
    {
        CBFunction: "cbFetchRegional",
        Action: "Regional/GetRegionales",
        Data: jsData,
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbFetchRegional(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        const arrayRegionales = tryParseJson(objJsonResponse.data, identity, () => []);
        loadCombo('slcRegional', 'RegionalID', 'Nombre', arrayRegionales);
        loadCombo('slcModalRegional', 'RegionalID', 'Nombre', arrayRegionales);
    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}
