/**
 * Descripcion: Se define libreria para implementación de funcionalidades genericas
 * Autor: Doney Hernandez
 * Fecha: 08 de Marzo de 2019
 * Version 1.0
*/
var currentAjaxPendingRequest = 0;
/**
 * Descripcion: Metodo que permite consultar un servicio por medio de una url y unos parametros, los cuales deben ir por medio de un obj json
 * Autor: Doney Hernandez
 * Fecha: 20 de Marzo de 2019
 * Version 1.0
 * Params: Objeto json con las siguientes propiedades
 * LoaderText: Texto a desplegar en el loader
 * Loading: Variable que permite definir si se muestra o no la animación del loading.
 * Data: Obj json con los parametros que recibe el servicio.
 * CBFunction: Nombre de metodo que sirve como callback para un evento de respuesta exitoso.
*/
function getDataFromADS(jsonParams) {

    var strLoaderText = "<p>Consultando.<br/><small>Por favor espere</small></p>";

    if (typeof (jsonParams.LoaderText) !== "undefined") { strLoaderText = jsonParams.LoaderText; }

    $('#divLoaderText').html(strLoaderText);

    if (typeof (jsonParams.TYPE) === "undefined") { jsonParams.TYPE = "POST"; }

    if (typeof (jsonParams.Loading) === "undefined") { jsonParams.Loading = true; }

    if (typeof (jsonParams.CBErrorFunction) === "undefined") { jsonParams.CBErrorFunction = ""; }

    if (typeof (jsonParams.Data) === "undefined") { jsonParams.Data = ""; }
    else { if (jsonParams.Data !== "") { jsonParams.Data = ITCXSS(jsonParams.Data); } }

    if (typeof (jsonParams.DataType) === "undefined") { jsonParams.DataType = "json"; }

    if (jsonParams.Loading) { $('#divModalLoading').modal("show"); }

    try {
        $.ajax({
            type: jsonParams.TYPE,
            url: jsonParams.Action,
            contentType: "application/json; charset=utf-8",
            data: jsonParams.Data,
            dataType: jsonParams.DataType,
            beforeSend: () => {
                if (jsonParams.Loading) { currentAjaxPendingRequest++; }
            },
            success: function (msg) {

                if (typeof (msg.d) !== "undefined") {

                    if (msg.d) {

                        var jsonResp = eval("(" + msg.d + ")");
                        window[jsonParams.CBFunction](jsonResp);

                    } else {

                        cbErrorFromADS(jsonParams.CBErrorFunction);
                    }
                }
                else {
                    if (msg.type === "Session" || msg.Type === "Session") {

                        let redirect = "../Home/SessionExpired";
                        if (typeof (msg.redirect) !== "undefined" && msg.redirect != null) {
                            redirect = msg.redirect;
                        } else {
                            if (typeof (msg.Redirect) !== "undefined" && msg.Redirect != null) {
                                redirect = msg.Redirect;
                            }
                        }

                        window.location.href = redirect;

                    } else {
                        window[jsonParams.CBFunction](msg);
                    }
                }
            },
            error: function (req, status, error) {
                cbErrorFromADS(jsonParams.CBErrorFunction);
            },
            complete: function () {

                if (jsonParams.Loading) {
                    currentAjaxPendingRequest--;
                    if (currentAjaxPendingRequest == 0) {
                        setTimeout(function () {
                            $('#divModalLoading').modal("hide");
                        }, 500);
                    }
                }
            }
        });
    }
    catch (error) {

        setTimeout(function () {
            $('#divModalLoading').modal('hide');
            $("#divModalLoading.show").modal("hide");
        }, 500);

        console.error(error);
    }
}

function cbErrorFromADS(strErrorMsg) {

    var strError = "Ocurrió un error inesperado, por favor consulte al administrador.";

    if (strErrorMsg !== null && strErrorMsg !== "") {
        strError = strErrorMsg;
    }

    var jsonMsg = {
        Title: "Error",
        Type: "Error",
        Msg: strError
    };

    showITCMessage(jsonMsg);
}

