document.addEventListener("DOMContentLoaded", loadLogin);

var nuVerificationCode = 0;
var strRolesEmpresa = "";
var arrayForms = [];
var nuCurrentIndexForm = 0;
var strEmpresaIdPersist = "";
var nuTokenEmpresa = Math.floor((Math.random() * (9999 - 1000 + 1)) + 1000);
var strNomenclatura = "";
var strNombreNomenclatura = "";
var strNumeroNomenclatura = "";
var strComplementoNomenclatura = "";
var strPrimerNumeroPredio = "";
var strComplementoPrimeroNumeroPredio = "";
var strSegundoNumeroPredio = "";
var strDireccionFormateada = "";
var blNit = false;
var blEmail = false;

/** @type { JQueryValidation.RulesDictionary } */

var objValidationRulesInfoEmpresa = {
    razonSocial: { required: true },
    nombreComercial: { required: true },
    registroCamara: { required: true, alphanumeric: true },
    direccionEmpresa: { required: true },
    paisEmpresa: { required: true },
    departamentoEmpresa: { required: true },
    ciudadEmpresa: { required: true },
    telefonoEmpresa: { number: true },
    faxEmpresa: { required: true, number: true },
    datosPersona: { lettersonly: true },
    emailEmpresa: { required: true, email: true }
};

var objValidationRulesNit = {
    nit: { required: true, alphanumericWithSpace: true, maxlength: 30 }
};

var objValidationRulesInfoContacto = {
    tipoDocumento: { required: true },
    numeroDocumento: { required: true, alphanumeric: true, maxlength: 20 },
    nombre: { required: true, alphanumeric: true, maxlength: 30 },
    segundoNombre: { alphanumeric: true, maxlength: 30 },
    apellido: { required: true, alphanumeric: true, maxlength: 30 },
    segundoApellido: { required: true, maxlength: 30 },
    email: { required: true, email: true },
    telefono: { required: true, number: true, minlength: 10 },
    password2: { required: true, minlength: 14 },
    cargo: { required: true }
};

var objValidationRulesEstablecimiento = {
    paisEstablecimiento: { required: true },
    departamentoEstablecimiento: { required: true },
    ciudadEstablecimiento: { required: true },
    nombreEstablecimiento: { required: true },
    latitud: { required: true },
    longitud: { required: true },
    direccionEstablecimiento: { required: true },
    corregimiento: { required: true },
    faxEstablecimiento: { required: true }
};

var objValidationRulesSucursal = {
    nombreSucursal: { required: true },
    direccionSucursal: { required: true },
    telefonoSucursal: { required: true, number: true },
    paisSucursal: { required: true },
    departamentoSucursal: { required: true },
    ciudadSucursal: { required: true },
    entidadAmbientalSucursal: { required: true }
};

var objValidationRulesLimiteRecepcionResiduos = {
    tipoResiduoEmpresaReceptora: { required: true },
    cantidadTipoResiduoEmpresaReceptora: { required: true, number: true, min: 0, max: 100000 }
};

var objValidationRulesLimiteTransporteResiduos = {
    tipoResiduoEmpresaTransportadora: { required: true },
    cantidadTipoResiduoEmpresaTransportadora: { required: true, number: true, min: 0, max: 100000 }
};

var objValidationRulesDocumentosBasicos = {
    rut: { required: true },
    camaraComercio: { required: true },
    cedulaRepresentante: { required: true }
};

var objValidationRulesDireccionFormateada = {
    nomenclatura: { required: true },
    nombreNomenclatura: { required: false },
    numeroNomenclatura: { required: true },
    complementoNomenclatura: { required: false },
    primerNumeroPredio: { required: true },
    complementoPrimeroNumeroPredio: { required: false },
    segundoNumeroPredio: { required: true }
};

/**
 *
 */
function loadLogin() {
    $('[data-toggle="tooltip"]').tooltip();

    document.getElementById("imgCaptcha")
        .addEventListener("click", generateCaptcha);

    document.getElementById("btnLogin")
        .addEventListener("click", loginGIRApp);

    document.getElementById("btnSignupCompany")
        .addEventListener("click", signupGIRAppCompany);

    document.getElementById("btnSignup")
        .addEventListener("click", signupGIRApp);

    document.getElementById("aShowHidePassword")
        .addEventListener("click", togglePassword);

    document.getElementById("aShowHidePassword2")
        .addEventListener("click", togglePassword2);

    document.getElementById("aSignupUser")
        .addEventListener("click",
            () => {
                arrayForms.push('cardInfoContacto');
                $("#divLogin").fadeOut(() => {
                    $("#divRegisterUser").removeClass("d-none").fadeIn();
                    $("input:text:visible:first").focus();
                });
            });

    document.getElementById("aSignupCompany")
        .addEventListener("click",
            () => {
                arrayForms.push('cardInfoEmpresa');
                arrayForms.push('divCheckSucursal');
                $("#divTokenRegistro").html(nuTokenEmpresa);
                $("#divLogin").fadeOut(() => {
                    $("#divRegistrarEmpresa").removeClass("d-none").fadeIn();
                    $("input:text:visible:first").focus();
                });

            });

    document.getElementById("aLoginUser")
        .addEventListener("click",
            () => {
                arrayForms = [];
                nuCurrentIndexForm = 0;
                $("#divRegisterUser").fadeOut(() => $("#divLogin").fadeIn());
            });

    // Cierra todos los formularios de registro de empresa
    document.getElementById("aLoginCompany")
        .addEventListener("click",
            () => {
                mostrarLogin();
            });

    document.getElementById("aRecoverPassword")
        .addEventListener("click", forgotPassword);

    document.getElementById("btnRecoverPwd")
        .addEventListener("click", recoverPassword);

    document.getElementById("btnSendCode")
        .addEventListener("click", validateCode);

    document.getElementById("btnSendMailCode")
        .addEventListener("click", validateMailCode);

    document.getElementById("btnCloseSendMailCodeModal")
        .addEventListener("click", () => clearModalData());

    $("#slcPaisEmpresa")
        .change(() => {
            fetchDepartamentos();
        });

    $("#slcDepartamento")
        .change(() => {
            fetchCiudades();
        });

    $("#slcPaisEstablecimiento")
        .change(() => { fetchDepartamentosEstablecimiento(); });

    $("#slcDepartamentoEstablecimiento")
        .change(() => { fetchCiudadesEstablecimiento(); });

    $("#slcPaisSucursal")
        .change(() => { fetchDepartamentosSucursal(); });

    $("#slcDepartamentoSucursal")
        .change(() => { fetchCiudadesSucursal(); });

    $("#txtNit")
        .keyup((e) => { fetchDatosEmpresa(e.target.value); });

    $.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^[a-z0-9\\]+$/i.test(value);
    }, "Ingresa solo números o letras.");

    $.validator.addMethod("alphanumericWithSpace", function (value, element) {
        return this.optional(element) || /^[a-z0-9\\ ]+$/i.test(value);
    }, "Username must contain only letters, numbers or spaces.");

    $.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Solo caracteres alfabéticos");

    $("#txtNumeroNomenclatura").inputFilter(function (value) {
        return /^\d*$/.test(value);
    });

    $("#txtPrimerNumeroPredio").inputFilter(function (value) {
        return /^\d*$/.test(value);
    });

    $("#txtSegundoNumeroPredio").inputFilter(function (value) {
        return /^\d*$/.test(value);
    });

    $('#txtCantidadTipoResiduoEmpresaReceptora').keypress(function (event) {
        if (((event.which != 46 || (event.which == 46 && $(this).val() == '')) ||
            $(this).val().indexOf('.') != -1) && (event.which < 48 || (event.which > 57))) {
            event.preventDefault();
        }
    }).on('paste', function (event) {
        event.preventDefault();
    });

    $('#txtCantidadTipoResiduoEmpresaTransportadora').keypress(function (event) {
        if (((event.which != 46 || (event.which == 46 && $(this).val() == '')) ||
            $(this).val().indexOf('.') != -1) && (event.which < 48 || (event.which > 57))) {
            event.preventDefault();
        }
    }).on('paste', function (event) {
        event.preventDefault();
    });

    generateCaptcha();

    fetchPaises();
    fetchPaisesEstablecimiento();
    fetchPaisesSucursal();
    fetchEntidadesAmbientales();
    fetchTiposResiduo();
    fetchRoles();

    var arrComplementos = new Array("NORTE", "SUR", "OESTE", "ESTE", "BIS", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");

    var strOptionComplemento = "";

    for (var i = 0; i < arrComplementos.length; i++) {
        strOptionComplemento = "<option value='" + i + "'>" + arrComplementos[i] + "</option>";
        $("#slcComplementoNomenclatura").append(strOptionComplemento);
        $("#slcComplementoPrimeroNumeroPredio").append(strOptionComplemento);
    }

    var arrNomenclaturas = new Array("CALLE", "CARRERA", "AUTOPISTA", "AVENIDA", "DIAGONAL", "ADMINISTRACION", "AGENCIA", "AGRUPACION", "AVENIDA CARRERA",
        "ALTILLO", "ALMACEN", "APARTAMENTO", "APARTADO", "BODEGA",
        "BLOQUE", "BOULEVAR", "BARRIO", "CASA", "CENTRO COMERCIAL", "CIUDADELA", "CELULA",
        "CIRCULAR", "CAMINO", "CONJUNTO RESIDENCIAL", "CONJUNTO",
        "CORREGIMIENTO", "CARRETERA", "CIRCUNVALAR", "CONSULTORIO", "DEPOSITO",
        "DEPARTAMENTO", "DEPOSITO SOTANO", "EDIFICIO", "ENTRADA", "ESQUINA", "ESTE", "ETAPA",
        "EXTERIOR", "FINCA", "GARAJE", "GARAJE SOTANO", "HACIENDA", "INTERIOR", "KILOMETRO",
        "LOCAL", "LOCAL MEZZANINE", "LOTE", "MUNICIPIO", "MODULO", "MEZZANINE", "MANZANA",
        "NORTE", "ORIENTE", "OCCIDENTE", "OESTE", "OFICINA", "PISO", "PARCELA", "PREDIO", "PENTHOUSE",
        "PARQUE INDUSTRIAL", "PASAJE", "PLANTA", "PUENTE", "PORTERIA", "PARQUEADERO", "PASEO",
        "PUESTO", "SALON", "SALON COMUNAL", "SECTOR", "SOLAR", "SUPERMANZANA", "SEMISOTANO",
        "SOTANO", "SUITE", "SUR", "TERMINAL", "TORRE", "TRANSVERSAL", "TERRAZA", "UNIDAD",
        "UNIDAD RESIDENCIAL", "URBANIZACION", "VEREDA", "VARIANTE", "ZONA FRANCA", "ZONA", "",
        "ADLANTE", "AL LADO", "ATRAS", "CASERIO", "CENTRO", "COSULTORIO", "CORREGIMIENTO", "ESCALERA",
        "HANGAR", "INSPECCION DE POLICIA", "INSPECCION DEPARTAMENTAL", "INSPECCION MUNICIPAL",
        "MOJON", "MUELLE", "PARAJE", "PARK WAY", "PARQUE", "POSTE", "ROUND POINT", "SALON", "SALON COMUNAL", "VIA");

    var strOptionNomenclatura = "";

    for (var i = 0; i < arrNomenclaturas.length; i++) {
        strOptionNomenclatura = "<option value='" + i + "'>" + arrNomenclaturas[i] + "</option>";
        $("#slcNomenclatura").append(strOptionNomenclatura);
    }

    $("#slcNomenclatura").trigger("change");

    /**
     * @type { JQueryValidation.RulesDictionary }
     */
    const objValidationRulesSignin =
    {
        username: { required: true },
        password: { required: true },
        captchaCode:
        {
            required: true,
            maxlength: 4,
            minlength: 4,
            number: true
        }
    };

    $("#frmLogin").validate({
        rules: objValidationRulesSignin,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            username: { required: "El nombre de usuario es requerido" },
            password: { required: "La contraseña es requerida" },
            captchaCode: {
                required: "Ingresa el código captcha de la imagen",
                maxlength: "Ingresa los 4 dígitos del codigo",
                minlength: $.validator.format("Ingresa los {0} dígitos del código"),
                number: "Ingresa solo números."
            }
        }
    });

    validateFormInfoEmpresa();
    validateFormEstablecimiento();
    validateFormInfoContacto();
    validateFormSucursal();
    validateFormLimiteRecepcionResiduos();
    validateFormLimiteTransporteResiduos();
    validateFormDocumentosBasicos();
    validateFormDireccionFormateada();
    $("#txtTokenAcceso").val(nuTokenEmpresa);

    $("#txtNumeroDocumento").val("1113682332");
    $("#txtNombre").val("Carlos");
    $("#txtSegundoNombre").val("Andres");
    $("#txtApellido").val("Caicedo");
    $("#txtSegundoApellido").val("Usman");

    $("#txtEmailUser").val("ccaicedo@intelecto.co");
    $("#txtTelefonoUser").val("1234567890");
    $("#txtCargo").val("Consultor");
    $("#txtContrasena2").val("Intelecto2020**");

    $("#txtRazonSocial").val("Intelecto SAS");
    $("#txtNombreComercial").val("Intelecto");
    $("#txtNit").val("564895165498");
    $("#txtRegistroCamara").val("427245695145");
    $("#txtDireccionEmpresa").val("Calle 3b 45");

    $("#txtTelefonoEmpresa").val("3013611705");
    $("#txtFaxEmpresa").val("789456123");
    $("#txtNumeroDocumentoRepresentante").val("1258225185125");
    $("#txtEmailEmpresa").val("carlos.andres.caicedo@hotmail.com");

    $("#txtNombreEstablecimiento").val("Intelecto");
    $("#txtLatitud").val("3.39457");
    $("#txtLongitud").val("-76.537251");
    $("#txtDireccionEstablecimiento").val("Calle 50 50");
    $("#txtCorregimiento").val("Probando");

    $("#txtTelefonoEstablecimiento").val("1234567890");
    $("#txtFaxEstablecimiento").val("1234567890");
    $("#txtVereda").val("Probando");
    $("#txtBarrio").val("Probando");
    $("#txtFechaInicioActividad").val("2020-04-15");

    $("#txtUsuario").val("ccaicedo@intelecto.co");
    $("#txtContrasena").val("Intelecto2020**");

}

