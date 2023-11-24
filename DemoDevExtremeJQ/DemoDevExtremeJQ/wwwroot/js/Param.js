var jsonRespWorker = null;
var jsonWorker = {};
var arrayCounties = new Array();
var arrayCities = new Array();

//ComboBox estado civil
var arrayMaritalStatus = [
    {
        "COD": "Single",
        "VAL": "Soltero(a)"
    },
    {
        "COD": "Married",
        "VAL": "Casado(a)"
    },
    {
        "COD": "Cohabiting",
        "VAL": "Unión libre"
    },
    {
        "COD": "Divorced",
        "VAL": "Divorciado(a)"
    },
    {
        "COD": "Separated",
        "VAL": "Separado(a)"
    },
    {
        "COD": "Widowed",
        "VAL": "Viudo(a)"
    }
];

var arrayTipoDireccion = [
    {
        "COD": "Casa",
        "VAL": "Casa"
    },
    {
        "COD": "Home",
        "VAL": "Conjunto Residencial"
    },
    {
        "COD": "Business",
        "VAL": "Trabajo"
    },
    {
        "COD": "Other",
        "VAL": "Otra"
    }
];

//ComboBox tipo de parentesco
var arrayContacFamily = [
    {
        "COD": "Spouse",
        "VAL": "Esposo(a)"
    },
    {
        "COD": "FamilyContact",
        "VAL": "Union libre"
    },
    {
        "COD": "Sibling",
        "VAL": "Hermano(a)"
    },
    {
        "COD": "Parent",
        "VAL": "Padre/Madre"
    },
    {
        "COD": "ExSpouse",
        "VAL": "Exesposo(a)"
    },
    {
        "COD": "OtherContact",
        "VAL": "Otro contacto"
    }
];

var arrayChildGenero = [
    {
        "COD": "Male",
        "VAL": "Masculino"
    },
    {
        "COD": "Female",
        "VAL": "Femenino"
    }
];


var arrayTallaBCamisa = [
    {
        "COD": "XXS",
        "VAL": "XXS"
    },
    {
        "COD": "XS",
        "VAL": "XS"
    },
    {
        "COD": "S",
        "VAL": "S"
    },
    {
        "COD": "M",
        "VAL": "M"
    },
    {
        "COD": "L",
        "VAL": "L"
    },
    {
        "COD": "XL",
        "VAL": "XL"
    },
    {
        "COD": "XXL",
        "VAL": "XXL"
    },
    {
        "COD": "3XL",
        "VAL": "3XL"
    },
];


var arrayTallaPantalon = [
    {
        "COD": "6",
        "VAL": "6"
    },
    {
        "COD": "8",
        "VAL": "8"
    },
    {
        "COD": "10",
        "VAL": "10"
    },
    {
        "COD": "12",
        "VAL": "12"
    },
    {
        "COD": "14",
        "VAL": "14"
    },
    {
        "COD": "18",
        "VAL": "18"
    },
    {
        "COD": "28",
        "VAL": "28"
    },
    {
        "COD": "30",
        "VAL": "30"
    },
    {
        "COD": "32",
        "VAL": "32"
    },
    {
        "COD": "34",
        "VAL": "34"
    },
    {
        "COD": "36",
        "VAL": "36"
    },
    {
        "COD": "38",
        "VAL": "38"
    },
    {
        "COD": "40",
        "VAL": "40"
    },
    {
        "COD": "42",
        "VAL": "42"
    }
];


var arrayTallaZapatos = [
    {
        "COD": "32",
        "VAL": "32"
    },
    {
        "COD": "33",
        "VAL": "33"
    },
    {
        "COD": "34",
        "VAL": "34"
    },
    {
        "COD": "35",
        "VAL": "35"
    },
    {
        "COD": "36",
        "VAL": "36"
    },
    {
        "COD": "37",
        "VAL": "37"
    },
    {
        "COD": "38",
        "VAL": "38"
    },
    {
        "COD": "39",
        "VAL": "39"
    },
    {
        "COD": "40",
        "VAL": "40"
    },
    {
        "COD": "41",
        "VAL": "41"
    },
    {
        "COD": "42",
        "VAL": "42"
    }
];