/**
 * Descripcion: Método para enviar archivos y datos, que permite consultar un servicio por medio 
 * de una url y unos parametros, los cuales deben ir por medio de un obj json.
 * Autor: Carlos Caicedo
 * Fecha: 24 de Junio de 2020
 * Version 1.0
 * Params: Objeto json con las siguientes propiedades
 * LoaderText: Texto a desplegar en el loader
 * Loading: Variable que permite definir si se muestra o no la animación del loading.
 * Data: Obj FormData con los parametros que recibe el servicio.
 * CBFunction: Nombre de metodo que sirve como callback para un evento de respuesta exitoso.
*/
function getFormDataFromADS(jsonParams) {

    var strLoaderText = "<p>Consultando.<br/><small>Por favor espere</small></p>";

    if (typeof (jsonParams.LoaderText) !== "undefined") {
        strLoaderText = jsonParams.LoaderText;
    }

    $('#divLoaderText').html(strLoaderText);

    if (typeof (jsonParams.Data) === "undefined") {
        return cbErrorFormDataFromADS("No se enviaron datos");
    }

    if (typeof (jsonParams.TYPE) === "undefined") {
        jsonParams.TYPE = "POST";
    }

    if (typeof (jsonParams.Loading) === "undefined") {
        jsonParams.Loading = true;
    }

    if (typeof (jsonParams.CBErrorFunction) === "undefined") {
        jsonParams.CBErrorFunction = "";
    }

    if (jsonParams.Loading) {
        $('#divModalLoading').modal("show");
    }

    try {
        $.ajax({
            method: jsonParams.TYPE,
            url: jsonParams.Action,
            contentType: false,
            processData: false,
            data: jsonParams.Data,
            beforeSend: function () {
                if (jsonParams.Loading) {
                    currentAjaxPendingRequest++;
                }
            },
            success: function (msg) {

                if (jsonParams.Loading) {
                    currentAjaxPendingRequest--;
                    let interval = setInterval(function () {
                        if (currentAjaxPendingRequest == 0) {
                            $('#divModalLoading').modal("hide");
                            setTimeout(function () {
                                clearInterval(interval);
                            }, 500);
                        }
                    }, 500);
                }

                if (typeof (msg.d) !== "undefined") {

                    if (msg.d) {

                        var jsonResp = eval("(" + msg.d + ")");

                        window[jsonParams.CBFunction](jsonResp);

                    } else {
                        cbErrorFormDataFromADS(jsonParams.CBErrorFunction);
                    }
                }
                else {

                    if (msg.type === "Session" || msg.Type === "Session") {

                        let redirect = "../Home/SessionExpired";
                        if (typeof (msg.redirect) !== "undefined" && msg.redirect != null) {
                            redirect = msg.redirect;
                        } else {
                            if (typeof (msg.Redirect) !== "undefined" && msg.Redirect != null) {
                                redirect = msg.Redirect;
                            }
                        }

                        window.location.href = redirect;

                    } else {
                        window[jsonParams.CBFunction](msg);
                    }

                }
            },
            error: function (req, status, error) {
                setTimeout(function () {
                    $('#divModalLoading').modal('hide');
                }, 500);
                cbErrorFormDataFromADS(jsonParams.CBErrorFunction);
            }
        });
    }
    catch (error) {
        setTimeout(function () {
            $('#divModalLoading').modal('hide');
        }, 500);
        console.error(error);
    }
}

function cbErrorFormDataFromADS(strErrorMsg) {

    var strError = "Ocurrió un error inesperado, por favor consulte al administrador.";

    if (strErrorMsg !== null && strErrorMsg !== "") {
        strError = strErrorMsg;
    }

    var jsonMsg = {
        Title: "Error",
        Type: "Error",
        Msg: strError
    };
    showITCMessage(jsonMsg);
}

/**
 * Descripcion: Se metodo que permite mostrar una ventana modal con un mensaje customizado por el usuario
 * Autor: Doney Hernandez
 * Fecha: 08 de Marzo de 2019
 * Version 1.0
 * Params: Objeto json con las siguientes propiedades
 * Title: Titulo para las ventanas modales
 * Msg: mensaje a desplegar al usuario
 * Type: Tipo del mensaje: Warning, Error, Success
*/
function showITCMessage(jsonMsg) {

    var strMsg = "";

    switch (jsonMsg.Type) {
        case "Success":
            strMsg += '<div class="card border-left-success shadow py-2">';// h-50
            strMsg += '<div class="card-body">';
            strMsg += '<div class="row no-gutters align-items-center">';
            strMsg += '<div class="col mr-2">';
            strMsg += '<div class="text-s font-weight-bold text-success mb-1">' + jsonMsg.Msg + '</div>';
            strMsg += '</div>';
            strMsg += '<div class="col-auto">';
            strMsg += '<i class="fas fa-check-circle fa-2x" style="color:#1cc88a;"></i>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            break;
        case "Warning":
            strMsg += '<div class="card border-left-warning shadow py-2">';
            strMsg += '<div class="card-body">';
            strMsg += '<div class="row no-gutters align-items-center">';
            strMsg += '<div class="col mr-2">';
            strMsg += '<div class="text-s font-weight-bold text-warning mb-1">' + jsonMsg.Msg + '</div>';
            strMsg += '</div>';
            strMsg += '<div class="col-auto">';
            strMsg += '<i class="fas fa-info-circle fa-2x" style="color:#f6c23e;"></i>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            break;
        case "Error":
            strMsg += '<div class="card border-left-danger shadow py-2">';
            strMsg += '<div class="card-body">';
            strMsg += '<div class="row no-gutters align-items-center">';
            strMsg += '<div class="col mr-2">';
            strMsg += '<div class="text-s font-weight-bold text-danger mb-1">' + jsonMsg.Msg + '</div>';
            strMsg += '</div>';
            strMsg += '<div class="col-auto">';
            strMsg += '<i class="fas fa-window-close fa-2x" style="color:#e74a3b;"></i>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            strMsg += '</div>';
            break;
        default: "";
    }

    $('#h5ModalTitle').text(jsonMsg.Title);
    $('#divModalBody').html(strMsg);
    $('#divModalMsg').modal('show');
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
}