(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));

$("#slcNomenclatura")
    .change(() => {
        if ($("#slcNomenclatura option:selected").text() != "" && $("#slcNomenclatura option:selected").text() != "Seleccione una opción") {
            strNomenclatura = $("#slcNomenclatura option:selected").text() + " ";
        } else {
            strNomenclatura = "";
        }
        setDireccionFormateada();
    });

$("#slcComplementoNomenclatura")
    .change(() => {
        if ($("#slcComplementoNomenclatura option:selected").text() != "" && $("#slcComplementoNomenclatura option:selected").text() != "Ninguno") {
            strComplementoNomenclatura = $("#slcComplementoNomenclatura option:selected").text() + " ";
        } else {
            strComplementoNomenclatura = "";
        }
        setDireccionFormateada();
    });

$("#slcComplementoPrimeroNumeroPredio")
    .change(() => {
        if ($("#slcComplementoPrimeroNumeroPredio option:selected").text() != "" && $("#slcComplementoPrimeroNumeroPredio option:selected").text() != "Ninguno") {
            strComplementoPrimeroNumeroPredio = $("#slcComplementoPrimeroNumeroPredio option:selected").text() + " ";
        } else {
            strComplementoPrimeroNumeroPredio = "";
        }
        setDireccionFormateada();
    });

$('#chkNombreNomenclatura').change(function () {
    if (this.checked) {
        objValidationRulesDireccionFormateada.nombreNomenclatura.required = true;
        objValidationRulesDireccionFormateada.numeroNomenclatura.required = false;
        strNumeroNomenclatura = "";
        strComplementoNomenclatura = "";
        $('#divNumeroNomenclatura').hide();
        $('#divComplementoNomenclatura').hide();
        $('#divNombreNomenclatura').show();
    } else {
        objValidationRulesDireccionFormateada.nombreNomenclatura.required = false;
        objValidationRulesDireccionFormateada.numeroNomenclatura.required = true;
        strNombreNomenclatura = "";
        $('#divNumeroNomenclatura').show();
        $('#divComplementoNomenclatura').show();
        $('#divNombreNomenclatura').hide();
    }
    setDireccionFormateada();
});

$("#txtNombreNomenclatura").bind('keyup', function (e) {
    if (e.which >= 97 && e.which <= 122) {
        var newKey = e.which - 32;
        // I have tried setting those
        e.keyCode = newKey;
        e.charCode = newKey;
    }
    $("#txtNombreNomenclatura").val(($("#txtNombreNomenclatura").val()).toUpperCase());
});

$('#txtNombreNomenclatura').on('keyup', function () {
    strNombreNomenclatura = $('#txtNombreNomenclatura').val() + " ";
    setDireccionFormateada();
});

$('#txtNumeroNomenclatura').on('keyup', function () {
    strNumeroNomenclatura = $('#txtNumeroNomenclatura').val() + " ";
    setDireccionFormateada();
});

$('#txtPrimerNumeroPredio').on('keyup', function () {
    strPrimerNumeroPredio = $('#txtPrimerNumeroPredio').val() + " ";
    setDireccionFormateada();
});

$('#txtSegundoNumeroPredio').on('keyup', function () {
    strSegundoNumeroPredio = $('#txtSegundoNumeroPredio').val() + " ";
    setDireccionFormateada();
});

function setDireccionFormateada() {
    strDireccionFormateada = strNomenclatura + strNombreNomenclatura + strNumeroNomenclatura + strComplementoNomenclatura +
        "# " + strPrimerNumeroPredio + strComplementoPrimeroNumeroPredio + "- " + strSegundoNumeroPredio;
    $("#txtDireccionFormateada").val(strDireccionFormateada);
}

function formatearDireccion(strInputId) {
    if ($("#frmFormatearDireccion").valid()) {
        $("#" + strInputId).val(strDireccionFormateada);
        strNomenclatura = "";
        strNombreNomenclatura = "";
        strNumeroNomenclatura = "";
        strComplementoNomenclatura = "";
        strPrimerNumeroPredio = "";
        strComplementoPrimeroNumeroPredio = "";
        strSegundoNumeroPredio = "";
        strDireccionFormateada = "";
        $("#frmFormatearDireccion").find("input[type=text], input[type=number]").val("");
        $("#slcNomenclatura").val($("#slcNomenclatura option:first").val());
        $("#slcNomenclatura").trigger("change");
        $("#slcComplementoNomenclatura").val($("#slcComplementoNomenclatura option:first").val());
        $("#slcComplementoNomenclatura").trigger("change");
        $("#slcComplementoPrimeroNumeroPredio").val($("#slcComplementoPrimeroNumeroPredio option:first").val());
        $("#slcComplementoPrimeroNumeroPredio").trigger("change");
        $('#modalFormatearDireccion').modal('hide');
    }
}

