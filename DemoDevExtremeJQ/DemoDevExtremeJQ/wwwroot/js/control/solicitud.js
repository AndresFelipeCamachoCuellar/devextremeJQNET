
var objValidationRulesTipoSolicitud = {
    tiposolicitud: { required: true }
};

var objValidationRulesDatosGenerales = {
    tipocontrato: { required: true },
    tipopersona: { required: true },
    esconsorcio: { required: true },
    uniontemporal: { required: true }
};

var objValidationRulesSolicitanteSupervisor = {
    areasolicitud: { required: true },
    supervisor: { required: true },
    emailsupervisor: { required: true },
    regional: { required: true }
};

var objValidationRulesContraparteContractual = {
    tipoidentificacion: { required: true },
    noidentificacion: { required: true, maxlength: 20, alphanumeric: true },
    digitoVerificacion: { maxlength: 1 },
    razonsocial: { required: true, maxlength: 100 },
    email: { required: true, email: true },
    telefono: { required: true, number: true, maxlength: 15 },
    departamento: { required: true },
    ciudad: { required: true },
    direccion: { required: true, maxlength: 200, alphanumericWithSpace: true },
    vinculada: { required: true },
    tipojuridico: { required: true },
    tipocomercial: { required: true },
    codigohabilitacion: { required: true, maxlength: 20, alphanumeric: true },
    fechavencimiento: { required: true },
    tipoprestador: { required: true }
};

var objValidationRulesContrato = {
    iniciocontrato: {
        required: true,
        dateBefore: '#terminacioncontrato'
    },
    terminacioncontrato: {
        required: true,
        dateAfter: '#iniciocontrato'
    },
    tipomoneda: { required: true },
    trm: { required: true },
    monto: { required: true },
    valorcontrato: { required: true },
    incluyeiva: { required: true },
    objeto: { required: true, maxlength: 6000 },
    codigohabilitaciontransporte: { maxlength: 20, alphanumeric: true }
};

var objValidationRulesPoliza = {
    FechaInicioPolizaRespCivilMedica: {
        required: true,
        dateBefore: '#FechaFinPolizaRespCivilMedica'
    },
    FechaFinPolizaRespCivilMedica: {
        required: true,
        dateAfter: '#FechaInicioPolizaRespCivilMedica'
    },
    ValorPolizaResponsabilidadCivilMedica: { required: true },
    IncluyePolizaResponsabildadCivilExtracontractual: { required: true },
    polizaCivilProMedica: { required: true },
    FechaInicioPolizaRespCivilExtracontractual: {
        dateBefore: '#FechaFinPolizaRespCivilExtracontractual'
    },
    FechaFinPolizaRespCivilExtracontractual: {
        dateAfter: '#FechaInicioPolizaRespCivilExtracontractual'
    }
};

var objValidationRulesResultados = {
    sarlaft: { required: true }
};

var objValidationDocumentos = {
    presentacion: { required: true },
    laft: { required: true }
};

$.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^[a-z0-9\\]+$/i.test(value);
}, "Ingresa solo números o letras.");

$.validator.addMethod("alphanumericWithSpace", function (value, element) {
    return this.optional(element) || /^[a-z0-9\\ ]+$/i.test(value);
}, "Username must contain only letters, numbers or spaces.");

$.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z\s]+$/i.test(value);
}, "Solo caracteres alfabéticos");

$.validator.addMethod('dateBefore', function (value, element, params) {
    // if end date is valid, validate it as well
    var end = $(params);
    if (!end.data('validation.running')) {
        $(element).data('validation.running', true);
        setTimeout($.proxy(

            function () {
                this.element(end);
            }, this), 0);
        // Ensure clearing the 'flag' happens after the validation of 'end' to prevent endless looping
        setTimeout(function () {
            $(element).data('validation.running', false);
        }, 0);
    }
    return this.optional(element) || this.optional(end[0]) || new Date(value) <= new Date(end.val());

}, 'Debe ser menor a la fecha final');

$.validator.addMethod('dateAfter', function (value, element, params) {
    // if start date is valid, validate it as well
    var start = $(params);
    if (!start.data('validation.running')) {
        $(element).data('validation.running', true);
        setTimeout($.proxy(

            function () {
                this.element(start);
            }, this), 0);
        setTimeout(function () {
            $(element).data('validation.running', false);
        }, 0);
    }
    return this.optional(element) || this.optional(start[0]) || new Date(value) >= new Date($(params).val());

}, 'Debe ser mayor que la fecha inicial');

function validateFormTipoSolicitud() {
    $("#frmStep0").validate({
        rules: objValidationRulesTipoSolicitud,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            tiposolicitud: { required: "El campo es requerido" }
        }
    });
}

function validateFormDatosGenerales() {
    $("#frmStep1").validate({
        rules: objValidationRulesDatosGenerales,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            titulosolicitud: { required: "El campo es requerido" },
            tipocontrato: { required: "El campo es requerido" },
            tipopersona: { required: "El campo es requerido" },
            esconsorcio: { required: "El campo es requerido" },
            uniontemporal: { required: "El campo es requerido" }
        }
    });
}

function validateFormSolicitanteSupervisor() {
    $("#frmStep2").validate({
        rules: objValidationRulesSolicitanteSupervisor,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            areasolicitud: { required: "El campo es requerido" },
            supervisor: { required: "El campo es requerido" },
            emailsupervisor: { required: "El campo es requerido" },
            regional: { required: "El campo es requerido" },
            ciudadejecucion: { required: "El campo es requerido" }
        }
    });
}

function validateFormContraparteContractual() {
    $("#frmStep3").validate({
        rules: objValidationRulesContraparteContractual,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            tipoidentificacion: { required: "El campo es requerido" },
            noidentificacion: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres"), alphanumeric: "Ingrese solo números y letras" },
            razonsocial: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres") },
            email: { required: "El campo es requerido", email: "Ingrese un email válido" },
            telefono: { required: "El campo es requerido", number: "Ingrese solo números", maxlength: $.validator.format("No ingreses mas de {0} caracteres") },
            departamento: { required: "El campo es requerido" },
            ciudad: { required: "El campo es requerido" },
            direccion: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres"), alphanumericWithSpace: "Ingrese solo números y letras" },
            vinculada: { required: "El campo es requerido" },
            tipoprestador: { required: "El campo es requerido" },
            tipocomercial: { required: "El campo es requerido" },
            codigohabilitacion: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres"), alphanumeric: "Ingrese solo números y letras" },
            fechavencimiento: { required: "El campo es requerido" },
            digitoVerificacion: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres") }
        }
    });
}

function validateFormContrato() {
    $("#frmStep4").validate({
        rules: objValidationRulesContrato,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            iniciocontrato: { required: "El campo es requerido", dateBefore: "La fecha de inicio debe ser menor a la final" },
            terminacioncontrato: { required: "El campo es requerido", dateAfter: "La fecha final debe ser mayor a la de inicio" },
            tipomoneda: { required: "El campo es requerido" },
            trm: { required: "El campo es requerido" },
            monto: { required: "El campo es requerido" },
            valorcontrato: { required: "El campo es requerido" },
            incluyeiva: { required: "El campo es requerido" },
            prorroga: { required: "El campo es requerido" },
            modalidad: { required: "El campo es requerido" },
            tipoadmin: { required: "El campo es requerido" },
            objeto: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres") },
            codigohabilitaciontransporte: { required: "El campo es requerido", maxlength: $.validator.format("No ingreses mas de {0} caracteres"), alphanumeric: "Ingrese solo números y letras" },
            fechavencimientohabilitaciontransporte: { required: "El campo es requerido" }
        }
    });
}

