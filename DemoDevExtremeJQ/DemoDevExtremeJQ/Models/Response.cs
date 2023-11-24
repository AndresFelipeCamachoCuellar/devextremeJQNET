using System;
using System.Collections.Generic;

namespace DemoDevExtremeJQ.Models
{
    /// <summary>
    /// Summary description for Response
    /// </summary>
    public class Response
    {
        public Response()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        #region Propiedades

        /// <summary>
        /// Identificador de la respuesta.
        /// </summary>
        public bool Resp
        {
            get;
            set;
        }

        /// <summary>
        /// Contenido del mensaje.
        /// </summary>
        public string Msg
        {
            get;
            set;
        }

        /// <summary>
        /// Tipo del mensaje.
        /// </summary>
        public string Type
        {
            get;
            set;
        }

        /// <summary>
        /// Redirect to Page?
        /// </summary>
        public string Redirect
        {
            get;
            set;
        }
        /// <summary>
        /// Json Data Resp
        /// </summary>
        public string Data
        {
            get;
            set;
        }

        /// <summary>
        /// Detalle del error.
        /// </summary>
        public string Detail
        {
            get;
            set;
        }

        /// <summary>
        /// Valida si se puede retirar el colaborador
        /// </summary>
        public bool CanBeWithdrawn
        {
            get;
            set;
        }

        /// <summary>
        /// Json Aditional Data
        /// </summary>
        public String Json
        {
            get;
            set;
        }

        /// <summary>
        /// Row Count
        /// </summary>
        public int Count
        {
            get;
            set;
        }

        /// <summary>
        /// Row INDEX
        /// </summary>
        public int Index
        {
            get;
            set;
        }

        /// <summary>
        /// Row Codigo de respuesta del servicio
        /// </summary>
        public int StatusCode
        {
            get;
            set;
        }

        /// <summary>
        /// Json Labels
        /// </summary>
        public string Label
        {
            get;
            set;
        }

        /// <summary>
        /// Guid PK
        /// </summary>
        public string Id
        {
            get;
            set;
        }

        public List<JsonResultModel> ResultErrors
        {
            get;
            set;
        }
        public int CountErrors
        {
            get;
            set;
        }

        #endregion
    }

}

public class JsonResultModel
{

    public string Msg
    {
        get;
        set;
    }
    public string Detail
    {
        get;
        set;
    }
    public string GuidRow
    {
        get;
        set;
    }
    public string PersonnelNumber
    {
        get;
        set;
    }


}