$(document).ready(function () {

    GetRoles();

});

/***************************** GET */
function GetRoles() {

    var objRequestParams = {
        CBFunction: "cbGetRoles",
        Action: "../Rol/GetRoles",
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbGetRoles(jsonResp) {

    var arrayDataTbl = JSON.parse("[]");

    if (jsonResp.resp && jsonResp.data != null) {

        arrayDataTbl = JSON.parse(jsonResp.data);

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


    var arrayButtons = [
        { ICON: "fa-edit", EVENT: "ShowDetail", TITLE: "Click para ver el Detalle." },
   //     { ICON: "fa-trash", EVENT: "DelelteRegister", TITLE: "Eliminar" }
    ];

    var jsonTable = {
        DATA: arrayDataTbl,
        LABEL: ["Descripci&oacute;n", "Estado", "F. Creaci&oacute;n", "F. Modificaci&oacute;n", "ACCIONES"],
        COLS: ["Descripcion", "Estado", "fCreacion", "fModificacion"],
        ID: "RolData",
        ORDERPOSITION: 2,
        BUTTONS: arrayButtons
    };

    buildTbl(jsonTable);

}

/***************************** CREATE */
function CreateRol() {
    let Descripcion = $('#formDescripcion').val();
    let Estado = $('#formEstado').val();
    let EmpresaID = $('#formEmpresaID').val();
    EmpresaID = "d8df3969-d7c3-40c3-903c-d013653cba76";

    var objJsonParams = {
        "Descripcion": Descripcion,
        "Estado": Estado,
        "CreadoPor": $("#emailSession").val(),
        "ModificadoPor": $("#emailSession").val(),
        "EmpresaID": EmpresaID
    };

    var objRequestParams = {
        CBFunction: "cbCreateRol",
        Action: "../Rol/CreateRol",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbCreateRol(jsonResp) {
 
    if (jsonResp.resp) {
        if (jsonResp.count > 0) {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro creado",
                Type: "Success"
            };

            $("#formDescripcion").val("");
            $("#formEstado").val("").trigger("change"); 
            showITCMessage(jsonMsg);
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: "No se creo el registro, por favor consulte al administrador.",
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
    GetRoles()
}

/***************************** DETAILS - UPDATE */
function ShowDetail(jsonRowData) {

    objSelectUser = jsonRowData;

    // Show Data
    $('#modalRolID').val(objSelectUser.RolID);
    $('#modalDescripcion').val(objSelectUser.Descripcion);
    $("#modalEstado").val(objSelectUser.Estado ? 1 : 0).trigger("change"); 
    $('#divModalForm').modal('show');

}

function UpdateRol() {

    var RolID = $("#modalRolID").val();
    var Descripcion = $("#modalDescripcion").val();
    var Estado = $("#modalEstado").val();


    var objJsonParams = {
        "RolID": RolID,
        "Descripcion": Descripcion,
        "Estado": Estado,
        "ModificadoPor": $("#emailSession").val(),
    };

    var objRequestParams = {
        CBFunction: "cbUpdateRol",
        Action: "../Rol/UpdateRol",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbUpdateRol(jsonResp) {

    if (jsonResp.resp) {

        if (jsonResp.count > 0) {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro Actualizado",
                Type: "Success"
            };
            showITCMessage(jsonMsg);

        } else {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: "No se encontraron registros de usuarios",
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
    GetRoles()
}

/***************************** DELETE */

function DelelteRegister(jsonRowData) {

    let RolID = jsonRowData.RolID;

    var objJsonParams = {
        "RolID": RolID,
    };

    var objRequestParams = {
        CBFunction: "cbDeleteteRol",
        Action: "../Rol/DeleteteRol",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

function cbDeleteteRol(jsonResp) {

    if (jsonResp.resp) {

        if (jsonResp.count > 0) {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro eliminado",
                Type: "Success"
            };
            showITCMessage(jsonMsg);

        } else {

            var jsonMsg = {
                Title: "Mensaje",
                Msg: "No se encontraron registros",
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
    GetRoles()
}
/***************************** END */