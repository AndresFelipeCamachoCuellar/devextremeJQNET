var strUriAnterior = "";
var globalJson = {};
var strUriActual = "./";
var nuFileRows = 0;
var nuRow = 0;
var nuRowsPerUpload = 25;
var blHeaderFirstRow = true;
var arrayData = new Array();
var strHeader = "";
var arrayHeader = new Array();
var strColSeparator = ";";
var nuRows = 0;
var nuErrors = 0;
var strClientDataId = "";

var ITC_USERID = "";
var ITC_ROLE = "";

/**
 * Author: Juan David Bonilla Á
 * Date: 11/02/2022
 * Desc: Construye un select a partir de un json o un array
 */
function BuildSelect(jsonSelect) {

    var strOptions = "";

    if (typeof (jsonSelect.DefaultText) !== "undefined") {
        strOptions = "<option selected='selected' value=''>" + jsonSelect.DefaultText + "</option>";
    }

    if (typeof (jsonSelect.Array) !== "undefined") {

        switch (jsonSelect.ArrayDimension) {

            case 1:

                for (var i = 0; i < jsonSelect.Array.length; i++) {

                    strOptions += "<option value='" + jsonSelect.Array[i] + "'>" + jsonSelect.Array[i] + "</option>";
                }

                if (jsonSelect.Id.split(",").length > 1) {

                    for (var j = 0; j < jsonSelect.Id.split(",").length; j++) {

                        $("#" + jsonSelect.Id.split(",")[j]).html(strOptions);

                        if (jsonSelect.select2) {
                            $("#" + jsonSelect.Id.split(",")[j]).select2({
                                theme: 'bootstrap4',
                                width: 'style',
                                placeholder: $(this).attr('placeholder'),
                                allowClear: Boolean($(this).data('allow-clear')),
                            });
                        }
                    }

                } else {

                    $("#" + jsonSelect.Id).html(strOptions);
                    if (jsonSelect.select2) {
                        $("#" + jsonSelect.Id).select2({
                            theme: 'bootstrap4',
                            width: 'style',
                            placeholder: $(this).attr('placeholder'),
                            allowClear: Boolean($(this).data('allow-clear')),
                        });
                    }
                }
                break;
            default:
            case 2:
                for (var i = 0; i < jsonSelect.Array.length; i++) {

                    strOptions += "<option value='" + jsonSelect.Array[i][0] + "'>" + jsonSelect.Array[i][1] + "</option>";
                }

                if (jsonSelect.Id.split(",").length > 1) {

                    for (var j = 0; j < jsonSelect.Id.split(",").length; j++) {

                        $("#" + jsonSelect.Id.split(",")[j]).html(strOptions);

                        if (jsonSelect.select2) {
                            $("#" + jsonSelect.Id.split(",")[j]).select2({
                                theme: 'bootstrap4',
                                width: 'style',
                                placeholder: $(this).attr('placeholder'),
                                allowClear: Boolean($(this).data('allow-clear')),
                            });
                        }
                    }
                } else {
                    $("#" + jsonSelect.Id).html(strOptions);

                    if (jsonSelect.select2) {
                        $("#" + jsonSelect.Id).select2({
                            theme: 'bootstrap4',
                            width: 'style',
                            placeholder: $(this).attr('placeholder'),
                            allowClear: Boolean($(this).data('allow-clear')),
                        });
                    }
                }
                break;
        }
    } else {

        for (var i = 0; i < jsonSelect.jsonData.length; i++) {

            strOptions += "<option value='" + jsonSelect.jsonData[i][jsonSelect.value] + "'>" + jsonSelect.jsonData[i][jsonSelect.text] + "</option>";
        }

        if (jsonSelect.Id.split(",").length > 1) {

            for (var j = 0; j < jsonSelect.Id.split(",").length; j++) {

                $("#" + jsonSelect.Id.split(",")[j]).html(strOptions);

                if (jsonSelect.select2) {
                    $("#" + jsonSelect.Id.split(",")[j]).select2({
                        theme: 'bootstrap4',
                        width: 'style',
                        placeholder: $(this).attr('placeholder'),
                        allowClear: Boolean($(this).data('allow-clear')),
                    });
                }
            }
        } else {
            $("#" + jsonSelect.Id).html(strOptions);

            if (jsonSelect.select2) {
                $("#" + jsonSelect.Id).select2({
                    theme: 'bootstrap4',
                    width: 'style',
                    placeholder: $(this).attr('placeholder'),
                    allowClear: Boolean($(this).data('allow-clear')),
                });
            }
        }

    }
}

function buildSelect(arrayData, slcId, strAux) {

    var strOption = "<option value='' >Seleccione</option>";

    for (var i = 0; i < arrayData.length; i++) {



        if (strAux !== "") {
            strOption += "<option value='" + arrayData[i].COD + "' " + strAux + "='" + arrayData[i].AUX + "' >" + arrayData[i].VAL + "</option>"
        } else {
            strOption += "<option value='" + arrayData[i].COD + "' >" + arrayData[i].VAL + "</option>"
        }

    }
    $("#" + slcId).html(strOption);

}

