document.addEventListener("DOMContentLoaded", bootstrap);

function bootstrap()
{
    // Add event listeners

    document.getElementById("btnCreate")
        .addEventListener("click", createUser);

    document.getElementById("btnValidateSAMAccountName")
        .addEventListener("click", validateSAMAccountName);
}


/**
 *
 * @param { boolean } blState
 */
function formToggle(blState)
{
    document
        .querySelectorAll("#txtBusinessName, #txtDocumentNumber, #txtContactName, #txtMobile, #txtEmail, #txtContrasena, #slcRegion, #slcRole, #btnCreate")
        .forEach((element) => $(element).attr("disabled", not(blState)).attr("readonly", not(blState)));

    $("#btnCreate").removeClass(blState ? "btn-secondary" : "btn-primary").addClass(blState ? "btn-primary" : "btn-secondary");

    const objValidator = $("#frmRegister").validate();

    objValidator.destroy();
}

/**
 *
 * @param { EventTargetType<HTMLButtonElement> } event
 */
function createUser(event)
{
    event.preventDefault();

    /** @type { JQueryValidation.RulesDictionary } */
    const objValidationRules =
        { businessName : { required : true, minlength : 3 },
          //documentNumber : { required : true, number : true, maxlength : 11 },
          contactName : { required : true, minlength : 3 },
          mobile : { number : true, minlength : 10 },
          email : { required : true, email : true },
          //region : { required : true },
          role : { required : true },
          sAMAccountName : { required : true } };

    $("#frmRegister").validate(
        { rules: objValidationRules,
          errorClass : "is-invalid",
          errorPlacement : (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
          onkeyup : (element) => $(element).valid(),
          validClass : "is-valid",
          errorElement : "div",
          messages :
          {  businessName: { required: "La razón social es requerida", minlength: $.validator.format("Ingresa al menos {0} caracteres") },
             contactName: { required: "El nombre de contacto es requerido", minlength: $.validator.format("Ingresa al menos {0} caracteres") },
             mobile: { number: "Ingresa solo números", minlength : $.validator.format("Ingresa al menos {0} números") },
             email: { required: "El correo electrónico es requerido", email: "Ingresa un email válido" },
             role: { required: "Selecciona una rol" },
             sAMAccountName : { required : "El nombre de la cuenta de usuario es requerido" } } });

    if ( $("#frmRegister").valid() )
    {
        /** @type { HTMLInputElement[] } */
        const [ txtSAMAccountName,
            txtBusinessName,
            txtDocNumber,
            txtContactName,
            txtMobile,
            txtEmail,
            slcRole,
            slcRegion ] = document
            .querySelectorAll("#txtSAMAccountName, #txtBusinessName, #txtDocumentNumber, #txtContactName, #txtMobile, #txtEmail, #slcRegion, #slcRole");

        const objJsonParams =
            { BusinessName : txtBusinessName.value,
              DocumentNumber : txtDocNumber.value,
              ContactName : txtContactName.value,
              Email : txtEmail.value,
              Mobile : txtMobile.value,
              Region: slcRegion.value,
              Role : slcRole.value,
              SAMAccountName : txtSAMAccountName.value };

        const objRequestParams =
            { CBFunction: "cbCreateUser",
              Action : "../Main/CreateUser",
              Data: JSON.stringify({ Data : objJsonParams }),
              Loading : true };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbCreateUser(objJsonResponse)
{

    if (objJsonResponse.resp) {

        showITCMessage({ Title: "Información", Type: "Success", Msg: objJsonResponse.msg });
        
        $('#frmRegister').trigger("reset");
        $('#select2-slcRole-container').text('Seleccione');

        $("#frmRegister").validate().destroy();

    }
    else {

        if (jsonResp.type == "Session") {
            $('#divModalMsgSession').modal('show');
        } else {
            showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
        }
    }
}

/**
 *
 * @param { EventTargetType<HTMLButtonElement> } event
 */
function validateSAMAccountName(event)
{
    event.preventDefault();

    /** @type { JQueryValidation.RulesDictionary } */
    const objValidationRules =
        { sAMAccountName : { required : true } };

    const objValidator = $("#frmRegister").validate(
        { rules: objValidationRules,
          errorClass : "is-invalid",
          errorPlacement : (error, element) => element.parent().find("div.invalid-feedback").text(error.text()),
          onkeyup : (element) => $(element).valid(),
          validClass : "is-valid",
          errorElement : "div",
          messages : { sAMAccountName : { required : "El nombre de la cuenta de usuario es requerido" } } });

    if ($("#frmRegister").valid())
    {
        objValidator.destroy();

        const txtSAMAccountName = document.getElementById("txtSAMAccountName");

        const objJsonParams = { SAMAccountName : txtSAMAccountName.value };

        const objRequestParams =
            { CBFunction : "cbValidateSAMAccountName",
              Action : "../Main/ValiGIRAppccountName",
              Data: JSON.stringify({ Data : JSON.stringify(objJsonParams) }),
              Loading : true };

        getDataFromADS(objRequestParams);
    }
}

/**
 *
 * @param { ApplicationResponse } objJsonResponse
 */
function cbValidateSAMAccountName(objJsonResponse)
{
    if (objJsonResponse.resp) {

        formToggle(true);

        /** @type { HTMLInputElement[] } */
        const [txtSAMAccountName, txtContactName, txtEmail] = document.querySelectorAll("#txtEmail, #txtContactName, #txtSAMAccountName");

        txtSAMAccountName.addEventListener("change", detectAccountNameChange);

        const objUserData = tryParseJson(objJsonResponse.data, identity, () => ({ Name: "", Email: "" }));

        txtContactName.value = objUserData.Name;

        txtEmail.value = objUserData.Email;
    }
    else {

        if (objJsonResponse.type == "Session") {
            $('#divModalMsgSession').modal('show');
        } else {
            showITCMessage({ Title: "Información", Msg: objJsonResponse.msg, Type: objJsonResponse.type });
        }
    }
}

/**
 *
 * @param { EventTargetType<HTMLInputElement> } event
 */
function detectAccountNameChange(event)
{
    formToggle(false);

    document.getElementById("txtSAMAccountName")
        .removeEventListener("change", detectAccountNameChange);
}