function validateFormPoliza() {
    $("#frmStep5").validate({
        rules: objValidationRulesPoliza,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            FechaInicioPolizaRespCivilMedica: { required: "El campo es requerido", dateBefore: "La fecha de inicio debe ser menor a la final" },
            FechaFinPolizaRespCivilMedica: { required: "El campo es requerido", dateAfter: "La fecha final debe ser mayor a la de inicio" },
            ValorPolizaResponsabilidadCivilMedica: { required: "El campo es requerido", number: "Ingrese solo números" },
            IncluyePolizaResponsabildadCivilExtracontractual: { required: "El campo es requerido" },
            FechaInicioPolizaRespCivilExtracontractual: { required: "El campo es requerido", dateBefore: "La fecha de inicio debe ser menor a la final" },
            FechaFinPolizaRespCivilExtracontractual: { required: "El campo es requerido", dateAfter: "La fecha final debe ser mayor a la de inicio" },
            ValorPolizaResponsabildadCivilExtracontractual: { required: "El campo es requerido" },
            polizaCivilProMedica: { required: "El campo es requerido" },
            polizaCivilExtraContractual: { required: "El campo es requerido" }
        }
    });
}

function validateFormResultados() {
    $("#frmStep6").validate({
        rules: objValidationRulesResultados,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            EvaluacionAptitud: { required: "El campo es requerido" },
            ValorEvaluacionAptitud: { required: "El campo es requerido" },
            Observaciones: { required: "El campo es requerido" },
            sarlaft: { required: "El campo es requerido" },
            conceptoOficialCumplimiento: { required: "El campo es requerido" }
        }
    });
}

function validateFormDocumentacion() {
    $("#frmStep7").validate({
        rules: objValidationDocumentos,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            presentacion: { required: "El campo es requerido" },
            laft: { required: "El campo es requerido" },
            identificacion: { required: "El campo es requerido" },
            rut: { required: "El campo es requerido" },
            existenciaReprestacionLegal: { required: "El campo es requerido" },
            autorizacion: { required: "El campo es requerido" },
            docPrivadoConformacion: { required: "El campo es requerido" },
            TProfesionalMedico: { required: "El campo es requerido" },
            MP_FT_1305: { required: "El campo es requerido" },
            MP_FT_1306: { required: "El campo es requerido" },
            actoAdministrativo: { required: "El campo es requerido" },
            actaPosesion: { required: "El campo es requerido" },
            actaPosesion: { required: "El campo es requerido" },
            MP_FT_679: { required: "El campo es requerido" },
            certificacionBancaria: { required: "El campo es requerido" },
            certificadoCooperativa: { required: "El campo es requerido" },
            registroEspecialPrestadoresSalud: { required: "El campo es requerido" },
            hojaDeVida: { required: "El campo es requerido" },
            actaGrado: { required: "El campo es requerido" },
            HTituloICFES: { required: "El campo es requerido" },
            acuerdoTarifasServicios: { required: "El campo es requerido" },
            propuestaEconomica: { required: "El campo es requerido" },
            MP_FT_1287: { required: "El campo es requerido" },
            libertadTradicionInmueble: { required: "El campo es requerido" },
            poderContrato: { required: "El campo es requerido" },
            escrituraPublica: { required: "El campo es requerido" },
            escrituraPublica: { required: "El campo es requerido" },
            pazYSalvo: { required: "El campo es requerido" },
            especificacionesTecnicas: { required: "El campo es requerido" },
            expAgenteComercial: { required: "El campo es requerido" },
            aprobacionGerencia: { required: "El campo es requerido" }
        }
    });
}

function limpiarFormContraparte() {
    $('#frmStep3').find('input, textarea').val("");
    $("#departamento").val($("#departamento option:first").val());
    $("#ciudad").val($("#ciudad option:first").val());
    $("#vinculada").val($("#vinculada option:first").val());
    $("#tipoprestador").val($("#tipoprestador option:first").val());
    $("#tipocomercial").val($("#tipocomercial option:first").val());
    $("#tipoidentificacion").val($("#tipoidentificacion option:first").val());
}

/*****************************  CrearSolicitud */

function verificarSolicitudCreada(blInicial) {
    blInicialSolicitud = blInicial;
    if (strSolicitudNo === "") {
        CrearSolicitud();
    } else {
        ActualizarSolicitud(blInicial);
    }
}

function ActualizarSolicitud(blInicial) {
    let tiposolicitud = $('#tiposolicitud').val();
    let tipocontrato = $('#tipocontrato').val();
    let tipopersona = $('#tipopersona').val();
    let esconsorcio = $('#esconsorcio').val();
    let uniontemporal = $('#uniontemporal').val();
    let modificadopor = $('#emailsolicitante').val();

    var objJsonParams = {};

    if (blInicial) {
        if (!$("#frmStep0").valid()) {
            return;
        } else {
            objJsonParams = {
                "solicitudNo": strSolicitudNo,
                "columns": [
                    "ModificadoPor",
                    "TipoSolicitudID"
                ],
                "values": [
                    modificadopor,
                    tiposolicitud
                ]
            };
        }
    } else {
        if (!$("#frmStep1").valid()) {
            return;
        } else {
            objJsonParams = {
                "solicitudNo": strSolicitudNo,
                "columns": [
                    "ModificadoPor",
                    "TipoSolicitudID",
                    "TipoContratoID",
                    "TipoPersonaID",
                    "EsConsorcio",
                    "EsUnionTemp"
                ],
                "values": [
                    modificadopor,
                    tiposolicitud,
                    tipocontrato,
                    tipopersona,
                    esconsorcio,
                    uniontemporal
                ]
            };

            if (objContraparteContractual != null) {
                if ($('#tipoidentificacion option[value="' + objContraparteContractual.TipoIdentificacionID + '"]').prop("hidden")) {
                    objJsonParams.eliminarContraparte = "1";
                    blEliminarContraparte = true;
                }
            }
        }
    }

    const objRequestParams = {
        CBFunction: "cbActualizarSolicitud",
        Action: "Solicitud/ActualizarSolicitud",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    }
    getDataFromADS(objRequestParams);
}