var arrayContacPersonGenero = [
    {
        "COD": "Male",
        "VAL": "Masculino"
    },
    {
        "COD": "Female",
        "VAL": "Femenino"
    }
];


//Validacion de campo de fecha de cumpleaños para modal de hijo
var dteDateNow = new Date();
var strDateNow = new Date(dteDateNow.getDate() + '-' + dteDateNow.getMonth() + '-' + dteDateNow.getFullYear() + '00:00');
var strDateEnd = new Date('01-01-1900');
var txtModalBirthdateError = 0;

//Metodo que permite hacer Validacion de campo de fecha de cumpleaños para modal de hijo
function ValidateDateModalBirthDate() {
    var strModalBirthdate = new Date($('#txtModalBirthDate').val());

    // reiniciar fechas de comparación
    strDateEnd = new Date('01-01-1900');
    dteDateNow = new Date();

    strDateEnd = new Date((strDateEnd.getMonth() + 1) + '-' + strDateEnd.getDate() + '-' + strDateEnd.getFullYear());
    strDateNow = new Date((dteDateNow.getMonth() + 1) + '-' + dteDateNow.getDate() + '-' + dteDateNow.getFullYear());
    strModalBirthdate = new Date((strModalBirthdate.getMonth() + 1) + '-' + (strModalBirthdate.getDate() + 1) + '-' + strModalBirthdate.getFullYear());

    if (strModalBirthdate > strDateNow && txtModalBirthdateError === 0) {
        $('#txtModalBirthDate').after("<label class='text-danger' id='txtModalBirthdateError'>La fecha no debe ser establecida en una fecha futura. </label>");
        txtModalBirthdateError = $('#txtModalBirthDate').length;
    }
    if (strModalBirthdate < strDateEnd && txtModalBirthdateError === 0) {
        $('#txtModalBirthDate').after("<label class='text-danger' id='txtModalBirthdateError'>La fecha seleccionada no es válida. La fecha mínima permitida es 1/1/1900. </label>");
        txtModalBirthdateError = $('#txtModalBirthDate').length;
    }
    if (((strModalBirthdate < strDateNow) && (strModalBirthdate > strDateEnd)) && txtModalBirthdateError === 1) {
        $('#txtModalBirthdateError').remove();
        txtModalBirthdateError = 0;
    }
}

//Validacion de campo de Genero para modal de hijo
function ValidateModalGenderChildren() {
    var txtGenderError;
    var strGender = $('#slcModalGenderChildren').val();
    if (Boolean(strGender)) {
        txtGenderError = 1;
    } else {
        txtGenderError = 0;
    }
    if (!Boolean(strGender) && txtGenderError === 0) {
        $('#slcModalGenderChildren').after("<label class='text-danger' id='txtGenderError'>El campo género es requerido</label>");
        txtGenderError = $('#slcModalGenderChildren').length;
    } if (Boolean(strGender) && txtGenderError === 1) {
        $('#txtGenderError').remove();
        txtGenderError = 0;
    }
}

// Validación del caracteres y estructura del email
function validateEmail(email) {
    const re = /^([\w-\.+]+)@@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return re.test(email);
}

// Metodo para la Validación del email
function validateEmailOnchange() {
    var txtEmailError;
    var strEmail = $('#txtPrimaryContactEmail').val();
    var btnUpdateWorker = $("#updateWorker");

    if (Boolean(strEmail)) {
        txtEmailError = 1;
    } else {
        txtEmailError = 0;
    }
    if (validateEmail(strEmail)) {
        txtEmailError = 1;
    } else {
        txtEmailError = 0;
    }
    if ((txtEmailError === 0)) {
        $('#errorMsg').show();
        btnUpdateWorker.attr("disabled", true);


    } else {
        $('#errorMsg').hide();
        txtEmailError = 0;
        btnUpdateWorker.attr("disabled", false);

    }
}

