import { FastifyRequest, FastifyReply } from "fastify";
import { authSchema, registerSchema,  } from "../utils/schema";
import { loginService, registerService } from "../services/auth.service";
import {
  InvalidCredentialsError,
  UserExistsError,
  UserNotFoundError,
} from "../utils/error";


export async function registerController(
  req: FastifyRequest,
  rep: FastifyReply
) {
  try {
    const result = registerSchema.safeParse(req.body);
  

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }
   

    const data = result.data;
    
    const serviceInput: any = {
      email: data.email,
      password: data.password,
      role: data.role,
    }

    if(data.role === "COMPANY"){
      serviceInput.companyName = data.companyName;
      serviceInput.companyWebsite = data.companyWebsite;
      serviceInput.companyDescription = data.companyDescription;
    }

    const user = await registerService(serviceInput);

    return rep.status(201).send({
      success: true,
     data:user
      
    });
  } catch (error:any) {
   

    if (error instanceof UserExistsError) {
      return rep.status(409).send({
        success: false,
        message: "User already exists",
      });
    }
    if (error instanceof InvalidCredentialsError) {
      return rep.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }


    if (error instanceof UserNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return rep.status(500).send({
      success: false,
    message: error.message,
    code: error.code,
    });
  }
}

export async function loginController(req: FastifyRequest, rep: FastifyReply) {
  try {
  const body = authSchema.safeParse(req.body);
  if (!body.success) {
    return rep.status(400).send({
      success: false,
      message: "Invalid request",
      error: body.error.issues[0].message,
    });
  }

  const { email, password } = body.data;

  
    const result = await loginService(email, password);

    

    return rep.status(200).send({
      success: true,
      message: "Login successful",
      data:{
        token: result.token,
        user: result.user,
      }
      
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return rep.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    return rep.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}