function cbActualizarSolicitud(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {

            if (blEliminarContraparte) {
                blEliminarContraparte = false;
                blExisteContraparte = false;
                jsonObjContraparteContractual = null;
                objContraparteContractual = null;
                strContraparteContractualId = "";
            }

            if (!blInicialSolicitud) {
                $("#frmStep1").fadeOut();
                $("#frmStep2").fadeIn();
            } else {
                $("#frmStep0").fadeOut();
                $("#frmStep1").fadeIn();
            }
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

function CrearSolicitud() {
    if ($("#frmStep0").valid()) {
        let tiposolicitud = $('#tiposolicitud').val();
        let creadopor = $('#emailsolicitante').val();

        var objJsonParams = {
            "creadopor": creadopor,
            "tiposolicitud": tiposolicitud
        };

        const objRequestParams = {
            CBFunction: "cbCrearSolicitud",
            Action: "Solicitud/CrearSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        }
        getDataFromADS(objRequestParams);
    }
}

function cbCrearSolicitud(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            // Poner el ID de la solicitud en el card y avanzar
            strSolicitudNo = jsonResp.data;
            $("#lblSolicitudId").html(jsonResp.data);
            $("#frmStep0").fadeOut();
            $("#divSolicitudId").fadeIn();
            $("#frmStep1").fadeIn();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

/*****************************  GuardarSupervisor */
function GuardarSupervisor() {
    if ($("#frmStep2").valid()) {
        var objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "AreaSolicitanteID",
                "Supervisor",
                "EmailSupervisor",
                "EmailSolicitante",
                "RegionalID"
            ],
            "values": [
                $('#areasolicitud').val(),
                $('#supervisor').val(),
                $('#emailsupervisor').val(),
                $('#emailsolicitante').val(),
                $('#regional').val()
            ]
        };

        // Si la regional es distinta de NACIONAL, se requiere el campo 'Ciudad de Ejecución'
        if (strRegionalUsuario !== "37b49207-5ec1-4fd3-8987-e1baa492d0ba") {
            objJsonParams.columns.push("CiudadEjecucionID");
            objJsonParams.values.push($('#ciudadejecucion').val());
        }

        const objRequestParams = {
            CBFunction: "cbGuardarSupervisor",
            Action: "Solicitud/ActualizarSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };
        getDataFromADS(objRequestParams);
    }
}

function cbGuardarSupervisor(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            $("#frmStep2").fadeOut();
            $("#frmStep3").fadeIn();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

/*****************************  GuardarContraparte */

function GuardarContraparte() {
    if ($("#frmStep3").valid()) {

        var objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "TipoIdentificacionID",
                "Identificacion",
                "NombreCompleto",
                "Email",
                "Telefono",
                "CiudadID",
                "Direccion",
                "Vinculada"
            ],
            "values": [
                $('#tipoidentificacion').val(),
                $('#noidentificacion').val(),
                $('#razonsocial').val(),
                $('#email').val(),
                $('#telefono').val(),
                $('#ciudad').val(),
                $('#direccion').val(),
                $('#vinculada').val()
            ]
        };

        // Verificar si es NIT
        if ($("#tipoidentificacion").val() === "6a107070-acb6-11ea-bb37-0242ac130002") {
            objJsonParams.columns.push("DigitoVerificacion");
            objJsonParams.values.push($("#digitoVerificacion").val());
        }

        // Verificar si el contrato es tipo comercial
        if ($("#tipocontrato").val() === "f86799bd-b41f-4d16-b374-fbcf870a38df") {
            objJsonParams.columns.push("TipoComercialID");
            objJsonParams.values.push($("#tipocomercial").val());
            objJsonParams.columns.push("TipoPrestadorID");
            objJsonParams.values.push($('#tipoprestador').val());
        } else
            // Verificar si el contrato es tipo asistencial
            if ($("#tipocontrato").val() === "63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b") {
                objJsonParams.columns.push("CodigoHabilitacion");
                objJsonParams.values.push($('#codigohabilitacion').val());
                objJsonParams.columns.push("FechaVencimientoHabilitacion");
                objJsonParams.values.push($('#fechavencimiento').val());
                // Si es jurídica
                if ($("#tipopersona").val() === "f2082ce0-5a26-4289-8cde-75b9a27a89fb") {
                    objJsonParams.columns.push("TipoPrestadorID");
                    objJsonParams.values.push($('#tipoprestador').val());
                }
            } else
                // Verificar si el contrato es tipo administrativo
                if ($("#tipocontrato").val() === "0266ff39-aa4a-4a07-b10e-4bc5983f8682") {
                    // Si es jurídica
                    if ($("#tipopersona").val() === "f2082ce0-5a26-4289-8cde-75b9a27a89fb") {
                        objJsonParams.columns.push("TipoPrestadorID");
                        objJsonParams.values.push($('#tipoprestador').val());
                    }
                }

        var strMetodo = "CrearContraparte";

        // Verificar si se va a registrar una nueva contraparte o se va a actualizar
        if (blExisteContraparte) {
            strMetodo = "ActualizarContraparte";
            objJsonParams.ContraparteContractualID = objContraparteContractual.ContraparteContractualID;
        }

        const objRequestParams = {
            CBFunction: "cbGuardarContraparte",
            Action: "Solicitud/" + strMetodo,
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

function cbGuardarContraparte(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            $("#frmStep3").fadeOut();
            $("#frmStep4").fadeIn();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

/*****************************  GuardarContrato */

function GuardarContrato() {
    if ($("#frmStep4").valid()) {

        var objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "FechaInicioContrato",
                "FechaFinContrato",
                "MonedaID",
                "TRM",
                "Monto",
                "ValorContrato",
                "TipoIVAID",
                "ObjetoContrato",
                "Prorroga"
            ],
            "values": [
                $('#iniciocontrato').val(),
                $('#terminacioncontrato').val(),
                $('#tipomoneda').val(),
                parseFloat($("#trm").maskMoney('unmasked')[0]).toFixed(2),
                parseFloat($("#monto").maskMoney('unmasked')[0]).toFixed(2),
                parseFloat($("#trm").maskMoney('unmasked')[0] * $("#monto").maskMoney('unmasked')[0]).toFixed(2),
                $('#incluyeiva').val(),
                $('#objeto').val(),
                $('#prorroga').val()
            ]
        };

        // Si es tipo de contrato asistencial
        if ($("#tipocontrato").val() === "63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b") {
            objJsonParams.columns.push("ModalidadID");
            objJsonParams.values.push($('#modalidad').val());
        } else
            // Si es tipo de contrato administrativo
            if ($("#tipocontrato").val() === "0266ff39-aa4a-4a07-b10e-4bc5983f8682") {
                objJsonParams.columns.push("TipoAdministrativoID");
                objJsonParams.values.push($('#tipoadmin').val());

                // Si el tipo administrativo es 'Transporte'
                if ($("#tipoadmin").val() === "5a5ba09e-accd-412c-835b-a8e859a83203") {
                    objJsonParams.columns.push("CodigoHabilitacionTransporte");
                    objJsonParams.values.push($('#codigohabilitaciontransporte').val());
                    objJsonParams.columns.push("FechaVencimientoHabilitacionTransporte");
                    objJsonParams.values.push($('#fechavencimientohabilitaciontransporte').val());
                }
            }

        const objRequestParams = {
            CBFunction: "cbGuardarContrato",
            Action: "Solicitud/ActualizarSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };
        getDataFromADS(objRequestParams);
    }
}

function cbGuardarContrato(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            $("#frmStep4").fadeOut();
            // Si es asistencial
            if ($("#tipocontrato").val() === '63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b') {
                blResultadosAlert = true;
                $("#frmStep5").fadeIn();
            } else {
                blResultadosAlert = true;
                $("#frmStep6").fadeIn();
            }
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

/*****************************  GuardarPoliza */

function GuardarPoliza() {
    if ($("#frmStep5").valid()) {
        var objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "FechaInicioPolizaRespCivilMedica",
                "FechaFinPolizaRespCivilMedica",
                "ValorPolizaRespCivilMedica",
                "PolizaRespCivilExtracontractual"
            ],
            "values": [
                $('#FechaInicioPolizaRespCivilMedica').val(),
                $('#FechaFinPolizaRespCivilMedica').val(),
                parseFloat($("#ValorPolizaResponsabilidadCivilMedica").maskMoney('unmasked')[0]).toFixed(2),
                $('#IncluyePolizaResponsabildadCivilExtracontractual').val()
            ]
        };

        if ($('#FechaInicioPolizaRespCivilExtracontractual').val() !== "") {
            objJsonParams.columns.push("FechaInicioPolizaRespCivilExtracontractual");
            objJsonParams.values.push($("#FechaInicioPolizaRespCivilExtracontractual").val());
        }

        if ($('#FechaFinPolizaRespCivilExtracontractual').val() !== "") {
            objJsonParams.columns.push("FechaFinPolizaRespCivilExtracontractual");
            objJsonParams.values.push($("#FechaFinPolizaRespCivilExtracontractual").val());
        }

        if ($('#ValorPolizaResponsabildadCivilExtracontractual').val() !== "") {
            objJsonParams.columns.push("ValorPolizaRespCivilExtracontractual");
            objJsonParams.values.push(parseFloat($("#ValorPolizaResponsabildadCivilExtracontractual").maskMoney('unmasked')[0]).toFixed(2));
        }

        const objRequestParams = {
            CBFunction: "cbGuardarPoliza",
            Action: "Solicitud/ActualizarSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true,
            LoaderText: "<p>Registrando poliza<br/><small>Por favor espere</small></p>"
        };
        getDataFromADS(objRequestParams);
    }
}

function cbGuardarPoliza(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            subirDocumentosPolizas();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

function subirDocumentosPolizas() {
    var formData = new FormData();
    var jsonMsg;
    var count = 0;
    $("#frmStep5").find("input[type=file]").each(function (index, field) {
        if (field.files.length > 0) {
            const flName = field.files[0].name;
            const strLastDot = flName.lastIndexOf('.');
            const strExt = flName.substring(strLastDot + 1);
            formData.append('files', field.files[0], field.id + "." + strExt);
            count = count + 1;
        }
    });

    if (count > 0) {
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
            CBFunction: "cbSubirDocumentosPolizas",
            Action: "Solicitud/SubirDocumentosPolizas",
            Data: formData,
            Loading: true,
            LoaderText: "<p>Subiendo documentos<br/><small>Por favor espere</small></p>",
            PreventHideLoading: true
        };

        getFormDataFromADS(objRequestParams);
        setTimeout(function () {
            $('#divModalLoading').modal('show');
        }, 1000);
    } else {
        $("#frmStep5").fadeOut();
        $("#frmStep6").fadeIn();
    }
}

function cbSubirDocumentosPolizas(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            $('#divModalLoading').modal('hide');
            $("#frmStep5").fadeOut();
            $("#frmStep6").fadeIn();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

/*****************************  GuardarResultados */

function GuardarResultados() {
    if ($("#frmStep6").valid()) {
        var sarlaftValue = $("input[name='optionSarlaft']:checked").val();

        var objJsonParams = {
            "solicitudNo": strSolicitudNo,
            "columns": [
                "EvaluacionAptitud",
                "ValorEvaluacionAptitud",
                "Sarlaft"
            ],
            "values": [
                $('#EvaluacionAptitud').val(),
                $('#ValorEvaluacionAptitud').val(),
                sarlaftValue
            ]
        };

        if ($('#Observaciones').val() !== "") {
            objJsonParams.columns.push("Observaciones");
            objJsonParams.values.push($('#Observaciones').val());
        }

        const objRequestParams = {
            CBFunction: "cbGuardarResultados",
            Action: "Solicitud/ActualizarSolicitud",
            Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
            Loading: true
        };
        getDataFromADS(objRequestParams);
    }
}

function cbGuardarResultados(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            subirDocumentosResultados();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

function subirDocumentosResultados() {
    var formData = new FormData();
    var jsonMsg;
    var count = 0;

    $("#frmStep6").find("input[type=file]").each(function (index, field) {
        if (field.files.length > 0) {
            const flName = field.files[0].name;
            const strLastDot = flName.lastIndexOf('.');
            const strExt = flName.substring(strLastDot + 1);
            formData.append('files', field.files[0], field.id + "." + strExt);
            count = count + 1;
        }
    });

    if (count > 0) {
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
            CBFunction: "cbSubirDocumentosResultados",
            Action: "Solicitud/SubirDocumentosResultados",
            Data: formData,
            Loading: true,
            LoaderText: "<p>Subiendo documentos<br/><small>Por favor espere</small></p>"
        };

        getFormDataFromADS(objRequestParams);
        setTimeout(function () {
            $('#divModalLoading').modal('show');
        }, 1000);
    } else {
        $("#frmStep6").fadeOut();
        $("#frmStep7").fadeIn();
    }
}

function cbSubirDocumentosResultados(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            $("#frmStep6").fadeOut();
            $("#frmStep7").fadeIn();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}

/*****************************  GetContraparteContractual */

function GetContraparteContractual() {

    let objRequestParams = {
        CBFunction: "cbGetContraparteContractual",
        Action: "../Solicitud/GetContraparteContractual",
        Loading: true
    };
    getDataFromADS(objRequestParams);
}


function cbGetContraparteContractual(jsonResp) {

    let arrayDataTbl = JSON.parse("[]");

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
        }
    }
}
/*****************************  Click */

$('#btnAtrasDatosGenerales').click(function () {
    $("#frmStep1").fadeOut();
    $("#frmStep0").fadeIn();
});

$('#btnAtrasSupervisor').click(function () {
    $("#frmStep2").fadeOut();
    $("#frmStep1").fadeIn();
});

$('#btnAtrasContraparte').click(function () {
    $("#frmStep3").fadeOut();
    $("#frmStep2").fadeIn();
});

$('#btnAtrasContrato').click(function () {
    $("#frmStep4").fadeOut();
    $("#frmStep3").fadeIn();
});

$('#btnAtrasPoliza').click(function () {
    $("#frmStep5").fadeOut();
    $("#frmStep4").fadeIn();
});

$('#btnAtrasResultados').click(function () {
    $("#frmStep6").fadeOut();
    // Si es asistencial
    if ($("#tipocontrato").val() === '63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b') {
        $("#frmStep5").fadeIn();
    } else {
        $("#frmStep4").fadeIn();
    }
});

$('#btnAtrasDocumentos').click(function () {
    $("#frmStep7").fadeOut();
    $("#frmStep6").fadeIn();
});

/*****************************  Change */

$('input[type=radio][name=optionSarlaft]').change(function () {
    $('#frmStep6').validate();
    if (this.value == '1') {
        // Sarlaft positivo
        $("#conceptoOficialCumplimiento").rules('add', { required: true });
        $("#divConceptoOficialCumplimiento").show();
        if (blResultadosAlert) {
            showITCMessage({ Title: "Información", Msg: "El contratista tiene reporte de sarlaft, por favor adjunte el Concepto Oficial de Cumplimiento.", Type: "Warning" });
        }
    }
    else if (this.value == '0') {
        // Sarlaft negativo
        $("#conceptoOficialCumplimiento").rules('remove', 'required');
        $("#conceptoOficialCumplimiento").val("");
        $("#divConceptoOficialCumplimiento").hide();
        if (blResultadosAlert) {
            showITCMessage({ Title: "Información", Msg: "El contratista no tiene reporte de sarlaft, no se debe adjuntar el Concepto Oficial de Cumplimiento.", Type: "Warning" });
        }
    }
});

$("#supervisor").on('change', function () {
    $("#emailsupervisor").val($(this).find(':selected').data('email'));
});

$("#departamento").on('change', function () {
    GetMunicipios($(this).val());
});

$("#monto").on('change', function () {
    CalculoValorContrato();
});

$("#trm").on('change', function () {
    CalculoValorContrato();
});

function reglasTipoContratoParaDocumentos() {
    $('#frmStep7').validate();
    switch ($("#tipocontrato").val()) {
        case 'f86799bd-b41f-4d16-b374-fbcf870a38df':
            // Si es comercial
            $("#rut").rules('remove', 'required');
            $("#divRut .invalid-feedback").html('');

            // Oculto tipo de persona natural
            $('#tipopersona option[value="8c413059-0cf0-4677-bf2a-8d25ab497ca8"]').prop("hidden", true);
            if ($('#tipopersona').val() === '8c413059-0cf0-4677-bf2a-8d25ab497ca8') {
                $('#tipopersona').val($("#tipopersona option:first").val());
            }

            // Ocultar
            $("#divTProfesionalMedico").hide();
            $("#divMP_FT_1305").hide();
            $("#divMP_FT_1306").hide();
            $("#divActoAdministrativo").hide();
            $("#divActaPosesion").hide();
            $("#divMP_FT_679").hide();
            $("#certificacionBancaria").rules('remove', 'required');
            $("#divCertificacionBancaria .invalid-feedback").html('');
            $("#divCertificacionBancaria").hide();
            $("#divCertificadoCooperativa").hide();
            $("#registroEspecialPrestadoresSalud").rules('remove', 'required');
            $("#divRegistroEspecialPrestadoresSalud .invalid-feedback").html('');
            $("#divRegistroEspecialPrestadoresSalud").hide();
            $("#divHojaDeVida").hide();
            $("#divActaGrado").hide();
            $("#divHTituloICFES").hide();
            $("#divAcuerdoTarifasServicios").hide();
            $("#propuestaEconomica").rules('remove', 'required');
            $("#divPropuestaEconomica .invalid-feedback").html('');
            $("#divPropuestaEconomica").hide();
            $("#TProfesionalMedico").val("");
            $("#MP_FT_1305").val("");
            $("#MP_FT_1306").val("");
            $("#actoAdministrativo").val("");
            $("#actaPosesion").val("");
            $("#MP_FT_679").val("");
            $("#certificacionBancaria").val("");
            $("#certificadoCooperativa").val("");
            $("#registroEspecialPrestadoresSalud").val("");
            $("#hojaDeVida").val("");
            $("#actaGrado").val("");
            $("#HTituloICFES").val("");
            $("#acuerdoTarifasServicios").val("");
            $("#propuestaEconomica").val("");
            $("#EvaluacionAptitud").rules('remove', 'required');
            $("#ValorEvaluacionAptitud").rules('remove', 'required');
            $("#EvaluacionAptitud").val("");
            $("#ValorEvaluacionAptitud").val("");
            $("#divEvaluacionAptitud").hide();
            $("#divValorEvaluacionAptitud").hide();

            // Si es jurídica
            if ($("#tipopersona").val() === 'f2082ce0-5a26-4289-8cde-75b9a27a89fb') {
                $("#divMP_FT_1287").show();
            } else {
                $("#divMP_FT_1287").hide();
                $("#MP_FT_1287").val("");
            }

            // Si es de tipo comercial de agencia
            if ($("#tipocomercial").val() === 'bedff04a-8cb6-4c6b-afdc-7e1f3e5972be') {
                $("#divExpAgenteComercial").show();
            } else {
                $("#divExpAgenteComercial").hide();
                $("#expAgenteComercial").val("");
            }

            desactivarReglasTipoAdministrativoParaDocumentos();
            break;
        case '63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b':
            // Si es asistencial
            $("#rut").rules('add', { required: true });
            $('#tipopersona option[value="8c413059-0cf0-4677-bf2a-8d25ab497ca8"]').prop("hidden", false);

            $("#EvaluacionAptitud").rules('add', { required: true });
            $("#ValorEvaluacionAptitud").rules('add', { required: true });
            $("#divEvaluacionAptitud").show();
            $("#divValorEvaluacionAptitud").show();

            // Si es natural
            if ($("#tipopersona").val() === '8c413059-0cf0-4677-bf2a-8d25ab497ca8') {
                $("#divTProfesionalMedico").show();
                $("#divMP_FT_1305").show();
                $("#divHojaDeVida").show();
                $("#divActaGrado").show();
                $("#divHTituloICFES").show();
                $("#divMP_FT_1306").hide();
                $("#divActoAdministrativo").hide();
                $("#divActaPosesion").hide();
                $("#divAcuerdoTarifasServicios").hide();
                $("#MP_FT_1306").val("");
                $("#actoAdministrativo").val("");
                $("#actaPosesion").val("");
                $("#acuerdoTarifasServicios").val("");
                // Si es jurídica
            } else if ($("#tipopersona").val() === 'f2082ce0-5a26-4289-8cde-75b9a27a89fb') {
                $("#divMP_FT_1306").show();
                $("#divActoAdministrativo").show();
                $("#divActaPosesion").show();
                $("#divAcuerdoTarifasServicios").show();
                $("#divTProfesionalMedico").hide();
                $("#divMP_FT_1305").hide();
                $("#divHojaDeVida").hide();
                $("#divActaGrado").hide();
                $("#divHTituloICFES").hide();
                $("#TProfesionalMedico").val("");
                $("#MP_FT_1305").val("");
                $("#hojaDeVida").val("");
                $("#actaGrado").val("");
                $("#HTituloICFES").val("");
            }

            $("#divMP_FT_679").show();
            $("#certificacionBancaria").rules('add', { required: true });
            $("#divCertificacionBancaria").show();
            $("#divCertificadoCooperativa").show();
            $("#registroEspecialPrestadoresSalud").rules('add', { required: true });
            $("#divRegistroEspecialPrestadoresSalud").show();

            $("#propuestaEconomica").rules('remove', 'required');
            $("#divPropuestaEconomica .invalid-feedback").html('');
            $("#divPropuestaEconomica").hide();
            $("#divMP_FT_1287").hide();
            $("#divExpAgenteComercial").hide();
            $("#propuestaEconomica").val("");
            $("#MP_FT_1287").val("");
            $("#expAgenteComercial").val("");

            desactivarReglasTipoAdministrativoParaDocumentos();
            break;
        case '0266ff39-aa4a-4a07-b10e-4bc5983f8682':
            // Si es administrativo
            $("#rut").rules('remove', 'required');
            $("#divRut .invalid-feedback").html('');
            $('#tipopersona option[value="8c413059-0cf0-4677-bf2a-8d25ab497ca8"]').prop("hidden", false);

            // Si es natural
            if ($("#tipopersona").val() === '8c413059-0cf0-4677-bf2a-8d25ab497ca8') {
                $("#divTProfesionalMedico").show();
                $("#divMP_FT_1305").show();
                $("#divMP_FT_1306").hide();
                $("#divActoAdministrativo").hide();
                $("#divActaPosesion").hide();
                $("#MP_FT_1306").val("");
                $("#actoAdministrativo").val("");
                $("#actaPosesion").val("");
                // Si es jurídica
            } else if ($("#tipopersona").val() === 'f2082ce0-5a26-4289-8cde-75b9a27a89fb') {
                $("#divMP_FT_1306").show();
                $("#divActoAdministrativo").show();
                $("#divActaPosesion").show();
                $("#divTProfesionalMedico").hide();
                $("#divMP_FT_1305").hide();
                $("#TProfesionalMedico").val("");
                $("#MP_FT_1305").val("");
            }

            $("#propuestaEconomica").rules('add', { required: true });
            $("#divPropuestaEconomica").show();

            // Ocultar
            $("#divMP_FT_679").hide();
            $("#certificacionBancaria").rules('remove', 'required');
            $("#divCertificacionBancaria .invalid-feedback").html('');
            $("#divCertificacionBancaria").hide();
            $("#divCertificadoCooperativa").hide();
            $("#registroEspecialPrestadoresSalud").rules('remove', 'required');
            $("#divRegistroEspecialPrestadoresSalud .invalid-feedback").html('');
            $("#divRegistroEspecialPrestadoresSalud").hide();
            $("#divHojaDeVida").hide();
            $("#divActaGrado").hide();
            $("#divHTituloICFES").hide();
            $("#divAcuerdoTarifasServicios").hide();
            $("#divMP_FT_1287").hide();
            $("#divExpAgenteComercial").hide();
            $("#MP_FT_679").val("");
            $("#certificacionBancaria").val("");
            $("#certificadoCooperativa").val("");
            $("#registroEspecialPrestadoresSalud").val("");
            $("#hojaDeVida").val("");
            $("#actaGrado").val("");
            $("#HTituloICFES").val("");
            $("#acuerdoTarifasServicios").val("");
            $("#MP_FT_1287").val("");
            $("#expAgenteComercial").val("");
            $("#EvaluacionAptitud").rules('remove', 'required');
            $("#ValorEvaluacionAptitud").rules('remove', 'required');
            $("#EvaluacionAptitud").val("");
            $("#ValorEvaluacionAptitud").val("");
            $("#divEvaluacionAptitud").hide();
            $("#divValorEvaluacionAptitud").hide();

            reglasRegionalDocumentos();
            reglasTipoAdministrativoParaDocumentos();
            break;
        default:
            break;
    }

    // Si es jurídica
    if ($("#tipopersona").val() === 'f2082ce0-5a26-4289-8cde-75b9a27a89fb') {
        $("#existenciaReprestacionLegal").rules('add', { required: true });
        $("#divExistenciaReprestacionLegal").show();
        $("#divAutorizacion").show();
    } else {
        $("#existenciaReprestacionLegal").rules('remove', 'required');
        $("#divExistenciaReprestacionLegal .invalid-feedback").html('');
        $("#divExistenciaReprestacionLegal").hide();
        $("#divAutorizacion").hide();
        $("#existenciaReprestacionLegal").val("");
        $("#autorizacion").val("");
    }
}

function reglasTipoAdministrativoParaDocumentos() {
    $('#frmStep7').validate();
    // Si el contrato es administrativo
    if ($("#tipocontrato").val() === '0266ff39-aa4a-4a07-b10e-4bc5983f8682') {
        if ($("#tipoadmin").val() === '02f24d3f-1f8d-4c5d-bc20-dc7735e158bd' ||
            $("#tipoadmin").val() === 'c81706dd-f609-4ae6-8026-f4e38dff4b6b' ||
            $("#tipoadmin").val() === 'deeb70b2-b591-4b73-b014-c7541bcc0826') {
            // Si es Compraventa, Consesión o Arrendamiento y/o adquisición de inmueble respectivamente
            $("#divLibertadTradicionInmueble").show();
            $("#divPoderContrato").show();

            // Si es Compraventa
            if ($("#tipoadmin").val() === '02f24d3f-1f8d-4c5d-bc20-dc7735e158bd') {
                $("#divEscrituraPublica").show();
                $("#pazYSalvo").rules('add', { required: true });
                $("#divPazYSalvo").show();
            }

            // Ocultar
            $("#especificacionesTecnicas").rules('remove', 'required');
            $("#divEspecificacionesTecnicas .invalid-feedback").html('');
            $("#divEspecificacionesTecnicas").hide();
            $("#especificacionesTecnicas").val("");
        } else if ($("#tipoadmin").val() === 'cf12177e-9bbb-4d0d-998e-734fda13fb2e') {
            // Si es Obra Civil
            $("#especificacionesTecnicas").rules('add', { required: true });
            $("#divEspecificacionesTecnicas").show();

            // Ocultar
            $("#divLibertadTradicionInmueble").hide();
            $("#divPoderContrato").hide();
            $("#divEscrituraPublica").hide();
            $("#pazYSalvo").rules('remove', 'required');
            $("#divPazYSalvo .invalid-feedback").html('');
            $("#divPazYSalvo").hide();
            $("#libertadTradicionInmueble").val("");
            $("#poderContrato").val("");
            $("#escrituraPublica").val("");
            $("#pazYSalvo").val("");
        }
    }
}

function desactivarReglasTipoAdministrativoParaDocumentos() {
    $("#divLibertadTradicionInmueble").hide();
    $("#divPoderContrato").hide();
    $("#divEscrituraPublica").hide();
    $("#pazYSalvo").rules('remove', 'required');
    $("#divPazYSalvo .invalid-feedback").html('');
    $("#divPazYSalvo").hide();
    $("#especificacionesTecnicas").rules('remove', 'required');
    $("#divEspecificacionesTecnicas .invalid-feedback").html('');
    $("#divEspecificacionesTecnicas").hide();
    $("#libertadTradicionInmueble").val("");
    $("#poderContrato").val("");
    $("#escrituraPublica").val("");
    $("#pazYSalvo").val("");
    $("#especificacionesTecnicas").val("");
}

function reglasRegionalDocumentos() {
    // Si es de tipo de contrato administrativo y es de regional nacional
    if ($("#tipocontrato").val() === 'f86799bd-b41f-4d16-b374-fbcf870a38df' &&
        $("#regional").val() === '37b49207-5ec1-4fd3-8987-e1baa492d0ba') {
        $("#divAprobacionGerencia").show();
    } else {
        $("#divAprobacionGerencia").hide();
        $("#aprobacionGerencia").val("");
    }
}

function reglasConsorcioOUnionParaDocumentos() {
    if ($("#esconsorcio").val() === '1' || $("#uniontemporal").val() === '1') {
        $("#frmStep7").validate();
        $("#docPrivadoConformacion").rules('add', { required: true });
        $("#divDocPrivadoConformacion").show();
    } else {
        $("#docPrivadoConformacion").rules('remove', 'required');
        $("#divDocPrivadoConformacion .invalid-feedback").html('');
        $("#divDocPrivadoConformacion").hide();
        $("#docPrivadoConformacion").val("");
    }
}

function reglasContratoAdministrativoYNaturalParaCampos() {
    // Si es tipo de contrato administrativo y tipo persona natural
    if ($("#tipocontrato").val() === "0266ff39-aa4a-4a07-b10e-4bc5983f8682" &&
        $("#tipopersona").val() === "8c413059-0cf0-4677-bf2a-8d25ab497ca8") {
        // Oculto tipo de documento NIT
        $('#tipoidentificacion option[value="6a107070-acb6-11ea-bb37-0242ac130002"]').prop("hidden", true);

        return true;
    } else {
        // Muestro tipo de documento NIT
        $('#tipoidentificacion option[value="6a107070-acb6-11ea-bb37-0242ac130002"]').prop("hidden", false);
    }
    return false;
}

function reglasContratoAdministrativoYJuridicoParaCampos() {
    // Si es tipo de contrato administrativo y tipo persona jurídica
    if ($("#tipocontrato").val() === "0266ff39-aa4a-4a07-b10e-4bc5983f8682" &&
        $("#tipopersona").val() === "f2082ce0-5a26-4289-8cde-75b9a27a89fb") {
        // Oculto tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", true);
        // Oculto tipo de documento CE
        $('#tipoidentificacion option[value="dc01aefb-633d-4688-8b0f-a43852237749"]').prop("hidden", true);
        // Oculto tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", true);

        // Muestro
        $("#divTipoPrestador").show();
        $("#tipoprestador").rules('add', { required: true });
        $("#lblTipoPrestador").html("Tipo Jurídico *");

        return true;
    } else {
        // Muestro tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", false);
        // Muestro tipo de documento CE
        $('#tipoidentificacion option[value="dc01aefb-633d-4688-8b0f-a43852237749"]').prop("hidden", false);
        // Muestro tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", false);

        // Oculto
        $("#divTipoPrestador").hide();
        $("#tipoprestador").rules('remove', 'required');
    }
    return false;
}

function reglasContratoAsistencialYNaturalParaCampos() {
    // Si es tipo de contrato asistencial y tipo persona natural
    if ($("#tipocontrato").val() === "63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b" &&
        $("#tipopersona").val() === "8c413059-0cf0-4677-bf2a-8d25ab497ca8") {
        // Oculto tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", true);
        // Oculto tipo de documento NIT
        $('#tipoidentificacion option[value="6a107070-acb6-11ea-bb37-0242ac130002"]').prop("hidden", true);
        // Oculto tipo de documento RUT
        $('#tipoidentificacion option[value="811bda5e-b6b4-4227-94b7-4fc4b205d148"]').prop("hidden", true);
        return true;
    } else {
        // Muestro tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", false);
        // Muestro tipo de documento NIT
        $('#tipoidentificacion option[value="6a107070-acb6-11ea-bb37-0242ac130002"]').prop("hidden", false);
        // Muestro tipo de documento RUT
        $('#tipoidentificacion option[value="811bda5e-b6b4-4227-94b7-4fc4b205d148"]').prop("hidden", false);
    }
    return false;
}

function reglasContratoAsistencialYJuridicaParaCampos() {
    // Si es tipo de contrato asistencial y tipo persona jurídica
    if ($("#tipocontrato").val() === "63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b" &&
        $("#tipopersona").val() === "f2082ce0-5a26-4289-8cde-75b9a27a89fb") {
        // Oculto tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", true);
        // Oculto tipo de documento RUT
        $('#tipoidentificacion option[value="811bda5e-b6b4-4227-94b7-4fc4b205d148"]').prop("hidden", true);
        // Oculto tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", true);
        // Oculto tipo de documento CE
        $('#tipoidentificacion option[value="dc01aefb-633d-4688-8b0f-a43852237749"]').prop("hidden", true);

        // Muestro
        $("#divTipoPrestador").show();
        $("#tipoprestador").rules('add', { required: true });
        $("#lblTipoPrestador").html("Tipo Jurídico *");

        return true;
    } else {
        // Muestro tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", false);
        // Muestro tipo de documento RUT
        $('#tipoidentificacion option[value="811bda5e-b6b4-4227-94b7-4fc4b205d148"]').prop("hidden", false);
        // Muestro tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", false);
        // Muestro tipo de documento CE
        $('#tipoidentificacion option[value="dc01aefb-633d-4688-8b0f-a43852237749"]').prop("hidden", false);

        // Oculto
        $("#divTipoPrestador").hide();
        $("#tipoprestador").rules('remove', 'required');
    }
    return false;
}

function reglasContratoComercialYJuridicaParaCampos() {
    // Si es tipo de contrato comercial y tipo persona jurídica
    if ($("#tipocontrato").val() === "f86799bd-b41f-4d16-b374-fbcf870a38df" &&
        $("#tipopersona").val() === "f2082ce0-5a26-4289-8cde-75b9a27a89fb") {
        // Oculto tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", true);
        // Oculto tipo de documento RUT
        $('#tipoidentificacion option[value="811bda5e-b6b4-4227-94b7-4fc4b205d148"]').prop("hidden", true);
        // Oculto tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", true);
        // Oculto tipo de documento CE
        $('#tipoidentificacion option[value="dc01aefb-633d-4688-8b0f-a43852237749"]').prop("hidden", true);

        // Muestro
        $("#divTipoPrestador").show();
        $("#tipoprestador").rules('add', { required: true });
        $("#lblTipoPrestador").html("Tipo Corredor *");

        return true;
    } else {
        // Muestro tipo de documento Pasaporte
        $('#tipoidentificacion option[value="d64f79bc-4802-4c5e-850e-549766fcac4d"]').prop("hidden", false);
        // Muestro tipo de documento RUT
        $('#tipoidentificacion option[value="811bda5e-b6b4-4227-94b7-4fc4b205d148"]').prop("hidden", false);
        // Muestro tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", false);
        // Muestro tipo de documento CE
        $('#tipoidentificacion option[value="dc01aefb-633d-4688-8b0f-a43852237749"]').prop("hidden", false);

        // Oculto
        $("#divTipoPrestador").hide();
        $("#tipoprestador").rules('remove', 'required');
        $("#tipoprestador").rules('remove', 'required');
    }
    return false;
}

$("#tipocontrato").on('change', function () {
    reglasTipoContratoParaDocumentos();

    if (!reglasContratoAdministrativoYJuridicoParaCampos()) {
        if (!reglasContratoAdministrativoYNaturalParaCampos()) {
            if (!reglasContratoAsistencialYNaturalParaCampos()) {
                if (!reglasContratoAsistencialYJuridicaParaCampos()) {
                    if (!reglasContratoComercialYJuridicaParaCampos()) {
                        // Mas reglas
                    }
                }
            }
        }
    }

    if (objContraparteContractual != null) {
        if ($('#tipoidentificacion option[value="' + objContraparteContractual.TipoIdentificacionID + '"]').prop("hidden")) {
            limpiarFormContraparte();
        }
    } else {
        limpiarFormContraparte()
    }

    $("#frmStep3").validate();

    switch ($("#tipocontrato").val()) {
        case 'f86799bd-b41f-4d16-b374-fbcf870a38df':
            // Si es contrato comercial
            $("#tipoadmin").rules('remove', 'required');
            $("#divTipoAdministrativo").hide();
            $("#codigohabilitacion").rules('remove', 'required');
            $("#divCodigoHabilitacion").hide();
            $("#fechavencimiento").rules('remove', 'required');
            $("#divFechaVencimiento").hide();
            $("#tipocomercial").rules('add', { required: true });
            $("#divTipoComercial").show();
            $("#modalidad").rules('remove', 'required');
            $("#divModalidad").hide();
            break;
        case '63b0b70a-a6b2-4b5d-a8f3-b98a0e9ca80b':
            // Si es contrato asistencial
            $("#codigohabilitacion").rules('add', { required: true });
            $("#divCodigoHabilitacion").show();
            $("#fechavencimiento").rules('add', { required: true });
            $("#divFechaVencimiento").show();
            $("#modalidad").rules('add', { required: true });
            $("#divModalidad").show();

            $("#tipoadmin").rules('remove', 'required');
            $("#divTipoAdministrativo").hide();
            $("#tipocomercial").rules('remove', 'required');
            $("#divTipoComercial").hide();
            break;
        case '0266ff39-aa4a-4a07-b10e-4bc5983f8682':
            // Si es contrato administrativo
            $("#tipoadmin").rules('add', { required: true });
            $("#divTipoAdministrativo").show();

            $("#codigohabilitacion").rules('remove', 'required');
            $("#divCodigoHabilitacion").hide();
            $("#fechavencimiento").rules('remove', 'required');
            $("#divFechaVencimiento").hide();
            $("#tipocomercial").rules('remove', 'required');
            $("#divTipoComercial").hide();
            $("#modalidad").rules('remove', 'required');
            $("#divModalidad").hide();
            break;
        default:
            break;
    }
});

$("#tipopersona").on('change', function () {
    reglasTipoContratoParaDocumentos();

    if (!reglasContratoAdministrativoYJuridicoParaCampos()) {
        if (!reglasContratoAdministrativoYNaturalParaCampos()) {
            if (!reglasContratoAsistencialYNaturalParaCampos()) {
                if (!reglasContratoAsistencialYJuridicaParaCampos()) {
                    if (!reglasContratoComercialYJuridicaParaCampos()) {
                        // Mas reglas
                    }
                }
            }
        }
    }

    if (objContraparteContractual != null) {
        if ($('#tipoidentificacion option[value="' + objContraparteContractual.TipoIdentificacionID + '"]').prop("hidden")) {
            limpiarFormContraparte();
        }
    } else {
        limpiarFormContraparte()
    }

    // Si es jurídica
    if ($("#tipopersona").val() === 'f2082ce0-5a26-4289-8cde-75b9a27a89fb') {
        $("#lblRazonONombre").html("Razón social *");
        // Oculto tipo de documento CC
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", true);
    } else {
        $("#lblRazonONombre").html("Nombre completo *");
        $('#tipoidentificacion option[value="47e9d6a4-9655-4971-bed0-e5eef9877861"]').prop("hidden", false);
    }

});

$("#tipoadmin").on('change', function () {
    reglasTipoAdministrativoParaDocumentos();
    $("#frmStep3").validate();

    // Si selecciona 'Transportes'
    if ($("#tipoadmin").val() === "5a5ba09e-accd-412c-835b-a8e859a83203") {
        $("#codigohabilitaciontransporte").rules('add', { required: true });
        $("#divCodigoHabilitacionTransporte").show();
        $("#fechavencimientohabilitaciontransporte").rules('add', { required: true });
        $("#divFechaVencimientoHabilitacionTransporte").show();
    } else {
        $("#codigohabilitaciontransporte").rules('remove', 'required');
        $("#divCodigoHabilitacionTransporte").hide();
        $("#fechavencimientohabilitaciontransporte").rules('remove', 'required');
        $("#divFechaVencimientoHabilitacionTransporte").hide();
    }
});

$("#tipocomercial").on('change', function () {
    // Si es de tipo de contrato comercial
    if ($("#tipocontrato").val() === 'f86799bd-b41f-4d16-b374-fbcf870a38df') {
        // Si es de tipo comercial de agencia
        if ($("#tipocomercial").val() === 'bedff04a-8cb6-4c6b-afdc-7e1f3e5972be') {
            $("#divExpAgenteComercial").show();
        } else {
            $("#divExpAgenteComercial").hide();
            $("#expAgenteComercial").val("");
        }
    } else {
        $("#divExpAgenteComercial").hide();
        $("#expAgenteComercial").val("");
    }
});

$("#tiposolicitud").on('change', function () {
    $("#lblNombreTipoSolicitud").html($("#tiposolicitud option:selected").text());
});

$("#regional").on('change', function () {
    reglasRegionalDocumentos();
});

$("#esconsorcio").on('change', function () {
    reglasConsorcioOUnionParaDocumentos();
});

$("#uniontemporal").on('change', function () {
    reglasConsorcioOUnionParaDocumentos();
});

$("#tipomoneda").on('change', function () {
    reglasConsorcioOUnionParaDocumentos();

    switch ($("#tipomoneda").val()) {
        case "27299c12-e75f-4e36-8a5e-ecec0825bf38":
            // USD
            $("#monto").maskMoney(
                {
                    prefix: 'USD$ ',
                    allowNegative: false,
                    thousands: '.',
                    decimal: ',',
                    precision: 2,
                    affixesStay: true
                });
            break;
        case "73062c4a-0de9-4c7f-9cba-adccf0ec2402":
            // Euro
            $("#monto").maskMoney(
                {
                    prefix: 'UE$ ',
                    allowNegative: false,
                    thousands: '.',
                    decimal: ',',
                    precision: 2,
                    affixesStay: true
                });
            break;
        case "362a35ea-b626-470a-baa7-fcde0e91299b":
            // Peso
            $("#monto").maskMoney(
                {
                    prefix: 'COP$ ',
                    allowNegative: false,
                    thousands: '.',
                    decimal: ',',
                    precision: 2,
                    affixesStay: true
                });
            $("#trm").val("1");
            $("#trm").focus();
            break;
        default:
            break;
    }

    CalculoValorContrato();
    $("#monto").focus();
});

$("#IncluyePolizaResponsabildadCivilExtracontractual").on('change', function () {
    if ($(this).val() === '0') {
        $("#FechaInicioPolizaRespCivilExtracontractual").rules('remove', 'required');
        $("#divFechaInicioPolizaRespCivilExtracontractual .invalid-feedback").html('');
        $("#FechaFinPolizaRespCivilExtracontractual").rules('remove', 'required');
        $("#divFechaFinPolizaRespCivilExtracontractual .invalid-feedback").html('');
        $("#ValorPolizaResponsabildadCivilExtracontractual").rules('remove', 'required');
        $("#divValorPolizaResponsabildadCivilExtracontractual .invalid-feedback").html('');
        $("#divFechaInicioPolizaRespCivilExtracontractual").show();
        $("#divFechaFinPolizaRespCivilExtracontractual").show();
        $("#divValorPolizaResponsabildadCivilExtracontractual").show();
        $("#divPolizaCivilExtraContractual").show();
    } else {
        $("#FechaInicioPolizaRespCivilExtracontractual").rules('remove', 'required');
        $("#divFechaInicioPolizaRespCivilExtracontractual .invalid-feedback").html('');
        $("#FechaFinPolizaRespCivilExtracontractual").rules('remove', 'required');
        $("#divFechaFinPolizaRespCivilExtracontractual .invalid-feedback").html('');
        $("#ValorPolizaResponsabildadCivilExtracontractual").rules('remove', 'required');
        $("#divValorPolizaResponsabildadCivilExtracontractual .invalid-feedback").html('');
        $("#divFechaInicioPolizaRespCivilExtracontractual").hide();
        $("#divFechaFinPolizaRespCivilExtracontractual").hide();
        $("#divValorPolizaResponsabildadCivilExtracontractual").hide();
        $("#divPolizaCivilExtraContractual").hide();
        $("#fechaInicioPolizaRespCivilExtracontractual").val("");
        $("#fechaFinPolizaRespCivilExtracontractual").val("");
        $("#valorPolizaResponsabildadCivilExtracontractual").val("");
        $("#polizaCivilExtraContractual").val("");
    }
});

function CalculoValorContrato() {
    if ($("#tipomoneda").val() === '362a35ea-b626-470a-baa7-fcde0e91299b') { //moneda == Col pesos
        $("#trm").prop('disabled', true);
        if ($("#monto").maskMoney('unmasked')[0] >= 0) {
            $("#valorcontrato").val(parseFloat($("#monto").maskMoney('unmasked')[0]).toFixed(2).toString().replace(".", ","));
        }
    } else {
        $("#trm").prop('disabled', false);
        if ($("#monto").maskMoney('unmasked')[0] >= 0 && $("#trm").maskMoney('unmasked')[0] >= 0) {
            $("#valorcontrato").val(parseFloat($("#trm").maskMoney('unmasked')[0] * $("#monto").maskMoney('unmasked')[0]).toFixed(2).toString().replace(".", ","));
        } else {
            $("#valorcontrato").val(0);
        }
    }
    $("#valorcontrato").focus();
}

/*
    Author: Carlos Caicedo
    Date: 20/08/2020
    Desc: Sube la documentación de la solicitud a SharePoint
    Params:
    Response: void
*/
function subirDocumentacionSolicitud() {

    // Se valida el formulario
    if ($("#frmStep7").valid()) {

        var formData = new FormData();
        var jsonMsg;
        var count = 0;

        $("#frmStep7").find("input[type=file]").each(function (index, field) {
            if (field.files.length > 0) {
                const flName = field.files[0].name;
                const strLastDot = flName.lastIndexOf('.');
                const strExt = flName.substring(strLastDot + 1);
                formData.append('files', field.files[0], field.id + "." + strExt);
                count = count + 1;
            }
        });

        if (count > 0) {
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
                CBFunction: "cbSubirDocumentacionSolicitud",
                Action: "Solicitud/SubirDocumentacionSolicitud",
                Data: formData,
                Loading: true
            };

            getFormDataFromADS(objRequestParams);
        } else {
            AsignarBandeja();
        }
    }
}

function cbSubirDocumentacionSolicitud(objJsonResponse) {
    if (!objJsonResponse.resp) {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: "Error" });
    } else {
        AsignarBandeja();
    }
}

function AsignarBandeja() {
    var objJsonParams = {
        SolicitudNo: strSolicitudNo
    };

    const objRequestParams = {
        CBFunction: "cbAsignarBandeja",
        Action: "Solicitud/AsignarBandeja",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };
    getDataFromADS(objRequestParams);
}

function cbAsignarBandeja(jsonResp) {
    if (jsonResp.resp) {
        if (jsonResp.data !== "") {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: "Registro de la solicitud No. " + strSolicitudNo + " exitoso",
                Type: "Success"
            };
            showITCMessage(jsonMsg);
            regresarMisSolicitudes();
        } else {
            var jsonMsg = {
                Title: "Mensaje",
                Msg: jsonResp.Msg,
                Type: "Warning"
            };
            showITCMessage(jsonMsg);
        }
    }
}