// Funcion que me permite validar  que el campo para telefono sea obligatorio.
function ValidatePrimaryContactPhone() {
    var txtPrimaryContactPhoneError;
    var btnUpdateWorker = $("#updateWorker");
    var strPrimaryContactPhone = $('#txtPrimaryContactPhone').val();
    if (Boolean(strPrimaryContactPhone)) {
        txtPrimaryContactPhoneError = 1;
    } else {
        txtPrimaryContactPhoneError = 0;
    }
    if (Boolean(strPrimaryContactPhone) === false && txtPrimaryContactPhoneError === 0) {
        $('#txtPrimaryContactPhone').after("<label class='text-danger' id='txtPrimaryContactPhoneError'>El campo teléfono principal es requerido</label>");
        txtPrimaryContactPhoneError = $('#txtPrimaryContactPhone').length;
        btnUpdateWorker.attr("disabled", true);

    } if (Boolean(strPrimaryContactPhone) === true && txtPrimaryContactPhoneError === 1) {
        $('#txtPrimaryContactPhoneError').remove();
        txtPrimaryContactPhoneError = 0;
        btnUpdateWorker.attr("disabled", false);
    }
}

// Funcion que me permite validar  que el campo para estado civil sea obligatorio.
function ValidatesMaritalStatus() {
    var slcMaritalStatusError;
    var strMaritalStatus = $('#slcMaritalStatus').val();
    var btnUpdateWorker = $("#updateWorker");
    if (Boolean(strMaritalStatus)) {
        slcMaritalStatusError = 1;
    } else {
        slcMaritalStatusError = 0;
    }
    if (Boolean(strMaritalStatus) === false && slcMaritalStatusError === 0) {
        $('#slcMaritalStatus').after("<label class='text-danger' id='slcMaritalStatusError'>El campo estado civil es requerido</label>");
        slcMaritalStatusError = $('#slcMaritalStatus').length;
        btnUpdateWorker.attr("disabled", true);

    } if (Boolean(strMaritalStatus) === true && slcMaritalStatusError === 1) {
        $('#slcMaritalStatusError').remove();
        slcMaritalStatusError = 0;
        btnUpdateWorker.attr("disabled", false);
    }
}

// Funcion que me permite validar  que el campo para dirección sea obligatorio.
function ValidateAddressStreet() {
    var txtAddressStreetError;
    var strAddressStreet = $('#txtAddressStreet').val();
    var btnUpdateWorker = $("#updateWorkerAddress");
    if (Boolean(strAddressStreet)) {
        txtAddressStreetError = 1;
    } else {
        txtAddressStreetError = 0;
    }
    if (Boolean(strAddressStreet) === false && txtAddressStreetError === 0) {
        $('#txtAddressStreet').after("<label class='text-danger' id='txtAddressStreetError'>El campo dirección es requerido</label>");
        txtAddressStreetError = $('#txtAddressStreet').length;
        btnUpdateWorker.attr("disabled", true);

    } if (Boolean(strAddressStreet) === true && txtAddressStreetError === 1) {
        $('#txtAddressStreetError').remove();
        txtAddressStreetError = 0;
        btnUpdateWorker.attr("disabled", false);
    }
}