/**
Author: Juan David Bonilla Álvarez
Date: 28-01-2022
Desc: Método para obtener la fecha de hoy
*/
function GetToday() {

    let dtToday = addHours(-5, convertDateToUTC(new Date()));
    let dd = dtToday.getDate();
    let mm = dtToday.getMonth() + 1; //January is 0!
    let yyyy = dtToday.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return yyyy + '-' + mm + '-' + dd;
}

/**
 * Author: Juan David Bonilla Álvarez
 * Date: 12/04/2022
 * Desc: Valida campos (vacíos y min/max de fechas)
 */
function ValidateFields(jsonParam) {

    let blEmptyFields = false;
    let blInvalidDates = false;

    var jsonResp = {
        resp: true,
        msg: ""
    };

    let arrEmptyFields = [];

    if (typeof (jsonParam.arrayFields) !== "undefined") {
        arrEmptyFields = jsonParam.arrayFields;
    }

    for (var i = 0; i < arrEmptyFields.length; i++) {
        if ($("#" + arrEmptyFields[i]).val().trim() == "") {
            jsonResp.resp = false;
            blEmptyFields = true;
            $("#" + arrEmptyFields[i]).val("").change();
            $("#" + arrEmptyFields[i]).addClass("is-invalid");
            $("#" + arrEmptyFields[i]).change(function () { $(this).removeClass("is-invalid"); });
        } else {
            $("#" + arrEmptyFields[i]).removeClass("is-invalid");
        }
    };

    if (blEmptyFields) {
        jsonResp.msg = "Faltan campos obligatorios.";
        return jsonResp;
    };

    let arrDates = [];

    if (typeof (jsonParam.arrayDates) !== "undefined") {
        arrDates = jsonParam.arrayDates;
    }

    let strMsg = "";

    for (var i = 0; i < arrDates.length; i++) {

        let inputValue = $("#" + arrDates[i].id).val();
        let maxDate = arrDates[i].max != null ? arrDates[i].max.value : null;
        let minDate = arrDates[i].min != null ? arrDates[i].min.value : null;

        if (inputValue != "" && inputValue != null) {
            if (maxDate != null) {
                if (maxDate != "" && inputValue > maxDate) {
                    jsonResp.resp = false;
                    blInvalidDates = true;
                    $("#" + arrDates[i].id).val("").change();
                    $("#" + arrDates[i].id).addClass("is-invalid");
                    $("#" + arrDates[i].id).change(function () { $(this).removeClass("is-invalid"); });
                    strMsg += arrDates[i].max.msg + "<br>";
                } else {
                    $("#" + arrDates[i].id).removeClass("is-invalid");
                }
            }
            if (minDate != null) {
                if (minDate != "" && inputValue < minDate) {
                    jsonResp.resp = false;
                    blInvalidDates = true;
                    $("#" + arrDates[i].id).val("").change();
                    $("#" + arrDates[i].id).addClass("is-invalid");
                    $("#" + arrDates[i].id).change(function () { $(this).removeClass("is-invalid"); });
                    strMsg += arrDates[i].min.msg + "<br>";
                } else {
                    $("#" + arrDates[i].id).removeClass("is-invalid");
                }
            }
        }
    };

    $('.modal').on('hide.bs.modal', function (e) {
        $(this).find('*').each(function () {
            $(this).removeClass("is-invalid");
        });
    });

    if (blInvalidDates) {
        jsonResp.msg = strMsg;
        return jsonResp;
    };

    return jsonResp;
}

function validateEmptyFields(arrayFields) {

    var blEmpty = true;

    for (var i = 0; i < arrayFields.length; i++) {

        var strField = $("#" + arrayFields[i]).val();
        if (strField.trim() == "") {
            if (blEmpty) {
                blEmpty = false;
            }
        }
    }

    return blEmpty;
}

function showITCConfirm(jsonConfirm) {

    var strData = "";

    if (typeof (jsonConfirm.Data) !== "undefined") {
        strData = jsonConfirm.Data;
    }

    $('#h5ConfirmModalTitle').text(jsonConfirm.Title);
    $('#divConfirmModalBody').html(jsonConfirm.Body);
    $('#btnConfirmModal').off("click");
    $('#btnConfirmModal').click(function () { window[jsonConfirm.CBFunction](strData); });
    if (typeof (jsonConfirm.CBCancelFunction) !== "undefined") {
        $('#btnRechazarModal').click(function () { window[jsonConfirm.CBCancelFunction](strData); });
    }
    

    $('#divConfirmModal').modal('show');
}

