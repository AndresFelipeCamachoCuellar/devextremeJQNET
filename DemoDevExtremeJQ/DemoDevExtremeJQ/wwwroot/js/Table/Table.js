$(document).ready(function () {
    //GetCapacities();
    GetTable();
});


function GetTable() {

    let statusColors = {
        "Error": "danger",
        "Success": "success",
        "Procesado con errores": "info"
    };

    var botones = [
        { ICON: "fa-search", EVENT: "", TITLE: "Click para editar" },
        { ICON: "fa-user-circle fa-lg", EVENT: "", COLOR: "danger",TITLE: "Ver células asociadas" }
    ];

    var jsonTable = {
        DATA: customers,
        LABEL: ["Empresa", "Ciudad", "Telefono", "Estado", "Estado switch", "Acciones"],
        COLS: ['CompanyName', 'City', 'Phone', 'StatusDes'],
        ID: "Capacities",
        BUTTONS: botones,
        PAGELENGTH: 10,
        ISAPPROVAL: "UpdateStatus",
        blSearch: true,
        trafficLights: true,
        ArrayLights: [{ ValidationType: "Estado", Label: "Estado", StatusColors: statusColors }]
    };

    newBuildTbl(jsonTable);
}

function GetCapacities() {
    var objJsonParams = {
    };

    var objRequestParams = {
        CBFunction: "cbGetCapacities",
        Action: "../Table/GetCapacities",
        Data: JSON.stringify({ Data: JSON.stringify(objJsonParams) }),
        Loading: true
    };
    getDataFromADS(objRequestParams);
}


function cbGetCapacities(jsonResp) {
    if (jsonResp.resp) {

        let arrData = JSON.parse(jsonResp.data);

        var botones = [
            { ICON: "fa-search", EVENT: "GetCapacityDetails", TITLE: "Click para editar" },
            { ICON: "fa-user-circle fa-lg", EVENT: "", TITLE: "Ver células asociadas" }
        ];

        var jsonTable = {
            DATA: arrData,
            LABEL: ["Código", "Nombre", "Ciclo", "Células", "Estado", "Acciones"],
            COLS: ["CapacityCode", "CapacityDescription", "CycleDescription", "NumeroCelulas"],
            ID: "Capacities",
            BUTTONS: botones,
            PAGELENGTH: 10,
            ISAPPROVAL: "UpdateStatus"
        };

        buildTbl(jsonTable);

    } else {

        var jsonMsg = {
            Title: 'Mensaje',
            Msg: jsonResp.msg,
            Type: jsonResp.type
        };
        showITCMessage(jsonMsg);
    }
}

            //----------------jquery devextreme