function enviarIdDireccion(strInputId) {
    $('#modalFormatearDireccion').modal('show');
    $("#btnFormatearDireccion").attr("onclick", "formatearDireccion('" + strInputId + "')");
}

function mostrarLogin() {

    for (var i = 0; i < arrayForms.length; i++) {
        $("#" + arrayForms[i]).hide();
    }

    $("#divControles").fadeIn(500);
    $("#cardInfoEmpresa").show();
    $("#btnSiguiente").show();
    $("#btnAtras").hide();
    $("#divRegistrarEmpresa").fadeOut(() => $("#divLogin").fadeIn());
    arrayForms = [];
    nuCurrentIndexForm = 0;
}

function validateFormInfoEmpresa() {
    $("#frmcardInfoEmpresa").validate({
        rules: objValidationRulesInfoEmpresa,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            nit: { required: "El nit de la empresa es requerido", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            razonSocial: { required: "La raz&oacute;n social es requerida" },
            nombreComercial: { required: "El nombre comercial es requerido" },
            nit: { required: "El nit de la empresa es requerido", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            registroCamara: { required: "El registro de Cámara de comercio es requerido" },
            direccionEmpresa: { required: "La dirección es requerida" },
            paisEmpresa: { required: "El país es requerido" },
            departamentoEmpresa: { required: "El departamento es requerido" },
            ciudadEmpresa: { required: "La ciudad es requerida" },
            telefonoEmpresa: { number: "El número telefónico es requerido" },
            faxEmpresa: { required: "El fax es requerido", number: "Ingresa solo números" },
            emailEmpresa: { required: "El email es requerido", email: "Ingresa un email válido" },
            Domain: { required: "El dominio es requerido" }
        }
    });
}

function validateFormEstablecimiento() {
    $("#frmcardEstablecimiento").validate({
        rules: objValidationRulesEstablecimiento,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            paisEstablecimiento: { required: "El país es requerido" },
            departamentoEstablecimiento: { required: "El departamento es requerido" },
            ciudadEstablecimiento: { required: "La ciudad es requerida" },
            nombreEstablecimiento: { required: "El nombre del establecimiento es requerido.", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            latitud: { required: "La latitud es requerida" },
            longitud: { required: "La longitud es requerida" },
            direccionEstablecimiento: { required: "La dirección del establecimiento es requerida" },
            corregimiento: { required: "El corregimiento es requerido" },
            faxEstablecimiento: { required: "El fax del establecimiento es requerido" }
        }
    });
}

function validateFormInfoContacto() {
    $("#frmcardInfoContacto").validate({
        rules: objValidationRulesInfoContacto,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            nitEmpresa: { required: "El nit de la empresa es requerido" },
            tokenEmpresa: { required: "El token de la empresa es requerido" },
            tipoDocumento: { required: "El tipo de documento es requerido" },
            numeroDocumento: { required: "El nit es requerido.", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            nombre: { required: "El nombre es requerido.", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            segundoNombre: { maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            apellido: { required: "El apellido es requerido.", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            segundoApellido: { required: "El segundo apellido es requerido.", maxlength: $.validator.format("No ingreses mas {0} caracteres") },
            email: { required: "El correo electrónico es requerido", email: "Ingresa un email válido" },
            telefono: { required: "El número telefónico es requerido", number: "Ingresa solo números", minlength: $.validator.format("Ingresa al menos {0} números") },
            cargo: { required: "El cargo es requerido" },
            password2: { required: "La contraseña es requerida", minlength: $.validator.format("Ingresa al menos {0} caracteres") }
        }
    });
}

function validateFormSucursal() {
    $("#frmcardSucursal").validate({
        rules: objValidationRulesSucursal,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            nombreSucursal: { required: "El nombre es requerido" },
            direccionSucursal: { required: "La dirección es requerida" },
            telefonoSucursal: { required: "El número telefónico es requerido", number: "Solo se permiten números" },
            paisSucursal: { required: "El país es requerido" },
            departamentoSucursal: { required: "El departamento es requerido" },
            ciudadSucursal: { required: "La ciudad es requerida" },
            entidadAmbientalSucursal: { required: "La entidad ambiental es requerida" },
        }
    });
}

function validateFormLimiteRecepcionResiduos() {
    $("#frmcardLimiteRecepcionResiduos").validate({
        rules: objValidationRulesLimiteRecepcionResiduos,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            tipoResiduoEmpresaReceptora: { required: "El tipo de residuo es requerido" },
            cantidadTipoResiduoEmpresaReceptora: { required: "La cantidad es requerida", max: "El límite permitido es 100000 kg", min: "Debe ser un valor mayor a 0 kg" },
        }
    });
}

function validateFormLimiteTransporteResiduos() {
    $("#frmcardLimiteTransporteResiduos").validate({
        rules: objValidationRulesLimiteTransporteResiduos,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            tipoResiduoEmpresaTransportadora: { required: "El tipo de residuo es requerido" },
            cantidadTipoResiduoEmpresaTransportadora: { required: "La cantidad es requerida", max: "El límite permitido es 100000 kg", min: "Debe ser un valor mayor a 0 kg" },
        }
    });
}

function validateFormDocumentosBasicos() {
    $("#frmcardDocumentosBasicos").validate({
        rules: objValidationRulesDocumentosBasicos,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            rut: { required: "El RUT es requerido" },
            camaraComercio: { required: "El registro de cámara y comercio es requerido" },
            cedulaRepresentante: { required: "La cédula del representante es requerida" }
        }
    });
}

function validateFormDireccionFormateada() {
    $("#frmFormatearDireccion").validate({
        rules: objValidationRulesDireccionFormateada,
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            nomenclatura: { required: "Este campo es requerido" },
            nombreNomenclatura: { required: "Este campo es requerido" },
            numeroNomenclatura: { required: "Este campo es requerido" },
            complementoNomenclatura: { required: "Este campo es requerido" },
            primerNumeroPredio: { required: "Este campo es requerido" },
            complementoPrimeroNumeroPredio: { required: "Este campo es requerido" },
            segundoNumeroPredio: { required: "Este campo es requerido" }
        }
    });
}

function nextForm() {
    // Se valida cuando es el formulario de límite de recepción de residuos
    if (arrayForms[nuCurrentIndexForm] == "cardLimiteRecepcionResiduos") {
        if (nuIndiceAcumulativoLimiteRecepcionResiduos == 0) {
            return showITCMessage({
                Title: "Validación",
                Msg: "Debe seleccionar al menos un tipo y cantidad de residuo de recepción",
                Type: "Warning"
            });
        }
        procesoPaginaSiguiente();
    } else if (arrayForms[nuCurrentIndexForm] == "cardLimiteTransporteResiduos") {
        if (nuIndiceAcumulativoLimiteTransporteResiduos == 0) {
            return showITCMessage({
                Title: "Validación",
                Msg: "Debe seleccionar al menos un tipo y cantidad de residuo de transporte",
                Type: "Warning"
            });
        }
        procesoPaginaSiguiente();
    } else if (arrayForms[nuCurrentIndexForm] == "cardInfoEmpresa") {
        if (strRolesEmpresa == "") {
            return showITCMessage({
                Title: "Validación",
                Msg: "Debe seleccionar al menos un tipo de empresa para continuar",
                Type: "Warning"
            });
        }
        // Se valida el formulario
        if ($("#frm" + arrayForms[nuCurrentIndexForm]).valid()) {
            // Se agrega la sucursal por defecto
            if (nuIdSucursalPorDefecto > -1) {
                borrarSucursal("borrarSucursal" + nuIdSucursalPorDefecto);
            }
            setSucursalDefaultData();
            procesoPaginaSiguiente();
        }
    } else {
        // Se valida el formulario
        if ($("#frm" + arrayForms[nuCurrentIndexForm]).valid()) {
            procesoPaginaSiguiente();
        }
    }
}

function procesoPaginaSiguiente() {
    // Proceso de página siguiente
    $("#" + arrayForms[nuCurrentIndexForm]).fadeOut(500);
    nuCurrentIndexForm += 1;
    $("#" + arrayForms[nuCurrentIndexForm]).fadeIn(500, function () {
        $("input:text:visible:first").focus();
    });

    if (nuCurrentIndexForm == (arrayForms.length - 1)) {
        $("#divControles").fadeOut(500);
        $("#btnAtrasUltimaPagina").fadeIn(500);
        $("#divMsgSucursales").fadeIn(500);
        $("#divSubmitEmpresa").fadeIn(500);
    }

    if (nuCurrentIndexForm > 0) {
        $("#btnAtras").fadeIn(500);
    }
}

function setSucursalDefaultData() {
    var jsonSucursal =
    {
        indiceSucursal: nuIndiceAcumulativoSucursales,
        nombre: $("#txtRazonSocial").val(),
        regionId: $("#slcCiudadEmpresa option:selected").val(),
        direccion: $("#txtDireccionEmpresa").val(),
        telefono: $("#txtTelefonoEmpresa").val(),
        entidadAmbientalId: $("#slcEntidadAmbientalSucursal option:selected").val()
    };

    jsonArraySucursales.push(jsonSucursal);
    nuIdSucursalPorDefecto = nuIndiceAcumulativoSucursales;

    var html = '';
    html += '<tr>';
    html += '<td>' + $("#txtRazonSocial").val() + '</td>';
    html += '<td>' + $("#slcCiudadEmpresa option:selected").text() + '</td>';
    html += '<td>' + $("#txtDireccionEmpresa").val() + '</td>';
    html += '<td>' + $("#txtTelefonoEmpresa").val() + '</td>';
    html += '<td>' + $("#slcEntidadAmbientalSucursal option:selected").text() + '</td>';
    html += '<td><button type="button" id="borrarSucursal' + nuIndiceAcumulativoSucursales + '" onclick="borrarSucursal(this.id)" data-value="' + nuIndiceAcumulativoSucursales + '" class="btn btn-danger btn-sm"><i class="fas fa-minus"></i></button></td></tr>';
    $('#tbodySucursales').append(html);
    nuIndiceAcumulativoSucursales++;
    $("#rowSucursalesVacio").hide();
}