function showITCModalTable(jsonModalTable) {

    var strData = "";

    if (typeof (jsonModalTable.Data) !== "undefined") {
        strData = jsonModalTable.Data;
    }

    var strLabelButton = "Aceptar";

    if (typeof (jsonModalTable.LabelButton) !== "undefined") {
        strLabelButton = jsonModalTable.LabelButton;
    }

    $('#btnModalTable').html(strLabelButton);

    $('#h5ModalTableTitle').text(jsonModalTable.Title);
    $('#divModalTableBody').html(jsonModalTable.Body);

    if (typeof (jsonModalTable.CBFunction) !== "undefined") {
        $('#btnModalTable').off("click");
        $('#btnModalTable').click(function () { window[jsonModalTable.CBFunction](strData); });
    }

    if (typeof (jsonModalTable.ShowBtnExp) !== "undefined") {
        if (jsonModalTable.ShowBtnExp) {
            $('#btnModalTable').show();
        } else {
            $('#btnModalTable').hide();
        }
    } else {
        $('#btnModalTable').show();
    }

    $('#divModalTable').modal('show');
}

function buildTbl(jsonTbl) {

    var nuPageLength = 10;
    var nuRows = 0;
    var nuPage = 0;

    var strHtmlTable = "";
    var strHtmlHeader = "";
    var strHtmlBody = "";

    var blScrollColumns = false;
    var arrColumnsScroll = [];

    if (typeof (jsonTbl.Scrollable) !== "undefined") {
        blScrollColumns = true;
        arrColumnsScroll = jsonTbl.Scrollable;
    }

    var blFixColumns = false;
    var arrColumnsLenght = [];
    if (typeof (jsonTbl.ColumnsPercentaje) !== "undefined") {
        blFixColumns = true;
        arrColumnsLenght = jsonTbl.ColumnsPercentaje;
    }

    var blTrafficLights = false;
    if (typeof (jsonTbl.trafficLights) !== "undefined") {
        blTrafficLights = jsonTbl.trafficLights;
    }

    var blPaginate = true;
    if (typeof (jsonTbl.blPaginate) !== "undefined") {
        blPaginate = jsonTbl.blPaginate;
    }

    var blScrollY = false;
    var strScrollYWidth = "";
    if (typeof (jsonTbl.scrollY) !== "undefined") {
        blPaginate = false;
        blScrollY = true;
        strScrollYWidth = jsonTbl.scrollY;
    }

    var blNotifications = false;
    if (typeof (jsonTbl.notifications) !== "undefined") {
        blNotifications = true;
    }

    if (typeof (jsonTbl.ROWS) !== "undefined") {
        nuRows = jsonTbl.ROWS;
    }

    if (typeof (jsonTbl.PAGE) !== "undefined") {
        nuPage = jsonTbl.PAGE;
    }

    var blSearch = true;
    if (typeof (jsonTbl.blSearch) !== "undefined") {
        blSearch = jsonTbl.blSearch;
    }

    var blInfo = true;
    if (typeof (jsonTbl.blInfo) !== "undefined") {
        blInfo = jsonTbl.blInfo;
    }

    var blButton = false;
    if (typeof (jsonTbl.PAGELENGTH) !== "undefined") {
        nuPageLength = jsonTbl.PAGELENGTH;
    }

    var blSolicitud = false;
    if (typeof (jsonTbl.ES_SOLICITUD) !== "undefined") {
        blSolicitud = true;
    }
    var blIsApprovalTable = false;
    if (typeof (jsonTbl.ISAPPROVAL) !== "undefined") {
        blIsApprovalTable = true;
    }

    var blContrato = false;
    if (typeof (jsonTbl.ES_CONTRATO) !== "undefined") {
        blContrato = true;
    }
    //cambios para agenda
    var dtHoy = new Date();
    var blAgenda = false;
    if (typeof (jsonTbl.ES_AGENDA) !== "undefined") {
        blAgenda = true;
    }
    //fin de cambios para agenda
    if (typeof (jsonTbl.BUTTON) !== "undefined") {
        if (jsonTbl.BUTTON.length > 0) {
            blButton = true;
        }
    }

    var blButtons = false;
    if (typeof (jsonTbl.BUTTONS) !== "undefined") {
        if (jsonTbl.BUTTONS.length > 0) {
            blButtons = true;
        }
    }

    var blChk = false;
    if (typeof (jsonTbl.CHECKBOX) !== "undefined") {
        if (jsonTbl.CHECKBOX) {
            blChk = true;
        }
    }

    var blFixedHeader = false;
    if (typeof (jsonTbl.FIXEDHEADER) !== "undefined") {
        if (jsonTbl.FIXEDHEADER) {
            blFixedHeader = false;
        }
    }

    let strNoResultTxt = "No se encontraron registros";
    if (typeof (jsonTbl.NORESULTTEXT) !== "undefined") {
        strNoResultTxt = jsonTbl.NORESULTTEXT;
    }

    for (var i = 0; i < jsonTbl.LABEL.length; i++) {

        if (i === 0 && blChk) {
            strHtmlHeader += "<th align='center' class='text-center'><input type='checkbox' id='chk" + jsonTbl.ID + "' onClick='checkAll(\"" + jsonTbl.ID + "\")' /></th>";
        } else {
            strHtmlHeader += "<th>" + jsonTbl.LABEL[i] + "</th>";
        }

    }

    strHtmlHeader = "<thead><tr>" + strHtmlHeader + "</tr></thead>";

    var arrayCols = new Array();

    if (typeof (jsonTbl.COLS) !== "undefined") {
        for (var j = 0; j < jsonTbl.COLS.length; j++) {
            arrayCols.push(jsonTbl.COLS[j]);
        }
    } else {
        for (var j = 0; j < jsonTbl.LABEL.length; j++) {
            arrayCols.push(j);
        }
    }


    for (var i = 0; i < jsonTbl.DATA.length; i++) {

        if (blSolicitud) {
            if (typeof (jsonTbl.DATA[i].Asignado) !== "undefined" && jsonTbl.DATA[i].Asignado === "Sin Asignar") {
                strHtmlBody += "<tr style='background-color: #EFF1B8'>";
            } else {
                strHtmlBody += "<tr>";
            }
        } else {
            strHtmlBody += "<tr>";
        }

        for (var j = 0; j < arrayCols.length; j++) {

            /*
             * Author: Brian Stiven - Juan David Bonilla
             * Desc: validacion de nulls en las tablas
             * 
            */

            if (jsonTbl.DATA[i][arrayCols[j]] == null) jsonTbl.DATA[i][arrayCols[j]] = "";

            if (j === 0 && blChk) {
                strHtmlBody += "<td align='center'><input type='checkbox' class='' value='" + JSON.stringify(jsonTbl.DATA[i]) + "' /></td>";
            }

            /*
             * Author: Juan David Bonilla
             * Desc: validacion de semaforos en MGO
             * */
            var txtColor = "success";
            if (blTrafficLights) {
                //Array de json con las columnas que tienen semáforo y la regla que las define
                let arrLights = jsonTbl.ArrayLights;
                //Valida si el campo que apaga el semáforo está lleno o vacío, si está vacío el semáforo se prende, si no, se apaga
                let blTurnedOn = false;
                for (let m = 0; m < arrLights.length; m++) {
                    if (jsonTbl.LABEL[j] == arrLights[m].Label) {
                        if (jsonTbl.DATA[i][arrayCols[j]].trim() != "") {

                            //segun el tipo de regla
                            switch (arrLights[m].ValidationType) {
                                case "Estado":
                                    if (arrLights[m].StatusColors[jsonTbl.DATA[i][arrayCols[j]]] != undefined) {
                                        blTurnedOn = true;
                                        txtColor = arrLights[m].StatusColors[jsonTbl.DATA[i][arrayCols[j]]];
                                    } else {
                                        blTurnedOn = false;
                                    }
                                    break;
                            }

                        }
                    }
                }

                if (blTurnedOn) {
                    strHtmlBody += `<td title='${jsonTbl.LABEL[j]}' class='text-${txtColor} font-weight-bold m-0 p-2'>
                        <div class="card border-0 border-left-${txtColor} rounded-0" style="border-width: 0.4rem !important; background:transparent;">
                        <p class="m-2 text-${txtColor}">${jsonTbl.DATA[i][arrayCols[j]]}</p>
                        </div>
                        </td>`;
                } else {
                    if (blScrollColumns) {
                        if (arrColumnsScroll.includes(j)) {
                            strHtmlBody += `<td title='${jsonTbl.LABEL[j]}'>
                                                <div class="scrollable">
                                                ${jsonTbl.DATA[i][arrayCols[j]]}
                                                </div>
                                                </td>`;
                        } else {
                            strHtmlBody += "<td title='" + jsonTbl.LABEL[j] + "'>" + jsonTbl.DATA[i][arrayCols[j]] + "</td>";
                        }
                    } else {
                        strHtmlBody += "<td title='" + jsonTbl.LABEL[j] + "'>" + jsonTbl.DATA[i][arrayCols[j]] + "</td>";
                    }
                }
            } else {
                if (blScrollColumns) {
                    if (arrColumnsScroll.includes(j)) {
                        strHtmlBody += `<td title='${jsonTbl.LABEL[j]}'>
                                            <div class="scrollable">
                                            ${jsonTbl.DATA[i][arrayCols[j]]}
                                            </div>
                                            </td>`;
                    } else {
                        strHtmlBody += "<td title='" + jsonTbl.LABEL[j] + "'>" + jsonTbl.DATA[i][arrayCols[j]] + "</td>";
                    }
                } else {
                    strHtmlBody += "<td title='" + jsonTbl.LABEL[j] + "'>" + jsonTbl.DATA[i][arrayCols[j]] + "</td>";
                }
            }

            //END
            if (j === (arrayCols.length - 1) && blIsApprovalTable) {
                strHtmlBody += "<td align='center'>";

                if (jsonTbl.DATA[i].Status == "I") {
                    strHtmlBody += "<label class='switch'><input type='checkbox' onchange='" + jsonTbl.ISAPPROVAL + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' id='checkStat" + i + "'> <span class='slider round'></span></label>";
                } else {
                    strHtmlBody += "<label class='switch'><input type='checkbox' onchange='" + jsonTbl.ISAPPROVAL + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' id='checkStat" + i + "' checked> <span class='slider round'></span></label>";
                }

                strHtmlBody += "</td>";
            }
            

            if (j === (arrayCols.length - 1) && blButton) {

                for (var x = 0; x < jsonTbl.BUTTON.length; x++) {
                    strHtmlBody += "<td align='center'><a href='#!' onclick='" + jsonTbl.BUTTON[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-primary btn-circle btn-sm'  title='" + jsonTbl.BUTTON[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTON[x].ICON + "'></i></a></td>";
                }

            }

            if (j === (arrayCols.length - 1) && blButtons) {

                if (typeof (jsonTbl.BUTTONS) !== "undefined") {
                    strHtmlBody += "<td align='center'>";
                    for (var x = 0; x < jsonTbl.BUTTONS.length; x++) {
                        if (x > 0) {
                            strHtmlBody += "&nbsp;";
                        }

                        var strColor = "primary";
                        if (jsonTbl.BUTTONS[x].COLOR != null && jsonTbl.BUTTONS[x].COLOR != "") {
                            strColor = jsonTbl.BUTTONS[x].COLOR;
                        }
                        // Si es una tabla de solicitudes
                        if (blSolicitud) {

                            if (jsonTbl.BUTTONS[x].EVENT == "Edit") {

                                if (jsonTbl.DATA[i].EstadoSolicitud == "EnRegistro" || jsonTbl.DATA[i].EstadoSolicitud == "Rechazada") {

                                    strHtmlBody += "<a href='#!' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i></a>";

                                }
                            } else if (jsonTbl.BUTTONS[x].EVENT == "Delete") {

                                if (jsonTbl.DATA[i].EstadoSolicitud == "EnRegistro") {

                                    strHtmlBody += "<a href='#!' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i></a>";
                                }
                            } else {
                                strHtmlBody += "<a href='#!' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i></a>";
                            }
                        } else if (blContrato) {

                            if (jsonTbl.BUTTONS[x].EVENT == "Edit") {

                                if (jsonTbl.DATA[i].EstadoSolicitud == "Legalizacion") {

                                    strHtmlBody += "<a href='#!' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-COLOR: 'danger' btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i></a>";
                                }

                            } else {

                                strHtmlBody += "<a href='#!' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i></a>";

                            }
                        } else {
                            strHtmlBody += "<a href='#!' style='position:relative;' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(jsonTbl.DATA[i]) + ")' class='btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i>";

                            //se valida si se deben poner notificaciones al boton
                            if (blNotifications) {
                                for (objNotificacion of jsonTbl.notifications) {
                                    //se busca si se necesita alguna configuracion para el boton que se está creando
                                    if (objNotificacion.btnTargetIndex == x) {
                                        //se valida la regla para mostrar o no el simbolo de la notificación
                                        if (jsonTbl.DATA[i][objNotificacion.column] > 0 || jsonTbl.DATA[i][objNotificacion.column] == "true" || jsonTbl.DATA[i][objNotificacion.column] == true) {
                                            strHtmlBody += "<span class='badge badge-" + objNotificacion.color + " badge-counter' style='position:absolute;top: -0.3rem;left: 1.2rem;'>";
                                            switch (objNotificacion.decoration) {
                                                case "info":
                                                    strHtmlBody += "!"
                                                    break;
                                                case "number":
                                                    strHtmlBody += jsonTbl.DATA[i][objNotificacion.column];
                                                    break;
                                            }
                                            strHtmlBody += "</span>";
                                        }
                                    }
                                }
                            }

                            strHtmlBody += "</a>";
                        }


                    }
                    strHtmlBody += "</td>";
                }

            }
        }
        strHtmlBody += "</tr>";
    }

    strHtmlBody = "<tbody>" + strHtmlBody + "</tbody>";

    strHtmlTable = "<table id='tbl" + jsonTbl.ID + "' class='table table-bordered'>" + strHtmlHeader + "" + strHtmlBody + "</table>";

    $("#divTable" + jsonTbl.ID).html(strHtmlTable);

    var jsonDataTable = {
        "pageLength": nuPageLength,
        "paging": blPaginate,
        "searching": blSearch,
        "info": blInfo,
        "order": [],
        "scrollY": strScrollYWidth,
        "scrollCollapse": blScrollY,
        "language": {
            "emptyTable": strNoResultTxt
        }
    }

    var arrTargets = [];

    if (blFixColumns) {
        jsonDataTable["autoWidth"] = false;
        for (var i = 0; i < arrColumnsLenght.length; i++) {
            arrTargets.push({
                width: `${arrColumnsLenght[i]}%`,
                targets: i
            });
        }
    }

    if (blChk) {
        arrTargets.push({ orderable: false, targets: 0 });
    }

    if (blButtons) {
        if (blChk) arrTargets.push({ orderable: false, targets: arrayCols.length + 1 });
        else arrTargets.push({ orderable: false, targets: arrayCols.length });
    }

    if (arrTargets.length > 0) {
        jsonDataTable["columnDefs"] = arrTargets;
    }

    $("#tbl" + jsonTbl.ID).DataTable(jsonDataTable);

    if (typeof (jsonTbl.CBPaginate) !== "undefined") {

        var nuLength;

        if ($("#slctbl" + jsonTbl.ID + "_length").val() != null && $("#slctbl" + jsonTbl.ID + "_length").val() != "") {
            nuLength = $("#slctbl" + jsonTbl.ID + "_length").val();
        } else {
            $("#slctbl" + jsonTbl.ID + "_length").val(jsonTbl.ROWSPERPAGE);
            nuLength = jsonTbl.ROWSPERPAGE;
        }

        var nuFrom = ((nuLength * 1) * nuPage) + 1;

        var nuTo = (nuFrom + (nuLength * 1)) - 1;
        if (nuTo > nuRows) {
            nuTo = nuRows;
        }
        if (nuFrom > nuRows) {
            nuFrom = nuRows;
        }
        $("#tbl" + jsonTbl.ID + "_paginate li.active").find("a").text((nuPage + 1));
        $("#tbl" + jsonTbl.ID + "_info").html("Mostrando " + nuFrom + " a " + nuTo + " de " + nuRows + " registros");

        if (nuTo == nuRows) {
            $("#tbl" + jsonTbl.ID + "_next").addClass("disabled");
        }
        if (nuFrom == 1) {
            $("#tbl" + jsonTbl.ID + "_previous").addClass("disabled");
        }

        setTimeout(function () {

            $("#tbl" + jsonTbl.ID + "_paginate li.active").find("a").text(nuPage + 1);
            $("#tbl" + jsonTbl.ID + "_info").html("Mostrando " + nuFrom + " a " + nuTo + " de " + nuRows + " registros");

            $("#tbl" + jsonTbl.ID + "_next").removeClass("disabled");

            $("#tbl" + jsonTbl.ID + "_previous").removeClass("disabled");

            if (nuTo == nuRows) {
                $("#tbl" + jsonTbl.ID + "_next").addClass("disabled");
            }
            if (nuFrom == 1) {
                $("#tbl" + jsonTbl.ID + "_previous").addClass("disabled");
            }

            $("#tbl" + jsonTbl.ID + "_next").find("a").click(function () {

                var nuLength = $("#slctbl" + jsonTbl.ID + "_length").val();

                if (nuRows > nuLength && (nuRows - (nuPage * nuLength)) > 0) {
                    $("#tbl" + jsonTbl.ID + "_info").html("");
                    nuPage++;
                    window[jsonTbl.CBPaginate](nuPage, nuLength);
                }
            });

            $("#tbl" + jsonTbl.ID + "_previous").find("a").click(function () {
                var nuLength = $("#slctbl" + jsonTbl.ID + "_length").val();

                if (nuPage > 0) {
                    $("#tbl" + jsonTbl.ID + "_info").html("");
                    nuPage--;
                    window[jsonTbl.CBPaginate](nuPage, nuLength);
                }

            });

            $("#slctbl" + jsonTbl.ID + "_length").change(function () {
                var nuLength = $("#slctbl" + jsonTbl.ID + "_length").val();
                window[jsonTbl.CBPaginate](0, nuLength);
            });

        }, 500);
    }
}