function newBuildTbl(jsonTbl) {

    ///--------------------paginacion
    let paginate = 10;
    var nuRows = 0;
    var nuPage = 0;
    if (typeof (jsonTbl.blPaginate) !== "undefined") {
        paginate = jsonTbl.PAGELENGTH;
    }

    if (typeof (jsonTbl.ROWS) !== "undefined") {
        nuRows = jsonTbl.ROWS;
    }

    if (typeof (jsonTbl.PAGE) !== "undefined") {
        nuPage = jsonTbl.PAGE;
    }

    ///--------------------Busqueda en tabla
    var blFilters = true;
    if (typeof (jsonTbl.blSearch) !== "undefined") {
        blFilters = jsonTbl.blSearch;
    }

    var blIsApprovalTable = false;
    if (typeof (jsonTbl.ISAPPROVAL) !== "undefined") {
        blIsApprovalTable = true;
    }


    var blTrafficLights = false;
    if (typeof (jsonTbl.trafficLights) !== "undefined") {
        blTrafficLights = jsonTbl.trafficLights;
    }

    var blScrollColumns = false;
    var arrColumnsScroll = [];

    if (typeof (jsonTbl.Scrollable) !== "undefined") {
        blScrollColumns = true;
        arrColumnsScroll = jsonTbl.Scrollable;
    }

    var arrColumns = [];

    let strHtmlCustom = "";
    

    for (let i = 0; i < jsonTbl.LABEL.length; i++) {
        if (typeof (jsonTbl.COLS[i]) !== "undefined") {
            var txtColor = "success";
            if (blTrafficLights) {
                if (jsonTbl.LABEL[i] == "Estado") {
                    arrColumns.push({
                        caption: jsonTbl.LABEL[i],
                        dataField: jsonTbl.COLS[i],
                        cellTemplate: function (container, options) {
                            let arrLights = jsonTbl.ArrayLights;
                            let blTurnedOn = false;
                            for (let m = 0; m < arrLights.length; m++) {
                                switch (arrLights[m].ValidationType) {
                                    case "Estado":
                                        if (arrLights[m].StatusColors[options.data[jsonTbl.COLS[i]]] != undefined) {
                                            blTurnedOn = true;
                                            txtColor = arrLights[m].StatusColors[options.data[jsonTbl.COLS[i]]];
                                        } else {
                                            blTurnedOn = false;
                                        }
                                        break;
                                }
                            }
                            strHtmlCustom = "<div style='display: flex;justify-content: center;'>";
                            if (blTurnedOn) {
                                strHtmlCustom += `<div class="card border-0 border-left-${txtColor} rounded-0" style="border-width: 0.4rem !important; background:transparent;">
                                                    <p class="m-2 text-${txtColor}">${options.data[jsonTbl.COLS[i]]}</p>
                                                </div>`;
                            } else {
                                if (blScrollColumns) {
                                    if (arrColumnsScroll.includes(j)) {
                                        strHtmlCustom += `<div class="scrollable">
                                                            ${options.data[jsonTbl.COLS[i]]}
                                                        </div>`;
                                    } else {
                                        
                                    }
                                } else {
                                    strHtmlCustom += options.data[jsonTbl.COLS[i]];
                                }
                            }
                            strHtmlCustom += "</div>";
                            $(strHtmlCustom).appendTo(container);
                        }
                    });
                } else {
                    arrColumns.push({
                        caption: jsonTbl.LABEL[i],
                        dataField: jsonTbl.COLS[i],

                    });
                }
            } else {
                arrColumns.push({
                    caption: jsonTbl.LABEL[i],
                    dataField: jsonTbl.COLS[i],

                });
            }
            
        } else if (i == (jsonTbl.LABEL.length - 2) && blIsApprovalTable) {
            
            arrColumns.push({
                caption: jsonTbl.LABEL[i],
                dataField: jsonTbl.COLS[i],
                cellTemplate: function (container, options) {
                    strHtmlCustom = "<div style='display: flex;justify-content: center;'>";
                    for (var x = 0; x < jsonTbl.BUTTONS.length; x++) {
                        if (x > 0) {
                            strHtmlCustom += "&nbsp;";
                        }
                        var strColor = "primary";
                        if (jsonTbl.BUTTONS[x].COLOR != null && jsonTbl.BUTTONS[x].COLOR != "") {
                            strColor = jsonTbl.BUTTONS[x].COLOR;
                        }

                        strHtmlCustom += "<a href='#!' style='position:relative;' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(options.data) + ")' class='mr-2 btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i>";
                    }
                    strHtmlCustom += "</div>";

                    strHtmlCustom = "<div style='display: flex;justify-content: center;'>";
                    if (options.data.Status == "I") {
                        strHtmlCustom += "<label class='switch'><input type='checkbox' onchange='" + jsonTbl.ISAPPROVAL + "(" + JSON.stringify(options.data) + ")' id='checkStat" + i + "'> <span class='slider round'></span></label>";
                    } else {
                        strHtmlCustom += "<label class='switch'><input type='checkbox' onchange='" + jsonTbl.ISAPPROVAL + "(" + JSON.stringify(options.data) + ")' id='checkStat" + i + "' checked> <span class='slider round'></span></label>";
                    }
                    strHtmlCustom += "</div>";

                    $(strHtmlCustom).appendTo(container);
                }
            });
        } else {
            arrColumns.push({
                caption: jsonTbl.LABEL[i],
                dataField: jsonTbl.COLS[i],
                cellTemplate: function (container, options) {
                    strHtmlCustom = "<div style='display: flex;justify-content: center;'>";
                    for (var x = 0; x < jsonTbl.BUTTONS.length; x++) {
                        if (x > 0) {
                            strHtmlCustom += "&nbsp;";
                        }
                        var strColor = "primary";
                        if (jsonTbl.BUTTONS[x].COLOR != null && jsonTbl.BUTTONS[x].COLOR != "") {
                            strColor = jsonTbl.BUTTONS[x].COLOR;
                        }

                        strHtmlCustom += "<a href='#!' style='position:relative;' onclick='" + jsonTbl.BUTTONS[x].EVENT + "(" + JSON.stringify(options.data) + ")' class='mr-2 btn btn-" + strColor + " btn-circle btn-sm'  title='" + jsonTbl.BUTTONS[x].TITLE + "' ><i class='fas " + jsonTbl.BUTTONS[x].ICON + "'></i>";
                    }
                    strHtmlCustom += "</div>";
                    $(strHtmlCustom).appendTo(container);
                }
            });
        }
    }

    


    if (typeof (jsonTbl.CBPaginate) !== "undefined") {
        $('#divTable' + jsonTbl.ID).dxDataGrid({
            dataSource: jsonTbl.DATA,
            columns: arrColumns,
            allowColumnReordering: true,
            showBorders: true,
            showColumnLines: true,
            columnsAutoWidth: true,
            filterRow: {
                visible: blFilters,
                applyFilter: 'auto',
            },
            searchPanel: {
                visible: blFilters,
                width: 240,
            },
            headerFilter: {
                visible: blFilters,
            },
            scrolling: {
                mode: 'infinite',
            },
            paging: {
                pageSize: paginate,
            },
            pager: {
                showPageSizeSelector: true,
                showNavigationButtons: true,
                allowedPageSizes: [10, 25, 50, 100],
                visible: true,
                showInfo: true,
            },
            onPageChanged: function (e) {
                // Método personalizado que se llama al cambiar de página
                window[jsonTbl.CBPaginate](e.pageIndex, e.component.pageSize());
            }
        });
    } else {
        $('#divTable' + jsonTbl.ID).dxDataGrid({
            dataSource: jsonTbl.DATA,
            columns: arrColumns,
            allowColumnReordering: true,
            showBorders: true,
            showColumnLines: true,
            columnsAutoWidth: true,
            filterRow: {
                visible: blFilters,
                applyFilter: 'auto',
            },
            searchPanel: {
                visible: blFilters,
                width: 240,
            },
            headerFilter: {
                visible: blFilters,
            },
            scrolling: {
                mode: 'infinite',
            },
            paging: {
                pageSize: paginate,
            },
            pager: {
                showPageSizeSelector: true,
                showNavigationButtons: true,
                allowedPageSizes: [10, 25, 50, 100],
                visible: true,
                showInfo: true,
            },
        });
    }

    
}


