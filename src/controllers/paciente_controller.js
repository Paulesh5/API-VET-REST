import { sendMailToPaciente } from "../config/nodemailer.js"
import Paciente from "../models/Paciente.js"


const loginPaciente = (req,res)=>{
    res.send("Login del paciente")
}
const perfilPaciente = (req,res)=>{
    res.send("Perfil del paciente")
}
const listarPacientes = async (req,res)=>{
    // Obtener todos los pacientes que se encuentren activos
    // Que sea solo los del paciente que inicie sesion
    // Quitar los campos no necesarios
    // Mostrar campos de documentos relacionados
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v -password").populate('veterinario','_id nombre apellido')
    // Respuesta
    res.status(200).json(pacientes)
}
const detallePaciente = (req,res)=>{
    res.send("Detalle del paciente")
}
const registrarPaciente = async(req,res)=>{
    // desestructurar el email
    const {email} = req.body
    // validar todos los campos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // obtener el usuario en base al email
    const verificarEmailBDD = await Paciente.findOne({email})
    // verificar si el paciente ya se encuntra registrado
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // crear una instancia del paciente
    const nuevoPaciente = new Paciente(req.body)
    // Crear un password
    const password = Math.random().toString(36).slice(2)
    // Encriptar el password
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password)
    // Enviar el correo electrónico
    await sendMailToPaciente(email,"vet"+password)
    // Asociar el paciente con el veterinario
    nuevoPaciente.veterinario=req.veterinarioBDD._id
    // Guardar en BDD
    await nuevoPaciente.save()
    // Presentar resultados
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado"})
}
const actualizarPaciente = (req,res)=>{
    res.send("Actualizar paciente")
}
const eliminarPaciente = (req,res)=>{
    res.send("Eliminar paciente")
}

export {
    loginPaciente,
	perfilPaciente, 
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}