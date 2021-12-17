import React from 'react';
import { usersAdmin } from '../backend-interactor';
import { useNavigate } from 'react-router-dom';

const Registro = ()=> {

    const [state, setState] = React.useState( 
        {
            user:{
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
                pass: ""
            },
            errorMessages:{
                nombreError: "Ingrese un nombre valido",
                apellidoError: "Ingrese un apellido valido",
                emailError: "",
                telefonoError: "",
                passError: "La contraseña debe de tener al menos 6 caracteres",
                passAgainError: ""
            },
            validating: 0
        }
    );

    const navigate = useNavigate();

    const onSubmit = (e)=>{
        e.preventDefault();
        e.target.classList.add("was-validated");

        
        validateInfo((results)=>{
            if(results.success){

                console.log("ingresara");
                console.log(state.user);

                //NAVIGATE TO MAIN PAGE
                navigate("/home")
            }else{

                if(results.emailExists){
                    //EMAIL ALREADY REGISTERED
                    setEmailError("Email ya registrado")
                    console.log("email ya registrado")
                }

                if(results.phoneExists){
                    //PHONE ALREADY REGISTERED
                    setTelefonoError("Telefono ya registrado")
                    console.log("telefono ya registrado")
                }

                console.log("invalid data")
            }
            
        })

        
    }

    const updateState = (instruction)=>{
        var newState = Object.assign({}, state);
        instruction(newState);
        
        setState(newState)
    }

    const onNameChange =(e)=>{

        updateState((newState)=>{
            newState.user.nombre = e.target.value;
        })

    }
    const onLastNameChange =(e)=>{
        updateState((newState)=>{
            newState.user.apellido = e.target.value;
        })
    }
    const onEmailChange =(e)=>{
        updateState((newState)=>{
            newState.user.email = e.target.value;
            newState.errorMessages.emailError = "Ingrese un email valido";
        })
        
        if(!e.target.checkValidity()){
            e.target.setCustomValidity("");
        }

    }
    const onTelefonoChange = (e)=>{
        updateState((newState)=>{
            newState.user.telefono = e.target.value;
            newState.errorMessages.telefonoError = "Ingrese un telefono valido";
        })

        if(!e.target.checkValidity()){
            e.target.setCustomValidity("");
        }else{
            if(e.target.value.length<8){
                e.target.setCustomValidity("Numero de telefono no valido");
            }
        }

    }
    const onPassChange =(e)=>{
        validatePassword();
        
        updateState((newState)=>{
            newState.user.pass = e.target.value;
        })

        
    }
    const onPassAgainChange =()=>{
        validatePassword();
    }

    function validateInfo(callback){
        setValidatingStatus(1);

        if(validatePassword()){
            usersAdmin.validateRegister(state.user)
                .then(respuesta=>{
                    if(!respuesta.emailExists && !respuesta.phoneExists){

                        //CREATED SUCCESFULY
                        callback({success:true})
                    }else{
                        //INVALID DATA
                        callback(respuesta);
                    }

                    setValidatingStatus(0);
                })
                .catch(err=>{
                    console.log(err)
                    setValidatingStatus(0);
                })

        }else{
            callback(false);
        }
    }
    function validatePassword(){
        console.log("validando")
        let pass = document.getElementById('passInput');
        let repeatedPass = document.getElementById('passAgainInput');

        if(pass.value === repeatedPass.value){
            repeatedPass.setCustomValidity("");
            return true;
        }else{
            updateState((newState)=>{
                newState.errorMessages.passAgainError = "Las contraseñas deben de coincidir";
            })
            repeatedPass.setCustomValidity("Las contraseñas deben de coincidir");
            return false;
        }
    }
    function setEmailError(msg){
        updateState((newState)=>{
            newState.errorMessages.emailError = msg;
        })
        document.getElementById("emailInput").setCustomValidity(msg)
    }
    function setTelefonoError(msg){

        updateState((newState)=>{
            newState.errorMessages.telefonoError = msg;
        })
        document.getElementById("telefonoInput").setCustomValidity(msg)
    }
    function setValidatingStatus(val){
        updateState((newState)=>{
            newState.validating = val;
        })
    }

    
    return (

        <div className="login-background">

            <div className='container d-flex justify-content-center align-items-center'>
                <div className="row my-5" style={{ width:'700px', maxWidth:'90%', backgroundColor:'white'}}>
                    <div className="col-12 mb-3 mt-3">
                        <h1 className="display-4 text-center">Registrarse</h1>
                    </div>
                    <form className="col-12" onSubmit={onSubmit}>

                        <div className="row">

                            <div className="col-12 col-md-6">
                                <div className="mb-2 form-group has-validation">
                                    <label htmlFor="nombreInput">Nombre:</label>
                                    <input minLength="3" onChange={onNameChange} type="text" className="form-control" id="nombreInput" placeholder="Ingrese nombre" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.nombreError}
                                    </div>
                                </div>
                                
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="mb-2 form-group has-validation">
                                    <label htmlFor="apellidoInput">Apellido:</label>
                                    <input minLength="3" onChange={onLastNameChange} type="text" className="form-control" id="apellidoInput" placeholder="Ingrese apellido" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.apellidoError}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="mb-2 form-group has-validation">
                                    <label htmlFor="emailInput">Email:</label>
                                    <input onChange={onEmailChange} type="email" className="form-control" id="emailInput" placeholder="Ingrese email" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.emailError}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="mb-2 form-group has-validation">
                                    <label htmlFor="telefonoInput">Telefono:</label>
                                    <input minLength="8" onChange={onTelefonoChange} type="number" className="form-control" id="telefonoInput" placeholder="Ingrese Telefono" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.telefonoError}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="mb-2 form-group has-validation">
                                    <label htmlFor="passInput">Contraseña:</label>
                                    <input minLength="6" onChange={onPassChange} type="password" className="form-control" id="passInput" placeholder="Ingrese contraseña" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.passError}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="mb-2 form-group has-validation">
                                    <label htmlFor="passAgainInput">Repita Contraseña:</label>
                                    <input minLength="6" onChange={onPassAgainChange} type="password" className="form-control" id="passAgainInput" placeholder="Ingrese nuevamente contraseña" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.passAgainError}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="mb-2 form-check">
                                    <input type="checkbox" className="form-check-input" id="checkInput" required></input>
                                    <label className="form-check-label" htmlFor="checkInput">Acepto terminos y condiciones</label>
                                </div>
                            </div>

                            <div className="col-12 submit-container">
                                <button type="submit" className=" mb-3 btn btn-primary" disabled={state.validating}>
                                    {
                                        state.validating?<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:
                                        "Enviar"
                                    }
                                    
                                </button>

                            </div>
                            
                        </div>
                    </form>
                </div>
            </div>

            
        </div>
    );
}
 
export default Registro;