// Funcion que me permite validar  que el campo descripcionde la dirección sea obligatorio.
function ValidateAddressNameDescription() {
    var txtAddressNameDescriptionError;
    var strAddressNameDescription = $('#txtAddressNameDescription').val();
    var btnUpdateWorker = $("#updateWorkerAddress");
    if (Boolean(strAddressNameDescription)) {
        txtAddressNameDescriptionError = 1;
    } else {
        txtAddressNameDescriptionError = 0;
    }
    if (Boolean(strAddressNameDescription) === false && txtAddressNameDescriptionError === 0) {
        $('#txtAddressNameDescription').after("<label class='text-danger' id='txtAddressNameDescriptionError'>El campo información de la dirección es requerido</label>");
        txtAddressNameDescriptionError = $('#txtAddressNameDescription').length;
        btnUpdateWorker.attr("disabled", true);

    } if (Boolean(strAddressNameDescription) === true && txtAddressNameDescriptionError === 1) {
        $('#txtAddressNameDescriptionError').remove();
        txtAddressNameDescriptionError = 0;
        btnUpdateWorker.attr("disabled", false);
    }
}

// Funcion que me permite validar  que el campo tipo de dirección sea obligatorio.
function ValidateAddressPurpose() {
    var slcAddressPurposeError;
    var strAddressPurpose = $('#slcAddressPurpose').val();
    var btnUpdateWorker = $("#updateWorkerAddress");
    if (Boolean(strAddressPurpose)) {
        slcAddressPurposeError = 1;
    } else {
        slcAddressPurposeError = 0;
    }
    if (Boolean(strAddressPurpose) === false && slcAddressPurposeError === 0) {
        $('#slcAddressPurpose').after("<label class='text-danger' id='slcAddressPurposeError'>El campo tipo de dirección es requerido</label>");
        slcAddressPurposeError = $('#slcAddressPurpose').length;
        btnUpdateWorker.attr("disabled", true);

    } if (Boolean(strAddressPurpose) === true && slcAddressPurposeError === 1) {
        $('#slcAddressPurposeError').remove();
        slcAddressPurposeError = 0;
        btnUpdateWorker.attr("disabled", false);
    }
}

// Funcion que me permite validar  que el campo ciudades sea obligatorio.
function ValidateAddressCity() {
    var slcAddressCityError;
    var strAddressCity = $('#slcAddressCity').val();
    var btnUpdateWorker = $("#updateWorkerAddress");
    if (Boolean(strAddressCity)) {
        slcAddressCityError = 1;
    } else {
        slcAddressCityError = 0;
    }
    if (Boolean(strAddressCity) === false && slcAddressCityError === 0) {
        $('#slcAddressCity').after("<label class='text-danger' id='slcAddressCityError'>El campo ciudad es requerido</label>");
        slcAddressCityError = $('#slcAddressCity').length;
        btnUpdateWorker.attr("disabled", true);

    } if (Boolean(strAddressCity) === true && slcAddressCityError === 1) {
        $('#slcAddressCityError').remove();
        slcAddressCityError = 0;
        btnUpdateWorker.attr("disabled", false);
    }
}

//Validaciones para los campos de contacto de emergencia
// Funcion que me permite validar  que el campo para primer nombre sea obligatorio.
function ValidateContactFirstName() {
    var txtFirstNameError;
    var strFirstName = $('#txtContactFirstName').val();
    if (Boolean(strFirstName)) {
        txtFirstNameError = 1;
    } else {
        txtFirstNameError = 0;
    }
    if (Boolean(strFirstName) === false && txtFirstNameError === 0) {
        $('#txtContactFirstName').after("<label class='text-danger' id='txtFirstNameError'>El campo primer nombre es requerido</label>");
        txtFirstNameError = $('#txtContactFirstName').length;
    } if (Boolean(strFirstName) === true && txtFirstNameError === 1) {
        $('#txtFirstNameError').remove();
        txtFirstNameError = 0;
    }
}

// Funcion que me permite validar  que el campo para segundo nombre sea obligatorio.
function ValidateContactLastName() {
    var txtLastNameError;
    var strLastName = $('#txtContactLastName').val();
    if (Boolean(strLastName)) {
        txtLastNameError = 1;
    } else {
        txtLastNameError = 0;
    }
    if (Boolean(strLastName) === false && txtLastNameError === 0) {
        $('#txtContactLastName').after("<label class='text-danger' id='txtLastNameError'>El campo apellido es requerido</label>");
        txtFirstNameError = $('#txtContactLastName').length;
    } if (Boolean(strLastName) === true && txtLastNameError === 1) {
        $('#txtLastNameError').remove();
        txtLastNameError = 0;
    }
}