function checkAll(strTblId) {

    var blCheck = $("#chk" + strTblId).prop("checked");

    $("#tbl" + strTblId + " > tbody").find("input[type=checkbox]").each(function () {

        $(this).prop("checked", blCheck);

    });

    $("#chk" + strTblId).prop("checked", blCheck);

}

/**
 * Author: Juan David Bonilla Á
 * Date: 11/02/2022
 * Desc: Retorna las opciones seleccionadas de una tabla con checkbox
 */
function GetOptionsSelected(tbl_id) {
    var jsonArrayAccounts = [];
    $("#tbl" + tbl_id + " > tbody").find("input[type=checkbox]:checked").each(function () {
        jsonArrayAccounts.push(jQuery.parseJSON($(this).val()));
    });
    return jsonArrayAccounts;
}

function setFilterTodayDate(strFrom, strTo) {

    var dtToday = new Date();
    var dd = dtToday.getDate();
    var mm = dtToday.getMonth() + 1;

    var dd2 = dtToday.getDate();
    var mm2 = mm + 1;

    if (mm === 1) {
        mm2 = 12;
    }

    var yyyy = dtToday.getFullYear();

    if (mm < 10) {
        mm = "0" + mm;
    }

    if (mm2 < 10) {

        if (mm2 === 2 && dd === 29) {

            dd = 28;
        }

        mm2 = "0" + mm2;
    }

    if (dd < 10) {
        dd = "0" + dd;
    }

    if (dd2 < 10) {
        dd2 = "0" + dd2;
    }

    var strFromDate = yyyy + '-' + mm + '-' + dd;
    var strToDate = yyyy + '-' + mm2 + '-' + dd2;

    $('#' + strFrom).val(strFromDate);
    $('#' + strTo).val(strToDate);

}

