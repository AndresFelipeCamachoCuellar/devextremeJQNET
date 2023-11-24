$(document).ready(function () {

    GetRegional();

});

/***************************** GET */
function GetRegional() {
    var objJsonParams =
        { "regionalName": "" }

    const objRequestParams = {
        CBFunction: "cbGetRegional",
        Action: "CategoriasRegionales/GetRegional",
        Data: JSON.stringify({ data: objJsonParams }),
        Loading: true
    };
    getDataFromADS(objRequestParams);
}

function cbGetRegional(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data != null) {
            let arrayButtons = [
                { ICON: "fa-search", EVENT: "GetRegionDetail", TITLE: "Click para ver el detalle del registro." },
                { ICON: "fa-trash", EVENT: "RemoveRegion", TITLE: "Click para eliminar el registro." }
            ];

            let arrayDataTbl = JSON.parse(jsonResp.data);
            var jsonTable = {
                DATA: arrayDataTbl,
                LABEL: ["Codigo", "Nombre", "Estado", "Fecha Modificacion", "Acciones"],
                COLS: ["Codigo", "Nombre", "Estado", "FechaModificacion"],
                ID: "RegionsData",
                //ORDERPOSITION: 0,
                ROWS: jsonResp.count,
                BUTTONS: arrayButtons,
            };

            buildTbl(jsonTable);

        } else {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: "No se encontraron registros para el rango de fechas seleccionadas.",
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    } else {
        if (jsonResp.type === "Session") {
            $('#divModalMsgSession').modal('show');
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.msg,
                Type: jsonResp.type
            };

            showITCMessage(jsonMsg);
        }
    }
}



/***************************** DETAILS - UPDATE */
function GetRegionDetail(jsonRowData) {
    $("#modalNombreRegional").val(jsonRowData.Nombre);
    $("#modalCodigoRegional").val(jsonRowData.Codigo);
    $("#modalEstadoRegional").val(jsonRowData.Estado ? 1 : 0).trigger("change"); 
    $("#modalRegionalIDRegional").val(jsonRowData.RegionalID);
    $("#divModalCreateRegional").modal('show');
}

function UpdateRegional() {
    var objJsonParams = {
        "nombre": $("#modalNombreRegional").val(),
        "codigo": $("#modalCodigoRegional").val(),
        "estado": $("#modalEstadoRegional").val(),
        "regionalID": $("#modalRegionalIDRegional").val()
    };

    const objRequestParams = {
        CBFunction: "cbUpdateRegional",
        Action: "CategoriasRegionales/UpdateRegional",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };
    getDataFromADS(objRequestParams);
}

function cbUpdateRegional(jsonResp) {

    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro actualizado.",
                Type: "Success"
            };
            showITCMessage(jsonMsg);
        } else {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    } else {
        if (jsonResp.type === "Session") {
            $('#divModalMsgSession').modal('show');
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.msg,
                Type: jsonResp.type
            };

            showITCMessage(jsonMsg);
        }
    }
    GetRegional();
}

/***************************** DELETE */
function RemoveRegion(jsonRowData) {

    const objRequestParams = {
        CBFunction: "cbRemoveRegion",
        Action: "CategoriasRegionales/RemoveRegion",
        Data: JSON.stringify({ Data: JSON.stringify(jsonRowData) }),
        Loading: true
    };
    getDataFromADS(objRequestParams);
}

function cbRemoveRegion(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro eliminado.",
                Type: "Success"
            };

            showITCMessage(jsonMsg);
        } else {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    } else {
        if (jsonResp.type === "Session") {
            $('#divModalMsgSession').modal('show');
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.msg,
                Type: jsonResp.type
            };

            showITCMessage(jsonMsg);
        }
    }
    GetRegional();
}


/***************************** CREATE */

function CreateRegional() {
    let nameRegional = $("#nombreRegional").val();
    let codigoRegional = $("#codigoRegional").val();
    let estadoRegional = $("#estadoRegional").val();
    let EmpresaID = $('#formEmpresaID').val();
    EmpresaID = "d8df3969-d7c3-40c3-903c-d013653cba76";

    var objJsonParams = {
        "nombre": nameRegional,
        "codigo": codigoRegional,
        "estado": estadoRegional,
        "CreadoPor": $("#emailSession").val() ? $("#emailSession").val():"",
        "ModificadoPor": $("#emailSession").val()? $("#emailSession").val():"",
        "EmpresaID": EmpresaID
    };

    const objRequestParams = {
        CBFunction: "cbCreateRegion1",
        Action: "CategoriasRegionales/CreateRegional",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };
    getDataFromADS(objRequestParams);
}

function cbCreateRegion1(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro creado.",
                Type: "Success"
            };
            $("#nombreRegional").val("");
            $("#codigoRegional").val("");
            $("#estadoRegional").val("").trigger("change"); 
            showITCMessage(jsonMsg);
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
    GetRegional();
}

/***************************** END */