function LoadMenuOpt(strUriPath) {
    $('#divLoaderText').html("<p>Cargando.<br/><small>Por favor espere</small></p>");
    $('#divModalLoading').modal("show");
    $('#divContenido').load(strUriPath, function (response, status, xhr) {
        if (status == "error") {
            window.location.href = "./Home/SessionExpired";
        }
        if (status == "success") {
            $('#divModalLoading').modal("hide");
            setTimeout(function () {
                if (currentAjaxPendingRequest == 0) {  
                    $('#divModalLoading').modal("hide");
                    $("#divModalLoading.show").modal("hide");
                }
            }, 700);
        }
    });
}

function toggleMenu() {

    $("body").toggleClass("sidebar-toggled");

    $(".sidebar").toggleClass("toggled");

    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    };
}

function logoutPortalHR() {
    $("#wrapper").hide();
    window.location.href = "../";
}

var blLoadRol = false;

function setRolUsuario(rolUsuario) {

    //Solicitudes
    $("#liSolicitud").hide();
    $("#aCollapseSolicitudes").hide();
    $("#H6Solicitudes").hide();
    $("#aVerSolicitud").hide();
    $("#aNuevaSolicitud").hide();

    var objJsonParams = {
        rolUsuario: rolUsuario,
    };

    var objRequestParams = {
        CBFunction: "cbSetRolSession",
        Action: "../RoleManagement/SetRolSession",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

var blLoadParam = true;

function cbSetRolSession(jsonResp) {

    if (jsonResp.resp) {

        var jsonData = JSON.parse(jsonResp.data);

        GetEstadosSolicitudContrato(jsonData.rolId);

        if (typeof (jsonData.modulos) !== 'undefined') {
            setRolMenu(jsonData.modulos);
        }

        if (blLoadParam) {

            blLoadParam = false;

            setTimeout(function () {
                GetParametros();
            }, 500);
        }

        $('#divContenido').load("./Main/Index");

    }
    else {
        var jsonMsg = {
            Title: "Mensaje",
            Msg: jsonResp.msg,
            Type: jsonResp.type
        };
        showITCMessage(jsonMsg);
    }
}

function setRolMenu(arrayRoleMenu) {

    arrayRoleMenu = JSON.parse(arrayRoleMenu);

    if (arrayRoleMenu !== null && arrayRoleMenu.length > 0) {

        for (var i = 0; i < arrayRoleMenu.length; i++) {

            if (arrayRoleMenu[i].MODULO === "Solicitudes") {

                $("#liSolicitud").show();
                $("#aCollapseSolicitudes").show();
                $("#H6Solicitudes").show();

                if (arrayRoleMenu[i].EVENTO === "Visualizar") {
                    $("#aVerSolicitud").show();
                }

                if (arrayRoleMenu[i].EVENTO === "Crear") {
                    $("#aNuevaSolicitud").show();
                }

            }

            if (arrayRoleMenu[i].MODULO === "Contratos") {

                $("#aCollapseSolicitudes").show();
                $("#liSolicitud").show();
                $("#H6Contratos").show();

                if (arrayRoleMenu[i].EVENTO === "Visualizar") {
                    $("#aVerContratos").show();
                }

            }

            if (arrayRoleMenu[i].MODULO === "GestionUsuarios") {

                $("#liUsuarios").show();
                $("#aCollapseUsuario").show();

                if (arrayRoleMenu[i].EVENTO === "Visualizar") {
                    $("#aVerUsuario").show();
                }
            }

            if (arrayRoleMenu[i].MODULO === "DataParametrica") {

                $("#liParametros").show();
                $("#aCollapseParametros").show();

                if (arrayRoleMenu[i].EVENTO === "Visualizar") {
                    $("#aAdminEmpresas").show();
                    $("#AdminRols").show();
                    $("#AdminRegional").show();
                    $("#AdminTipoMoneda").show();
                    $("#AdminTipoSolictud").show();
                    $("#AdminTipoContrato").show();
                    $("#AdminRegion").show();
                }
            }

            if (arrayRoleMenu[i].MODULO === "Agendamiento") {

                $("#liAgendamiento").show();
                $("#aCollapseModuloAgendamiento").show();

                if (arrayRoleMenu[i].EVENTO === "Visualizar") {
                    $("#H6Comite").hide();
                    $("#aComitesAgendados").show();
                }
                if (arrayRoleMenu[i].EVENTO === "Agendar") {
                    $("#H6Comite").show();
                    $("#aAgendarComite").show();
                }
            }

        }

    } else {
        var jsonMsg = {
            Title: "Mensaje",
            Msg: "El rol seleccionado no posee ningún permiso asociado.",
            Type: "Error"
        };
        showITCMessage(jsonMsg);
    }

}