/**
 * Author: Carlos Caicedo
 * Date: 12/06/2020
 * Desc: Convierte fecha de dd/MM/yyyy a yyyy-MM-dd
 */
function formatDate(dateObject) {
    var from = dateObject.split("/");
    var d = new Date(from[2], from[1] - 1, from[0]);

    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return year + "-" + month + "-" + day;
}

//formato fecha -> input datepicker de bootstrap a español -> dd-mm-aaaa
function formatDatepickerES(...theIds) {
    theIds.forEach(element =>
        $('#' + element).datepicker("destroy")
    );
    theIds.forEach(element =>
        $('#' + element).datepicker({
            format: "dd/mm/yyyy",
            anguage: 'es',
            todayHighlight: true,
            clearBtn: true,
            autoclose: true,
            onSelect: function (dateText) {
                $(this).change();
                console.log("Selected date: " + dateText + "; input's current value: " + this.value);
            }
        })
    );
}
//recibe una fecha DATE|STRING|NUMBER y formatea a ES - para recibir de la BD Campo tipo Date
//Salida en formato dd-mm-aaaa o dd/mm/aaaa
function changeFormatToES(dateObject) {
    let fecha = new Date(dateObject);
    if (dateObject.toString().indexOf('-') > -1 &&
        dateObject.toString().indexOf('-') < 5) {
        fecha.setDate(fecha.getDate() + 1);
    }
    let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    let strFecha = fecha.toLocaleDateString("es-ES", options);
    return strFecha;
};
//recibe una fecha DATE|STRING|NUMBER y formatea a US - para enviar a la BD Campo tipo Date
//Salida en formato mm-dd-aaaa o mm/dd/aaaa
function changeFormatToUS(dateObject) {
    let fecha = new Date(dateObject);
    let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    let strFecha = fecha.toLocaleDateString("en-us", options);
    return strFecha;
};
//recibe string en formato aaaa/mm/dd o aaaa-mm-dd y lo convierte a dd-mm-aaaa (tambien funciona al revés)
function invertDate(strDate) {
    let date = "";
    if (strDate.indexOf('-') > -1) {
        date = strDate.split('-');
        date = date[2] + '-' + date[1] + '-' + date[0];
    } else {
        date = strDate.split('/');
        date = date[2] + '/' + date[1] + '/' + date[0];
    }
    return date;
}