function backForm() {

    $("#" + arrayForms[nuCurrentIndexForm]).fadeOut(500);

    nuCurrentIndexForm -= 1;

    if (nuCurrentIndexForm == 0) {
        $("#btnAtras").fadeOut(100);
    }

    if (nuCurrentIndexForm < (arrayForms.length - 1)) {
        $("#divControles").fadeIn(500);
        $("#btnAtrasUltimaPagina").fadeOut(500);
        $("#divMsgSucursales").fadeOut(500);
        $("#divSubmitEmpresa").fadeOut(500);
    }

    $("#" + arrayForms[nuCurrentIndexForm]).fadeIn(500, function () {
        $("input:text:visible:first").focus();
    });
}

/**
 *
 */
function generateCaptcha() {
    // Clear captcha code
    $("txtCaptcha").val("");

    var objRequestParams =
    {
        CBFunction: "cbGenerateCaptcha",
        Action: "Home/GenerateCaptcha",
        Loading: false
    };

    getDataFromADS(objRequestParams);

    // Generate a new captcha within an interval
    setTimeout(function () {
        if (document.getElementById("divLogin").style.display != "none") {
            window.location.reload();
        }
    }, 180000);
}

/**
 *
 * @param { ApplicationResponse } jsonResponse
 */
function cbGenerateCaptcha(jsonResp) {
    if (!isNull(jsonResp.data)) $("#imgCaptcha").prop("src", jsonResp.data)
}

/**
 *
 * @param { Event } event
 */
