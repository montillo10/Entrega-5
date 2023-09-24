// Dos opciones: exportar una clase o exportar un objeto literal - (Por el momento vamos a exportar un objeto literal)
//paramName es el nombre del parámetro que se quiere validar (id, pib, cid, etc.)

/**
** Validations:
* Invalid Parametres number (paramName)
*/
export const checkId = (paramName) => { 
    return(req, res, next) => {
      const id = parseInt(req.params[paramName]);
      if (!id) {
        return res
          .status(400)
          .json({ error: `Invalid parameters: ${paramName} is required` });
      }
      if (typeof id !== "number") {
        return res
          .status(400)
          .json({ error: `Invalid parameters: ${paramName} must be a number` });
      }
      if (id <= 0) {
        return res
          .status(400)
          .json({ error: `Invalid parameters: ${paramName} must be greater than 0` });
      }
      next();
    };
  };

export const checkLimit = (req, res, next) => {
    /**
     ** Validations:
     * Invalid Parametres number ( limit)
     */
    const limit = parseInt(req.query.limit);
    if (limit) {
      if (typeof limit !== "number") {
        return res
          .status(400)
          .json({ error: "Invalid parameters: limit must be a number" });
      }
      if (limit < 0) {
        return res
          .status(400)
          .json({ error: "Invalid parameters: limit must be greater than 0" });
      }
    }
    next();
  };