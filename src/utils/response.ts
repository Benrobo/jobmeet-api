import {Response} from "express"


function sendResponse(
  res: Response,
  status : number = 400,
  success : boolean = true,
  message : string = "",
  data : object = {}
) {
  const formatedMsg = message.slice(0,1).toUpperCase() + message.slice(1)
  const response = {
    status,
    success,
    message: formatedMsg,
    data,
  };

  return res.status(status).json(response);
}

export default sendResponse