function ITCXSS(strUnsafe) {
    var jsonUnsafe = JSON.parse(strUnsafe);

    if (typeof (jsonUnsafe.Data) !== "undefined") {
        for (var key in jsonUnsafe.Data) {
            var strValue = jsonUnsafe.Data[key];
            var strType = typeof (strValue);
            if (strType === "string") {
                jsonUnsafe.Data[key] = htmlEncode(jsonUnsafe.Data[key]).replaceAll("&#", "");
            }
        }
    }

    var strSafe = JSON.stringify(jsonUnsafe);

    return strSafe;
}

function htmlEncode(str) {
    return String(str).replace(/[^\w. ]/gi, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}

/**
 * Descripcion: Método que permite construir el html de una notificación para incluirla en un div
 * Autor: Juan David Bonilla Álvarez
 * Fecha: 18 de Febrero de 2022
 * Version 1.0
 * Params: Objeto json con las siguientes propiedades
 *  Action: El método que debería ejecutar al hacer click
 *  BackgroundColor: El color de fondo del ícono de notificación
 *  Icon: El ícono de la notificación
 *  Count: El número de notificaciones pendientes
 *  Text: El texto de la notificación
*/
function BuildNotifications(jsonData) {

    var objNotificacion = "<div class='notification-zone--item' href='#' ";

    if (typeof (jsonData.Action) !== "undefined") {
        objNotificacion += `onclick = "${jsonData.Action}">`;
    }

    if (typeof (jsonData.BackgroundColor) !== "undefined") {
        objNotificacion +=
            "<div class='mx-3'>" +
            "<div class='icon-circle' style='background:" + jsonData.BackgroundColor + "'>";
    } else {

        objNotificacion +=
            "<div class='mx-3'>" +
            "<div class='icon-circle bg-primary'>";
    }

    if (typeof (jsonData.Icon) !== "undefined") {
        objNotificacion += `<i class='${jsonData.Icon} text-white'></i>`;
    } else {
        objNotificacion += "<i class='fas fa-file-alt text-white'></i>";
    }

    let strHeaderText = "Pendiente(s)";
    if (typeof (jsonData.HeadText) !== "undefined") {
        strHeaderText = jsonData.HeadText;
    }

    objNotificacion +=
        "</div>" +
        "</div>" +
        "<div>" +
        "<div class='small text-gray-800'>" + jsonData.Count + " " + strHeaderText + "</div>";

    if (typeof (jsonData.Text) !== "undefined") {
        objNotificacion += "<span class='notification-item--name'>" + jsonData.Text + "</span>";
    } else {
        objNotificacion += "<span class='notification-item--name'>" + "Solicitudes pendientes" + "</span>";
    }

    objNotificacion += "</div>" + "</div>";

    return objNotificacion;
}