// Funcion que me permite validar que el campo para tipo de relacion nombre sea obligatorio.
function ValidateRelationship() {
    var txtRelationshipError;
    var strRelationship = $('#slcRelationshipTypePersonal').val();
    if (Boolean(strRelationship)) {
        txtRelationshipError = 1;
    } else {
        txtRelationshipError = 0;
    }
    if (!Boolean(strRelationship) && txtRelationshipError === 0) {
        $('#slcRelationshipTypePersonal').after("<label class='text-danger' id='txtRelationshipError'>El campo tipo de relación es requerido</label>");
        txtRelationshipError = $('#slcRelationshipTypePersonal').length;
    } if (Boolean(strRelationship) && txtRelationshipError === 1) {
        $('#txtRelationshipError').remove();
        txtRelationshipError = 0;
    }
}

// Funcion que me permite validar  que el campo telefonico sea obligatorio.
function ValidateNumberPhone() {
    var txtNumberPhoneError;
    var strNumberPhone = $('#txtFamilyPhone').val();
    if (Boolean(strNumberPhone)) {
        txtNumberPhoneError = 1;
    } else {
        txtNumberPhoneError = 0;
    }
    if (!Boolean(strNumberPhone) && txtNumberPhoneError === 0) {
        $('#txtFamilyPhone').after("<label class='text-danger' id='txtNumberPhoneError'>El campo de teléfono es requerido</label>");
        txtNumberPhoneError = $('#txtFamilyPhone').length;
    } if (Boolean(strNumberPhone) && txtNumberPhoneError === 1) {
        $('#txtNumberPhoneError').remove();
        txtNumberPhoneError = 0;
    }
}

//Validacion de campos obligatorios para modal de hijos
// Funcion que me permite validar  que el campo primer nombre del hijo sea obligatorio.
function ValidateModalContactFirstName() {
    var txtModalContactFirstNameError;
    var strModalContactFirstName = $('#txtModalContactFirstName').val();
    if (Boolean(strModalContactFirstName)) {
        txtModalContactFirstNameError = 1;
    } else {
        txtModalContactFirstNameError = 0;
    }

    if (!Boolean(strModalContactFirstName) && txtModalContactFirstNameError === 0) {
        $('#txtModalContactFirstName').after("<label class='text-danger' id='txtModalContactFirstNameError'>El campo primer nombre es requerido</label>");
        txtModalContactFirstNameError = $('#txtModalContactFirstName').length;

    } if (Boolean(strModalContactFirstName) && txtModalContactFirstNameError === 1) {
        $('#txtModalContactFirstNameError').remove();
        txtModalContactFirstNameError = 0;
    }
}

// Funcion que me permite validar  que el campo apellido del hijo sea obligatorio.
function ValidateModalContactLastName() {
    var txtModalContactLastNameError;
    var strModalContactLastName = $('#txtModalContactLastName').val();
    if (Boolean(strModalContactLastName)) {
        txtModalContactLastNameError = 1;
    } else {
        txtModalContactLastNameError = 0;
    }
    if (!Boolean(strModalContactLastName) && txtModalContactLastNameError === 0) {
        $('#txtModalContactLastName').after("<label class='text-danger' id='txtModalContactLastNameError'>El campo apellido es requerido</label>");
        txtModalContactLastNameError = $('#txtModalContactLastName').length;
    } if (Boolean(strModalContactLastName) && txtModalContactLastNameError === 1) {
        $('#txtModalContactLastNameError').remove();
        txtModalContactLastNameError = 0;
    }
}