const customers = [{
    ID: 1,
    CompanyName: 'Super Mart of the West',
    Address: '702 SW 8th Street',
    City: 'Bentonville',
    State: 'Arkansas',
    Status: 'A',
    StatusDes: 'Success',
    Zipcode: 72716,
    Phone: '(800) 555-2797',
    Fax: '(800) 555-2171',
    Website: 'http://www.nowebsitesupermart.com',
}, {
    ID: 2,
    CompanyName: 'Electronics Depot',
    Address: '2455 Paces Ferry Road NW',
    City: 'Atlanta',
    State: 'Georgia',
    Status: 'A',
    StatusDes: 'Procesado con errores',
    Zipcode: 30339,
    Phone: '(800) 595-3232',
    Fax: '(800) 595-3231',
    Website: 'http://www.nowebsitedepot.com',
}, {
    ID: 3,
    CompanyName: 'K&S Music',
    Address: '1000 Nicllet Mall',
    City: 'Minneapolis',
    State: 'Minnesota',
    Status: 'I',
    StatusDes: 'Error',
    Zipcode: 55403,
    Phone: '(612) 304-6073',
    Fax: '(612) 304-6074',
    Website: 'http://www.nowebsitemusic.com',
}, {
    ID: 4,
    CompanyName: "Tom's Club",
    Address: '999 Lake Drive',
    City: 'Issaquah',
    State: 'Washington',
    Status: 'A',
    StatusDes: 'Procesado con errores',
    Zipcode: 98027,
    Phone: '(800) 955-2292',
    Fax: '(800) 955-2293',
    Website: 'http://www.nowebsitetomsclub.com',
}, {
    ID: 5,
    CompanyName: 'E-Mart',
    Address: '3333 Beverly Rd',
    City: 'Hoffman Estates',
    State: 'Illinois',
    Status: 'A',
    StatusDes: 'Success',
    Zipcode: 60179,
    Phone: '(847) 286-2500',
    Fax: '(847) 286-2501',
    Website: 'http://www.nowebsiteemart.com',
}, {
    ID: 6,
    CompanyName: 'Walters',
    Address: '200 Wilmot Rd',
    City: 'Deerfield',
    State: 'Illinois',
    Status: 'A',
    StatusDes: 'Success',
    Zipcode: 60015,
    Phone: '(847) 940-2500',
    Fax: '(847) 940-2501',
    Website: 'http://www.nowebsitewalters.com',
}, {
    ID: 7,
    CompanyName: 'StereoShack',
    Address: '400 Commerce S',
    City: 'Fort Worth',
    State: 'Texas',
    Status: 'I',
    StatusDes: 'Procesado con errores',
    Zipcode: 76102,
    Phone: '(817) 820-0741',
    Fax: '(817) 820-0742',
    Website: 'http://www.nowebsiteshack.com',
}, {
    ID: 8,
    CompanyName: 'Circuit Town',
    Address: '2200 Kensington Court',
    City: 'Oak Brook',
    State: 'Illinois',
    Status: 'A',
    StatusDes: 'Success',
    Zipcode: 60523,
    Phone: '(800) 955-2929',
    Fax: '(800) 955-9392',
    Website: 'http://www.nowebsitecircuittown.com',
}, {
    ID: 9,
    CompanyName: 'Premier Buy',
    Address: '7601 Penn Avenue South',
    City: 'Richfield',
    State: 'Minnesota',
    Status: 'A',
    StatusDes: 'Success',
    Zipcode: 55423,
    Phone: '(612) 291-1000',
    Fax: '(612) 291-2001',
    Website: 'http://www.nowebsitepremierbuy.com',
}, {
    ID: 10,
    CompanyName: 'ElectrixMax',
    Address: '263 Shuman Blvd',
    City: 'Naperville',
    State: 'Illinois',
    Status: 'A',
    StatusDes: 'Success',
    Zipcode: 60563,
    Phone: '(630) 438-7800',
    Fax: '(630) 438-7801',
    Website: 'http://www.nowebsiteelectrixmax.com',
}, {
    ID: 11,
    CompanyName: 'Video Emporium',
    Address: '1201 Elm Street',
    City: 'Dallas',
    State: 'Texas',
    Status: 'I',
    StatusDes: 'Error',
    Zipcode: 75270,
    Phone: '(214) 854-3000',
    Fax: '(214) 854-3001',
    Website: 'http://www.nowebsitevideoemporium.com',
}, {
    ID: 12,
    CompanyName: 'Screen Shop',
    Address: '1000 Lowes Blvd',
    City: 'Mooresville',
    State: 'North Carolina',
    Status: 'A',
    StatusDes: 'Procesado con errores',
    Zipcode: 28117,
    Phone: '(800) 445-6937',
    Fax: '(800) 445-6938',
    Website: 'http://www.nowebsitescreenshop.com',
}];