using DemoDevExtremeJQ.Models;
using DemoDevExtremeJQ.Util;
using Microsoft.AspNetCore.Mvc;
using System;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace DemoDevExtremeJQ.Controllers
{
    public class TableController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        /**
       * Autor: Andres Camacho
       * Tipo: get
       * Descripcion: consulta capacidades del servicio
       * Fecha: 21/09/2023
       */
        [HttpPost]
        public Response GetCapacities([FromBody] Request objRequestParam)
        {
            Response objResponse = new Response()
            {
                Resp = true
            };

            try
            {
                JObject objRequestParams = JObject.Parse(objRequestParam.Data);

                //string strCode = "%" + objRequestParams["Code"].ToString() + "%";
                //string strName = "%" + objRequestParams["Name"].ToString() + "%";
                //string strStatus = objRequestParams["Status"].ToString().Equals("N/A") ? "%%" : objRequestParams["Status"].ToString();

                Connection objConnection = new Connection(Config.DBPass, Config.DBServer, Config.DBName, Config.DBUser);
                //string[] ArrayParams = new string[] { "@CODE", "@NAME", "@STATUS" };
                //string[] ArrayValues = new string[] { strCode, strName, strStatus };

                string strBaseQuery = $@"
                               
                                            SELECT
                                                CAP.CapacityID,
                                                CAP.CapacityCode,
                                                CAP.Description AS CapacityDescription,
                                                CYC.CiclesID,
                                                CYC.Description AS CycleDescription,
                                                (CASE WHEN CAP.Status = 'A' THEN 'Activo' ELSE 'Inactivo' END) AS StatusDescription,
                                                CAP.Status,
                                                CAP.CreatedOn,
                                                COUNT(OKC.CellID) AS NumeroCelulas
                                            FROM Capacities CAP
                                            LEFT JOIN ParametricCycles CYC ON CAP.CiclesID = CYC.CiclesID 
                                            LEFT JOIN CapacityPeriod CPE ON CAP.CapacityID = CPE.CapacityID
                                            LEFT JOIN ModelOKR OKR ON CPE.CapacityPeriodID = OKR.CapacityPeriodID 
                                            LEFT JOIN ModelOKRCell OKC ON OKR.ModelOKRID = OKC.ModelOKRID
                                            GROUP BY
                                                CAP.CapacityID,
                                                CAP.CapacityCode,
                                                CAP.Description,
                                                CYC.CiclesID,
                                                CYC.Description,
                                                CAP.Status,
                                                CAP.CreatedOn
                                            ORDER BY CAP.CreatedOn DESC
                    ";



                strBaseQuery += " ";

                ResponseDB objRespDb = objConnection.getRespFromQuery(0, 500, "", strBaseQuery, null, null, "NO_PAGINATE", "DataTable");

                if (objRespDb.Resp)
                {
                    if (objRespDb.Count > 0)
                    {
                        objResponse.Resp = true;
                        objResponse.Data = JsonConvert.SerializeObject(objRespDb.dtResult, Formatting.None);
                        objResponse.Count = objRespDb.Count;
                    }
                    else
                    {
                        objResponse.Resp = true;
                        objResponse.Data = "[]";
                        objResponse.Count = objRespDb.Count;
                        objResponse.Msg = "Sin datos";
                    }
                }
                else
                {
                    throw new Exception(objRespDb.Msg);
                }
            }
            catch (Exception ex)
            {
                objResponse.Resp = false;
                objResponse.Type = "Error";
                objResponse.Msg = "Ocurrió un error inesperado, por favor consulte al administrador";
                objResponse.Detail = ex.Message;
            }

        endFunction:
            return objResponse;
        }
    }
}