function loginGIRApp(event) {
    event.preventDefault();

    if ($("#frmLogin").valid()) {
        /**
         * @type { HTMLInputElement[] }
         */
        const [tbxUsername, tbxPassword, tbxCaptcha] = document.querySelectorAll("#txtUsuario, #txtContrasena, #txtCaptcha");

        var strJsonParams = JSON.stringify({
            UserName: tbxUsername.value,
            Password: tbxPassword.value,
            Captcha: tbxCaptcha.value
        });

        var objRequestParams = {
            CBFunction: "cbLoginGIRApp",
            Action: "Home/Login",
            Data: JSON.stringify({ Data: strJsonParams }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbLoginGIRApp(objJsonResponse) {
    if (!objJsonResponse.resp) {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type })
    }
    else {
        window.location.href = isNullOrEmpty(objJsonResponse.redirect) ? "" : objJsonResponse.redirect;
    }
}

/**
 *
 * @param { Event } event
 */
function signupGIRAppCompany(event) {
    event.preventDefault();

    if ($("#frmcardInfoContacto").valid()) {
        /** @type { HTMLInputElement[] } */

        if (!$("#chkAcceptTermsConditions").prop('checked')) {
            return showITCMessage({
                Title: "Validación",
                Msg: "Debe aceptar los términos y condiciones para continuar.",
                Type: "Warning"
            });
        }

        if (nuIdSucursalPorDefecto == -1) {
            return showITCMessage({
                Title: "Validación",
                Msg: "Debe de agregar sucursales de su empresa",
                Type: "Warning"
            });
        }

        var objJsonParams =
        {
            Nit: $("#txtNit").val(),
            RazonSocial: $("#txtRazonSocial").val(),
            NombreComercial: $("#txtNombreComercial").val(),
            Domain: $("#txtDomain").val(),
            TokenAcceso: $("#txtTokenAcceso").val(),
            RegCamaraComercio: $("#txtRegistroCamara").val(),
            DireccionEmpresa: $("#txtDireccionEmpresa").val(),
            TelefonoEmpresa: $("#txtTelefonoEmpresa").val(),
            FaxEmpresa: $("#txtFaxEmpresa").val(),
            RegionEmpresa: $("#slcCiudadEmpresa").find(":selected").val(),
            DocTipoRepresentante: $("#slcTipoDocumentoRepresentante").find(":selected").val(),
            DocNumRepresentante: $("#txtNumeroDocumentoRepresentante").val(),
            EmailEmpresa: $("#txtEmailEmpresa").val(),
            Roles: strRolesEmpresa,
            NombreEstablecimiento: $("#txtNombreEstablecimiento").val(),
            Latitud: $("#txtLatitud").val(),
            Longitud: $("#txtLongitud").val(),
            DireccionEstablecimiento: $("#txtDireccionEstablecimiento").val(),
            Corregimiento: $("#txtCorregimiento").val(),
            RegionEstablecimiento: $("#slcCiudadEstablecimiento").find(":selected").val(),
            TelefonoEstablecimiento: $("#txtTelefonoEstablecimiento").val(),
            FaxEstablecimiento: $("#txtFaxEstablecimiento").val(),
            Vereda: $("#txtVereda").val(),
            Barrio: $("#txtBarrio").val(),
            FechaInicioActividad: $("#txtFechaInicioActividad").val(),
            Sucursales: jsonArraySucursales
        };

        var blEsReceptor = verificarSiTieneRol("c0000000-0000-0000-0000-000000000003");

        if (blEsReceptor) {
            objJsonParams.LimiteRecepcionResiduos = jsonArrayLimiteRecepcionResiduos;
        }

        var blEsTransportador = verificarSiTieneRol("c0000000-0000-0000-0000-000000000004");

        if (blEsTransportador) {
            objJsonParams.LimiteTransporteResiduos = jsonArrayLimiteTransporteResiduos;
        }

        var jsonData = JSON.stringify({ Data: JSON.stringify(objJsonParams) });

        const objRequestParams = {
            CBFunction: "cbSignupCompanyGIRApp",
            Action: "Empresa/RegistrarEmpresa",
            Data: jsonData,
            Loading: true
        };
        getDataFromADS(objRequestParams);
    }
}

function verificarSiTieneRol(strRolVerificar) {
    var arrayRoles = [];
    var blTieneRol = false;
    if (strRolVerificar != "") {
        arrayRoles = strRolVerificar.split(",");
        var i = 0;
        while (i < arrayRoles.length && !blTieneRol) {
            if (arrayRoles[i] == strRolVerificar) {
                blTieneRol = true
            }
        }
    }
    return blTieneRol;
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbSignupCompanyGIRApp(objJsonResponse) {

    if (!objJsonResponse.resp) {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: "Error" })
    } else {
        showITCMessage({
            Title: "Registro",
            Msg: objJsonResponse.msg,
            Type: "Success"
        });

        $("#divControles").fadeOut(500);
        $("#divSubmitEmpresa").fadeOut(500);

        arrayForms.push('cardDocumentosBasicos');
        $("#" + arrayForms[nuCurrentIndexForm]).fadeOut(500);
        nuCurrentIndexForm += 1;
        $("#" + arrayForms[nuCurrentIndexForm]).fadeIn(500, function () {
            $("input:text:visible:first").focus();
        });
        $("#divSubmitDocumentosBasicosEmpresa").fadeIn(500);
    }
}

/**
 *
 * @param { Event } event
 */
function signupGIRApp(event) {
    event.preventDefault();

    if ($("#frmcardInfoContacto").valid()) {
        /** @type { HTMLInputElement[] } */

        if (!$("#chkAcceptTermsConditionsUser").prop('checked')) {
            return showITCMessage({
                Title: "Validación",
                Msg: "Debe aceptar los términos y condiciones para continuar.",
                Type: "Warning"
            });
        }

        var strPassword = $("#txtContrasena2").val();
        var strExpUpperCase = /[A-Z]/;
        var strExpLowerCase = /[a-z]/;
        var strExpNumber = /[0-9]/;

        if (strPassword.length < 14 || strPassword.length > 32 || !strExpUpperCase.test(strPassword)
            || !strExpLowerCase.test(strPassword) || !strExpNumber.test(strPassword) || !validateCharacteres(strPassword)) {
            var strHtmlList = '<ul>';
            strHtmlList += '<li>Mayúsculas</li>';
            strHtmlList += '<li>Minúsculas</li>';
            strHtmlList += '<li>Números</li>';
            strHtmlList += '<li>Entre 14 y 32 caracteres</li>';
            strHtmlList += '<li>Al menos dos símbolos: ! " # $ % & \' ( ) * + , - . / : ; < = > ? @[\] ^ _` { | } ~</li>';
            strHtmlList += '<li>No puede contener el NIT ingresado</li>';
            strHtmlList += '</ul>';

            return showITCMessage({
                Title: "Validación",
                Msg: "Por favor validar las políticas de seguridad de la contraseña, recuerde que debe contener:<br/><br/>" + strHtmlList,
                Type: "Warning"
            });
        }

        var objJsonParams =
        {
            NitEmpresa: $("#txtNitEmpresa").val(),
            TokenEmpresa: $("#txtTokenEmpresa").val(),
            DocTipo: $("#slcTipoDocumento").val(),
            DocNumero: $("#txtNumeroDocumento").val(),
            Nombre: $("#txtNombre").val(),
            SegundoNombre: $("#txtSegundoNombre").val(),
            Apellido: $("#txtApellido").val(),
            SegundoApellido: $("#txtSegundoApellido").val(),
            TelefonoUser: $("#txtTelefonoUser").val(),
            EmailUser: $("#txtEmailUser").val(),
            Password: $("#txtContrasena2").val(),
            Cargo: $("#txtCargo").val()
        };

        var jsData = JSON.stringify({ Data: JSON.stringify(objJsonParams) });

        const objRequestParams = {
            CBFunction: "cbSignupGIRApp",
            Action: "User/RegisterUser",
            Data: jsData,
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

function validateCharacteres(strValidate) {

    var strExpCharter = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
    var nuCount = 0;

    for (var x = 0; x < strValidate.length; x++) {
        var strCharacter = strValidate.substr(x, 1);
        if (strExpCharter.test(strCharacter)) {
            nuCount++;
        }
    }

    if (nuCount >= 2) {
        return true;
    }
    else {
        return false;
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbSignupGIRApp(objJsonResponse) {

    if (!objJsonResponse.resp) {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: "Error" })
    } else {

        // Se suben los archivos básicos de la empresa


        showITCMessage({
            Title: "Registro",
            Msg: objJsonResponse.msg,
            Type: "Success"
        });

        setTimeout(() => { window.location.href = isNullOrEmpty(objJsonResponse.redirect) ? "" : objJsonResponse.redirect; }, 2000);
    }
}

/**
 *
 * @param { Event } event
 */
function forgotPassword(event) {
    event.preventDefault();

    if ($("#txtUsuario").val() !== "" && $("#txtCaptcha").val() !== "") {
        $("#txtEmailConfirm").val("");
        $("#recoverPasswordModal").modal("toggle");
    }
    else {
        var jsonMsg = {
            Title: "Validación",
            Msg: "Usuario y captcha son obligatorios para restablecer tu contraseña.",
            Type: "Warning"
        }
        showITCMessage(jsonMsg);
    }
}

/**
 *
 * @param { EventTargetType<HTMLButtonElement> } event
 */
function recoverPassword(event) {
    event.preventDefault();

    $("#frmForgotPwd").validate({
        rules: { email: { required: true, email: true } },
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            email: {
                required: "El correo electrónico es requerido",
                email: "Ingresa un email válido"
            }
        }
    });

    if ($("#frmForgotPwd").valid()) {
        const objJsonParams =
        {
            Email: $("#txtEmailConfirm").val(),
            SAMAccountName: $("#txtUsuario").val(),
            Captcha: $("#txtCaptcha").val()
        };

        const objRequestParams =
        {
            CBFunction: "cbRecoverPassword",
            Action: "Home/SendCode",
            Data: JSON.stringify({ Data: objJsonParams })
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { applicationResponse } objJsonResp
 */
function cbRecoverPassword(objJsonResp) {

    if (objJsonResp.resp && objJsonResp.type === "Success") {

        showITCMessage(
            {
                Title: "Validación",
                Msg: objJsonResp.msg,
                Type: objJsonResp.type
            });

        $("#txtEmailConfirm").val("");
        $("#txtNewPassword").val("");
        $("#txtNewPasswordConfirmation").val("");
        $("#txtCode").val("");
        $("#recoverPasswordModal").modal('hide');
        $("#sendCodeModal").modal('show');
    }
    else {
        showITCMessage(
            {
                Title: "Validación",
                Msg: objJsonResp.msg,
                Type: objJsonResp.type
            });
    }
}

/**
 *
 * @param { Event } event
 */
function validateCode(event) {

    event.preventDefault();

    $("#frmSendCode").validate({
        rules: { code: { required: true, number: true }, NewPassword: { required: true, minlength: 14, maxlength: 32 }, NewPasswordConfirmation: { required: true, minlength: 14, maxlength: 32 } },
        errorClass: "is-invalid",
        errorPlacement: (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
        onkeyup: (element) => $(element).valid(),
        validClass: "is-valid",
        errorElement: "div",
        messages: {
            code: {
                required: "Ingrese el código de verificación",
                number: "Ingrese solo números"
            },
            NewPassword: {
                required: "Ingrese la nueva contraseña",
                minlength: $.validator.format("Ingresa al menos {0} caracteres"),
                maxlength: $.validator.format("Ingresa menos de {0} caracteres")
            },
            NewPasswordConfirmation: {
                required: "Confirme su nueva contraseña",
                minlength: $.validator.format("Ingresa al menos {0} caracteres"),
                maxlength: $.validator.format("Ingresa menos de {0} caracteres")
            }
        }
    });

    var strPassword = $("#txtNewPassword").val();
    var strConfirmPassword = $("#txtNewPasswordConfirmation").val();

    if (strPassword != strConfirmPassword) {

        showITCMessage({
            Title: "Validación",
            Msg: "Las contraseñas ingresadas no coinciden.",
            Type: "Warning"
        });

        return;
    }

    var strExpUpperCase = /[A-Z]/;
    var strExpLowerCase = /[a-z]/;
    var strExpNumber = /[0-9]/;

    if (strPassword.length < 14 || strPassword.length > 32 || strPassword.includes($("#txtUsuario").val()) || !strExpUpperCase.test(strPassword)
        || !strExpLowerCase.test(strPassword) || !strExpNumber.test(strPassword) || !validateCharacteres(strPassword)) {
        var strHtmlList = '<ul>';
        strHtmlList += '<li>Mayúsculas</li>';
        strHtmlList += '<li>Minúsculas</li>';
        strHtmlList += '<li>Números</li>';
        strHtmlList += '<li>Entre 14 y 32 caracteres</li>';
        strHtmlList += '<li>Al menos dos símbolos: ! " # $ % & \' ( ) * + , - . / : ; < = > ? @[\] ^ _` { | } ~</li>';
        strHtmlList += '<li>No puede contener el nombre de usuario</li>';
        strHtmlList += '</ul>';

        showITCMessage({
            Title: "Validación",
            Msg: "Por favor validar las políticas de seguridad de la contraseña, recuerde que debe contener:<br/><br/>" + strHtmlList,
            Type: "Warning"
        });

        return;
    }

    if ($("#frmSendCode").valid()) {

        const objJsonData =
        {
            SAMAccountName: $("#txtUsuario").val(),
            Password: $("#txtNewPassword").val(),
            CodeVerification: $("#txtCode").val()
        };

        const objRequestParams =
        {
            CBFunction: "cbValidateCode",
            Action: "Home/ValidateCode",
            Data: JSON.stringify({ Data: objJsonData }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResp
 */
function cbValidateCode(objJsonResp) {

    if (objJsonResp.resp && objJsonResp.type === "Success") {

        showITCMessage(
            {
                Title: "Validación",
                Msg: objJsonResp.msg,
                Type: objJsonResp.type
            });

        $("#sendCodeModal").modal('hide');
    }
    else {
        showITCMessage(
            {
                Title: "Validación",
                Msg: objJsonResp.msg,
                Type: objJsonResp.type
            });
    }
}

/**
 *
 */
function fetchRegions() {
    const objRequestParams =
    {
        CBFunction: "cbFetchRegions",
        Action: "Region/GetRegions",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchRegions(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayRegions = tryParseJson(objJsonResponse.data, identity, () => []);

        $("#slcRegion")
            .attr("disabled", false)
            .attr("readonly", false)
            .empty()
            .append(arrayRegions
                .map((region) => pair(`${region.Department} - ${region.City}`, region.ID))
                .map((pairRegion) =>
                    $("<option><option").text(fst(pairRegion)).val(snd(pairRegion))));
    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/**
 *
 * @param { Event } event
 */
function togglePassword(event) {
    event.preventDefault();

    const tbxPassword = $("#show_hide_password input");

    if (tbxPassword.attr("type") == "text") {
        tbxPassword
            .attr("type", "password")
            .siblings("#aShowHidePassword")
            .empty()
            .append($("<i></i>").addClass("fa fa-eye-slash").attr("aria-hidden", true));

    } else if (tbxPassword.attr("type") == "password") {
        tbxPassword
            .attr("type", "text")
            .siblings("#aShowHidePassword")
            .empty()
            .append($("<i></i>").addClass("fa fa-eye").attr("aria-hidden", true));
    }
}

/**
 *
 * @param { Event } event
 */
function togglePassword2(event) {
    event.preventDefault();

    const tbxPassword = $("#show_hide_password2 input");

    if (tbxPassword.attr("type") == "text") {
        tbxPassword
            .attr("type", "password")
            .siblings("div")
            .find("#aShowHidePassword2")
            .empty()
            .append($("<i></i>").addClass("fa fa-eye-slash").attr("aria-hidden", true));

    } else if (tbxPassword.attr("type") == "password") {
        tbxPassword
            .attr("type", "text")
            .siblings("div")
            .find("#aShowHidePassword2")
            .empty()
            .append($("<i></i>").addClass("fa fa-eye").attr("aria-hidden", true));
    }
}

function validarEmpresaPorEmail() {

    const strEmail = $("#txtEmailEmpresa").val();

    if (strEmail !== "" && strEmail.includes("@")) {

        var arrayEmail = strEmail.split("@");

        if (arrayEmail.length > 0) {
            $("#txtDomain").val(arrayEmail[1]);
        }

        var strJsonParams = JSON.stringify({
            email: $("#txtEmailEmpresa").val()
        });

        const objRequestParams = {
            CBFunction: "cbValidarEmpresaPorEmail",
            Action: "Empresa/GetEmpresaSinDuplicar",
            Data: JSON.stringify({ Data: strJsonParams }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbValidarEmpresaPorEmail(jsonResp) {
    if (jsonResp.resp == true) {
        blEmail = false;
        $("#btnSiguiente").prop("disabled", true);
        $("#txtEmailEmpresa").val("");
        showITCMessage({ Title: "Información", Msg: "Este email ya está siendo usado por una empresa", Type: "Warning" });
    } else {
        blEmail = true;
        if (blEmail == true && blNit == true) {
            $("#btnSiguiente").prop("disabled", false);
        }
    }
}

function validarUsuarioPorEmail() {

    const strEmail = $("#txtEmailUser").val();

    if (strEmail !== "" && strEmail.includes("@")) {

        var strJsonParams = JSON.stringify({
            email: $("#txtEmailUser").val()
        });

        const objRequestParams = {
            CBFunction: "cbValidarUsuarioPorEmail",
            Action: "User/GetUsuarioPorFiltros",
            Data: JSON.stringify({ Data: strJsonParams }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbValidarUsuarioPorEmail(jsonResp) {
    if (jsonResp.resp == true) {
        $("#btnSignup").prop("disabled", true);
        $("#txtEmailUser").val("");
        showITCMessage({ Title: "Información", Msg: "Este email ya está siendo usado por un usuario", Type: "Warning" });
    } else {
        $("#btnSignup").prop("disabled", false);
    }
}

/**
 *
 * @param { Event } event
 */
function validateMailCode(event) {
    event.preventDefault();

    if (nuVerificationCode == $("#txtMailCode").val()) {
        $("#btnSignup")
            .attr("disabled", false)
            .removeClass("btn-secondary")
            .addClass("btn-primary");

        $("#modalSendMailCode").modal("toggle");

        $("#txtEmail").attr("readonly", true);

        $("#btnSendMailCode").attr("disabled", true);
    }
    else {
        $("#codeEmailError").show("slow");
    }
}

function clearModalData() {
    $("#codeEmailError").hide();

    $("#txtMailCode").val("");

    nuVerificationCode = 0;
}

/**
 *
 */
function fetchPaises() {
    const objRequestParams =
    {
        CBFunction: "cbFetchPaises",
        Action: "Region/GetPaises",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchPaises(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayPaises = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcPaisEmpresa', 'ID', 'NOMPAIS', arrayPaises);

        $("#slcPaisEmpresa").trigger("change");
    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/**
 *
 */
function fetchDepartamentos() {

    var strPaisId = $("#slcPaisEmpresa option:selected").val();

    if (strPaisId != "") {
        const objRequestParams =
        {
            CBFunction: "cbFetchDepartamentos",
            Action: "Region/GetDepartamentos",
            Data: JSON.stringify({ Data: strPaisId }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchDepartamentos(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayDepartamentos = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcDepartamento', 'CODDPTO', 'NomDepartamento', arrayDepartamentos);

    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

/**
 *
 */
function fetchCiudades() {

    var strDepartamentoId = $("#slcDepartamento option:selected").val();

    if (strDepartamentoId != "") {
        const objRequestParams = {
            CBFunction: "cbFetchCiudades",
            Action: "Region/GetCiudades",
            Data: JSON.stringify({ Data: strDepartamentoId }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchCiudades(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayCiudades = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcCiudadEmpresa', 'ITC_REGIONID', 'NOMMUNICIPIO', arrayCiudades);

    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/**
 *
 */
function fetchRoles() {

    const objRequestParams =
    {
        CBFunction: "cbFetchRoles",
        Action: "Home/GetRoles",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchRoles(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayRoles = tryParseJson(objJsonResponse.data, identity, () => []);
        var strRol = "";
        // Se llena el checklist
        for (var i = 0; i < arrayRoles.length; i++) {
            strRol = "<li class='list-group-item'>" +
                arrayRoles[i].NomRol +
                "<label class='checkbox'>" +
                "<input id='check_rol_" + arrayRoles[i].ID + "' type='checkbox' class='custom-control-input checkbox-roles' />" +
                "<span class='primary'></span>" +
                "</label>" +
                "</li>";
            $("#listaRoles").append(strRol);
        }

        $('.checkbox-roles').change(function () {
            var strRoleId = $(this).attr('id').substring(10);
            if (this.checked) {
                mostrarContenidoRol(strRoleId, true);
                strRolesEmpresa += strRoleId + ",";
            } else {
                mostrarContenidoRol(strRoleId, false);
                strRolesEmpresa = strRolesEmpresa.replace(strRoleId + ",", "");
            }
        });

    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/*
    Author: Carlos Caicedo
    Date: 09/06/2020
    Desc: Mostrar contenido en la visual dependiendo del rol enviado
    Params: string (Rol), boolean (Bandera para saber si existe el contenido o no)
    Response: void
*/
function mostrarContenidoRol(strRoleId, flag) {

    switch (strRoleId) {

        case 'c0000000-0000-0000-0000-000000000002': // Generador
            if (flag) {
                // Si no existe el formulario de establecimiento en la visual, lo añade
                if (arrayForms.indexOf("cardEstablecimiento") == -1) {
                    // Se añade el formulario de establecimiento a la visual si no existe
                    var nuBeforeLastIndex = arrayForms.length - 1;
                    arrayForms.splice(nuBeforeLastIndex, 0, "cardEstablecimiento");
                }
            } else {
                // Se obtiene el id del formulario del establecimiento en el arrayForms
                var nuIndexFormEstablecimiento = arrayForms.indexOf("cardEstablecimiento");
                // Verifica si el formulario del establecimiento esta añadido a la visual (arrayForms), de ser así lo elimina
                if (nuIndexFormEstablecimiento > -1) {
                    arrayForms.splice(nuIndexFormEstablecimiento, 1);
                }
            }
            break;
        case 'c0000000-0000-0000-0000-000000000003': // Gestor
            if (flag) {
                // Si no existe el formulario de límite recepción residuos en la visual, lo añade
                if (arrayForms.indexOf("cardLimiteRecepcionResiduos") == -1) {
                    // Se añade el formulario de límite recepción residuos a la visual si no existe
                    var nuBeforeLastIndex = arrayForms.length - 1;
                    arrayForms.splice(nuBeforeLastIndex, 0, "cardLimiteRecepcionResiduos");
                }
            } else {
                // Se obtiene el id del formulario del límite recepción residuos en el arrayForms
                var nuIndexFormLimiteRecepcionResiduos = arrayForms.indexOf("cardLimiteRecepcionResiduos");
                // Verifica si el formulario del límite recepción residuos esta añadido a la visual (arrayForms), de ser así lo elimina
                if (nuIndexFormLimiteRecepcionResiduos > -1) {
                    arrayForms.splice(nuIndexFormLimiteRecepcionResiduos, 1);
                    jsonArrayLimiteRecepcionResiduos = [];
                    nuIndiceAcumulativoLimiteRecepcionResiduos = 0;
                    $('#frmcardLimiteRecepcionResiduos').get(0).reset();
                    $("#tbodyLimiteRecepcionResiduos").html("");
                    $("#tbodyLimiteRecepcionResiduos").html("<tr id='rowLimiteRecepcionResiduosVacio'><td colspan='3'><center>No hay límites agregados</center></td></tr>");
                }
            }
            break;
        case 'c0000000-0000-0000-0000-000000000004': // Transportador
            if (flag) {
                // Si no existe el formulario de límite transporte residuos en la visual, lo añade
                if (arrayForms.indexOf("cardLimiteTransporteResiduos") == -1) {
                    // Se añade el formulario de límite transporte residuos a la visual si no existe
                    var nuBeforeLastIndex = arrayForms.length - 1;
                    arrayForms.splice(nuBeforeLastIndex, 0, "cardLimiteTransporteResiduos");
                }
            } else {
                // Se obtiene el id del formulario del límite transporte residuos en el arrayForms
                var nuIndexFormLimiteTransporteResiduos = arrayForms.indexOf("cardLimiteTransporteResiduos");
                // Verifica si el formulario del límite transporte residuos esta añadido a la visual (arrayForms), de ser así lo elimina
                if (nuIndexFormLimiteTransporteResiduos > -1) {
                    arrayForms.splice(nuIndexFormLimiteTransporteResiduos, 1);
                    jsonArrayLimiteTransporteResiduos = [];
                    nuIndiceAcumulativoLimiteTransporteResiduos = 0;
                    $('#frmcardLimiteTransporteResiduos').get(0).reset();
                    $("#tbodyLimiteTransporteResiduos").html("");
                    $("#tbodyLimiteTransporteResiduos").html("<tr id='rowLimiteTransporteResiduosVacio'><td colspan='3'><center>No hay límites agregados</center></td></tr>");
                }
            }
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            break;
    }
}

/**
 *
 */
function fetchPaisesEstablecimiento() {
    const objRequestParams =
    {
        CBFunction: "cbFetchPaisesEstablecimiento",
        Action: "Region/GetPaises",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchPaisesEstablecimiento(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayPaises = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcPaisEstablecimiento', 'ID', 'NOMPAIS', arrayPaises);

        $("#slcPaisEstablecimiento").trigger("change");

    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/**
 *
 */
function fetchDepartamentosEstablecimiento() {

    var strPaisId = $("#slcPaisEstablecimiento option:selected").val();

    if (strPaisId != "") {
        const objRequestParams =
        {
            CBFunction: "cbFetchDepartamentosEstablecimiento",
            Action: "Region/GetDepartamentos",
            Data: JSON.stringify({ Data: strPaisId }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchDepartamentosEstablecimiento(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayDepartamentos = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcDepartamentoEstablecimiento', 'CODDPTO', 'NomDepartamento', arrayDepartamentos);

    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/**
 *
 */
function fetchCiudadesEstablecimiento() {

    var strDepartamentoId = $("#slcDepartamentoEstablecimiento option:selected").val();

    if (strDepartamentoId != "") {
        const objRequestParams =
        {
            CBFunction: "cbFetchCiudadesEstablecimiento",
            Action: "Region/GetCiudades",
            Data: JSON.stringify({ Data: strDepartamentoId }),
            Loading: true
        };
        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchCiudadesEstablecimiento(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayCiudades = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcCiudadEstablecimiento', 'ITC_REGIONID', 'NOMMUNICIPIO', arrayCiudades);

    }
    else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

/**
 *
 */
function fetchPaisesSucursal() {
    const objRequestParams =
    {
        CBFunction: "cbFetchPaisesSucursal",
        Action: "Region/GetPaises",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchPaisesSucursal(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayPaises = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcPaisSucursal', 'ID', 'NOMPAIS', arrayPaises);

        $("#slcPaisSucursal").trigger("change");

    }
    else
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
}

/**
 *
 */
function fetchDepartamentosSucursal(strPaisIdQuery) {

    var strPaisId = "";

    if (strPaisIdQuery != null) {
        strPaisId = strPaisIdQuery;
    } else {
        strPaisId = $("#slcPaisSucursal option:selected").val();
    }

    if (strPaisId != "") {
        const objRequestParams =
        {
            CBFunction: "cbFetchDepartamentosSucursal",
            Action: "Region/GetDepartamentos",
            Data: JSON.stringify({ Data: strPaisId }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchDepartamentosSucursal(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayDepartamentos = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcDepartamentoSucursal', 'CODDPTO', 'NomDepartamento', arrayDepartamentos);

    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

/**
 *
 */
function fetchCiudadesSucursal(strDepartamentoIdQuery) {

    var strDepartamentoId = "";

    if (strDepartamentoIdQuery != null) {
        strDepartamentoId = strDepartamentoIdQuery;
    } else {
        strDepartamentoId = $("#slcDepartamentoSucursal option:selected").val();
    }

    if (strDepartamentoId != "") {
        const objRequestParams =
        {
            CBFunction: "cbFetchCiudadesSucursal",
            Action: "Region/GetCiudades",
            Data: JSON.stringify({ Data: strDepartamentoId }),
            Loading: true
        };
        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchCiudadesSucursal(objJsonResponse) {
    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayCiudades = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcCiudadSucursal', 'ITC_REGIONID', 'NOMMUNICIPIO', arrayCiudades);

    }
    else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

function fetchDatosEmpresa(nit) {
    return;

    if (!nit) {
        return;
    }

    const objRequestParams =
    {
        CBFunction: "cbFetchDatosEmpresa",
        Action: "Home/SearchDatosEmpresa",
        Data: JSON.stringify({ Data: nit })
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchDatosEmpresa(nit) {

}

function validarEmpresaPorNit() {
    if ($("#txtNit").val() != "") {
        var strJsonParams = JSON.stringify({
            nit: $("#txtNit").val()
        });

        const objRequestParams = {
            CBFunction: "cbValidarEmpresaPorNit",
            Action: "Empresa/GetEmpresaSinDuplicar",
            Data: JSON.stringify({ Data: strJsonParams }),
            Loading: true
        };

        getDataFromADS(objRequestParams);
    }
}

function cbValidarEmpresaPorNit(jsonResp) {
    if (jsonResp.resp == true) {
        blNit = false;
        $("#btnSiguiente").prop("disabled", true);
        $("#txtNit").val("");
        showITCMessage({ Title: "Información", Msg: "La empresa ya se encuentra registrada", Type: "Warning" });
    } else {
        blNit = true;
        if (blNit == true && blEmail == true) {
            $("#btnSiguiente").prop("disabled", false);
        }
    }
}

/**
 *
 */
function fetchEntidadesAmbientales() {
    const objRequestParams =
    {
        CBFunction: "cbFetchEntidadesAmbientales",
        Action: "EntidadAmbiental/GetEntidadesAmbientales",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchEntidadesAmbientales(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayEntidadesAmbientales = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcEntidadAmbientalSucursal', 'ITC_ENTIDAD_AMBIENTALID', 'NOMBRE', arrayEntidadesAmbientales);

        $("#slcEntidadAmbientalSucursal").trigger("change");
        $("#slcEntidadAmbientalSucursal").val(arrayEntidadesAmbientales[1]["ITC_ENTIDAD_AMBIENTALID"]);
    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

/**
 *
 */
function fetchTiposResiduo() {
    const objRequestParams =
    {
        CBFunction: "cbFetchTiposResiduo",
        Action: "Solicitud/GetTiposResiduo",
        Data: JSON.stringify({}),
        Loading: true
    };

    getDataFromADS(objRequestParams);
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbFetchTiposResiduo(objJsonResponse) {

    if (objJsonResponse.resp == true) {
        /**
         * @type { Json }
         */
        const arrayTiposResiduo = tryParseJson(objJsonResponse.data, identity, () => []);

        loadCombo('slcTipoResiduoEmpresaReceptora', 'ITC_TIPO_RESIDUOID', 'NOMRESIDUO', arrayTiposResiduo);
        loadCombo('slcTipoResiduoEmpresaTransportadora', 'ITC_TIPO_RESIDUOID', 'NOMRESIDUO', arrayTiposResiduo);
        $("#slcTipoResiduoEmpresaReceptora").trigger("change");
        $("#slcTipoResiduoEmpresaTransportadora").trigger("change");

    } else {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
    }
}

var jsonArraySucursales = [];
var nuIndiceAcumulativoSucursales = 0;
var nuIdSucursalPorDefecto = -1;

var jsonArrayLimiteRecepcionResiduos = [];
var nuIndiceAcumulativoLimiteRecepcionResiduos = 0;

var jsonArrayLimiteTransporteResiduos = [];
var nuIndiceAcumulativoLimiteTransporteResiduos = 0;

/*
    Author: Carlos Caicedo
    Date: 09/06/2020
    Desc: Controla la visual del checkbox para agregar sucursales
    Params: 
    Response: void
*/
$('#checkCardSucursal').change(function () {
    if (this.checked) {
        $("#cardSucursal").fadeIn(500);
        $("input:text:visible:first").focus();
    } else {
        jsonArraySucursales = [];
        nuIndiceAcumulativoSucursales = 0;
        $('#frmcardSucursal').get(0).reset();
        $("#cardSucursal").fadeOut(500);
    }
});

/*
    Author: Carlos Caicedo
    Date: 09/06/2020
    Desc: Agrega una sucursal
    Params: 
    Response: void
*/
$('#btnAgregarSucursal').on('click', function () {
    if ($("#frmcardSucursal").valid()) {
        var jsonSucursal =
        {
            indiceSucursal: nuIndiceAcumulativoSucursales,
            nombre: $("#txtNombreSucursal").val(),
            regionId: $("#slcCiudadSucursal").val(),
            direccion: $("#txtDireccionSucursal").val(),
            telefono: $("#txtTelefonoSucursal").val(),
            entidadAmbientalId: $("#slcEntidadAmbientalSucursal").val()
        };

        jsonArraySucursales.push(jsonSucursal);

        var html = '';
        html += '<tr>';
        html += '<td>' + $("#txtNombreSucursal").val() + '</td>';
        html += '<td>' + $("#slcCiudadSucursal option:selected").text() + '</td>';
        html += '<td>' + $("#txtDireccionSucursal").val() + '</td>';
        html += '<td>' + $("#txtTelefonoSucursal").val() + '</td>';
        html += '<td>' + $("#slcEntidadAmbientalSucursal option:selected").text() + '</td>';
        html += '<td><button type="button" id="borrarSucursal' + nuIndiceAcumulativoSucursales + '" onclick="borrarSucursal(this.id)" data-value="' + nuIndiceAcumulativoSucursales + '" class="btn btn-danger btn-sm"><i class="fas fa-minus"></i></button></td></tr>';
        $('#tbodySucursales').append(html);
        nuIndiceAcumulativoSucursales++;
        $("#rowSucursalesVacio").hide();
    }
});

/*
    Author: Carlos Caicedo
    Date: 09/06/2020
    Desc: Borra una sucursal
    Params: number
    Response: void
*/
function borrarSucursal(btnId) {
    var nuIndiceSucursal = $("#" + btnId).data("value");
    for (var i = 0; i < jsonArraySucursales.length; i++) {
        if (jsonArraySucursales[i].indiceSucursal == nuIndiceSucursal) {
            jsonArraySucursales.splice(i, 1);
        }
    }
    $("#" + btnId).closest('tr').remove();

    // Si la lista queda vacia
    if ($("#tbodySucursales tr:visible").length == 0) {
        nuIndiceAcumulativoSucursales = 0;
        nuIdSucursalPorDefecto = -1;
        $("#rowSucursalesVacio").fadeIn();
    }
}

/*
    Author: Carlos Caicedo
    Date: 08/07/2020
    Desc: Agrega un límite de tipo de residuo para la empresa
    Params: 
    Response: void
*/
$('#btnAgregarLimiteRecepcionResiduos').on('click', function () {
    if ($("#frmcardLimiteRecepcionResiduos").valid()) {

        var blExisteLimiteRecepcionResiduos = false;
        var i = 0;

        while (i < jsonArrayLimiteRecepcionResiduos.length && blExisteLimiteRecepcionResiduos == false) {
            if (jsonArrayLimiteRecepcionResiduos[i].tipoResiduoEmpresaReceptora == $("#slcTipoResiduoEmpresaReceptora").val()) {
                blExisteLimiteRecepcionResiduos = true;
            }
            i++;
        }

        if (!blExisteLimiteRecepcionResiduos) {
            var cantidad = $("#txtCantidadTipoResiduoEmpresaReceptora").val().replace(".", ",");

            var jsonLimiteRecepcionResiduos =
            {
                indiceLimiteRecepcionResiduos: nuIndiceAcumulativoLimiteRecepcionResiduos,
                tipoResiduoEmpresaReceptora: $("#slcTipoResiduoEmpresaReceptora").val(),
                cantidadTipoResiduoEmpresaReceptora: cantidad
            };

            jsonArrayLimiteRecepcionResiduos.push(jsonLimiteRecepcionResiduos);

            var html = '';
            html += '<tr>';
            html += '<td>' + $("#slcTipoResiduoEmpresaReceptora option:selected").text() + '</td>';
            html += '<td>' + $("#txtCantidadTipoResiduoEmpresaReceptora").val() + '</td>';
            html += '<td><button type="button" id="borrarLimiteRecepcionResiduos' + nuIndiceAcumulativoLimiteRecepcionResiduos + '" onclick="borrarLimiteRecepcionResiduos(this.id)" data-value="' + nuIndiceAcumulativoLimiteRecepcionResiduos + '" class="btn btn-danger btn-sm"><i class="fas fa-minus"></i></button></td></tr>';
            $('#tbodyLimiteRecepcionResiduos').append(html);
            $("#rowLimiteRecepcionResiduosVacio").hide();
            $("#slcTipoResiduoEmpresaReceptora").val($("#slcTipoResiduoEmpresaReceptora option:first").val());
            $("#slcTipoResiduoEmpresaReceptora").trigger("change");
            $("#txtCantidadTipoResiduoEmpresaReceptora").val("");
            $("#txtCantidadTipoResiduoEmpresaReceptora").focus();
            nuIndiceAcumulativoLimiteRecepcionResiduos++;
        } else {
            showITCMessage({
                Title: "Validación",
                Msg: "El tipo de residuo seleccionado ya se ha agregado",
                Type: "Warning"
            });
        }
    }
});

/*
    Author: Carlos Caicedo
    Date: 08/07/2020
    Desc: Borra un límite de tipo de residuo
    Params: number
    Response: void
*/
function borrarLimiteRecepcionResiduos(btnId) {
    var nuIndiceLimiteRecepcionResiduos = $("#" + btnId).data("value");
    for (var i = 0; i < jsonArrayLimiteRecepcionResiduos.length; i++) {
        if (jsonArrayLimiteRecepcionResiduos[i].indiceLimiteRecepcionResiduos == nuIndiceLimiteRecepcionResiduos) {
            jsonArrayLimiteRecepcionResiduos.splice(i, 1);
        }
    }
    $("#" + btnId).closest('tr').remove();

    // Si la lista queda vacia
    if ($("#tbodyLimiteRecepcionResiduos tr:visible").length == 0) {
        nuIndiceAcumulativoLimiteRecepcionResiduos = 0;
        nuIdLimiteRecepcionResiduosPorDefecto = -1;
        $("#rowLimiteRecepcionResiduosVacio").fadeIn();
    }
}

/*
    Author: Carlos Caicedo
    Date: 14/07/2020
    Desc: Agrega un límite de tipo de residuo para la empresa transportadora
    Params: 
    Response: void
*/
$('#btnAgregarLimiteTransporteResiduos').on('click', function () {
    if ($("#frmcardLimiteTransporteResiduos").valid()) {

        var blExisteLimiteTransporteResiduos = false;
        var i = 0;

        while (i < jsonArrayLimiteTransporteResiduos.length && blExisteLimiteTransporteResiduos == false) {
            if (jsonArrayLimiteTransporteResiduos[i].tipoResiduoEmpresaTransportadora == $("#slcTipoResiduoEmpresaTransportadora").val()) {
                blExisteLimiteTransporteResiduos = true;
            }
            i++;
        }

        if (!blExisteLimiteTransporteResiduos) {
            var cantidad = $("#txtCantidadTipoResiduoEmpresaTransportadora").val().replace(".", ",");

            var jsonLimiteTransporteResiduos =
            {
                indiceLimiteTransporteResiduos: nuIndiceAcumulativoLimiteTransporteResiduos,
                tipoResiduoEmpresaTransportadora: $("#slcTipoResiduoEmpresaTransportadora").val(),
                cantidadTipoResiduoEmpresaTransportadora: cantidad
            };

            jsonArrayLimiteTransporteResiduos.push(jsonLimiteTransporteResiduos);

            var html = '';
            html += '<tr>';
            html += '<td>' + $("#slcTipoResiduoEmpresaTransportadora option:selected").text() + '</td>';
            html += '<td>' + $("#txtCantidadTipoResiduoEmpresaTransportadora").val() + '</td>';
            html += '<td><button type="button" id="borrarLimiteTransporteResiduos' + nuIndiceAcumulativoLimiteTransporteResiduos + '" onclick="borrarLimiteTransporteResiduos(this.id)" data-value="' + nuIndiceAcumulativoLimiteTransporteResiduos + '" class="btn btn-danger btn-sm"><i class="fas fa-minus"></i></button></td></tr>';
            $('#tbodyLimiteTransporteResiduos').append(html);
            $("#rowLimiteTransporteResiduosVacio").hide();
            $("#slcTipoResiduoEmpresaTransportadora").val($("#slcTipoResiduoEmpresaTransportadora option:first").val());
            $("#slcTipoResiduoEmpresaTransportadora").trigger("change");
            $("#txtCantidadTipoResiduoEmpresaTransportadora").val("");
            $("#txtCantidadTipoResiduoEmpresaTransportadora").focus();
            nuIndiceAcumulativoLimiteTransporteResiduos++;
        } else {
            showITCMessage({
                Title: "Validación",
                Msg: "El tipo de residuo seleccionado ya se ha agregado",
                Type: "Warning"
            });
        }
    }
});

/*
    Author: Carlos Caicedo
    Date: 14/07/2020
    Desc: Borra un límite de tipo de residuo de la empresa transportadora
    Params: number
    Response: void
*/
function borrarLimiteTransporteResiduos(btnId) {
    var nuIndiceLimiteTransporteResiduos = $("#" + btnId).data("value");
    for (var i = 0; i < jsonArrayLimiteTransporteResiduos.length; i++) {
        if (jsonArrayLimiteTransporteResiduos[i].indiceLimiteTransporteResiduos == nuIndiceLimiteTransporteResiduos) {
            jsonArrayLimiteTransporteResiduos.splice(i, 1);
        }
    }
    $("#" + btnId).closest('tr').remove();

    // Si la lista queda vacia
    if ($("#tbodyLimiteTransporteResiduos tr:visible").length == 0) {
        nuIndiceAcumulativoLimiteTransporteResiduos = 0;
        nuIdLimiteTransporteResiduosPorDefecto = -1;
        $("#rowLimiteTransporteResiduosVacio").fadeIn();
    }
}

/*
    Author: Carlos Caicedo
    Date: 24/06/2020
    Desc: Sube los documentos básicos de la empresa
    Params: 
    Response: void
*/
function subirDocumentosBasicosEmpresa() {

    // Se valida el formulario
    if ($("#frmcardDocumentosBasicos").valid()) {

        // Documentos básicos
        var formData = new FormData();
        var jsonMsg;

        const flNameRut = $('#fileRut').prop("files")[0].name;
        const strLastDotRut = flNameRut.lastIndexOf('.');
        const strExtRut = flNameRut.substring(strLastDotRut + 1);
        formData.append('files', $('#fileRut').prop("files")[0], "rut" + "." + strExtRut);

        const flNameCamaraComercio = $('#fileCamaraComercio').prop("files")[0].name;
        const strLastDotCamaraComercio = flNameCamaraComercio.lastIndexOf('.');
        const strExtCamaraComercio = flNameCamaraComercio.substring(strLastDotCamaraComercio + 1);
        formData.append('files', $('#fileCamaraComercio').prop("files")[0], "camara_comercio" + "." + strExtCamaraComercio);

        const flNameCedulaRepresentante = $('#fileCedulaRepresentante').prop("files")[0].name;
        const strLastDotCedulaRepresentante = flNameCedulaRepresentante.lastIndexOf('.');
        const strExtCedulaRepresentante = flNameCedulaRepresentante.substring(strLastDotCedulaRepresentante + 1);
        formData.append('files', $('#fileCedulaRepresentante').prop("files")[0], "cedula_representante" + "." + strExtCedulaRepresentante);

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
            CBFunction: "cbSubirDocumentosBasicosEmpresa",
            Action: "Files/SubirDocumentosBasicosEmpresa",
            Data: formData,
            Loading: true
        };

        getFormDataFromADS(objRequestParams);
    }
}

function cbSubirDocumentosBasicosEmpresa(objJsonResponse) {
    if (!objJsonResponse.resp) {
        showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: "Error" })
    } else {
        showITCMessage({
            Title: "Carga de documentos",
            Msg: objJsonResponse.msg,
            Type: "Success"
        });

        mostrarLogin();
    }
}