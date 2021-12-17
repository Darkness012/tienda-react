import React from 'react';
import {useNavigate} from 'react-router-dom';
import { usersAdmin } from '../backend-interactor';

const Login = ()=>{

    const [state, setState] = React.useState( 
        {
            user:{
                email: "", 
                pass: ""
            },
            errorMessages:{
                emailError: "email no valido",
                passError: "contraseña no valida"
            }
        }
    );
    const navigate = useNavigate();

    const onSubmit = (e)=>{
        e.preventDefault();
        
        validate((respuesta)=>{
            
            if(respuesta.success){
                console.log("SI pasara", respuesta);

                navigate("/home");
            }else{
                if(respuesta.error==="INVALID DATA"){
                    setEmailValidity("Email no coincide con ninguna cuenta")
                    setPassValidity("Contraseña invalida")

                }else if(respuesta.error==="WRONG PASSWORD"){
                    setPassValidity("Contraseña invalida")
                }
            }
            e.target.classList.add("was-validated");
        })
    }
    const onEmailChange = (e)=>{
        updateState((newState)=>{
            newState.user.email = e.target.value;
        })
        setEmailValidity("");
    }
    const onPassChange = (e)=>{
        updateState((newState)=>{
            newState.user.pass = e.target.value;
        })
        setPassValidity("");
    }
    const onClickRegister = ()=>{
        navigate("/register")
    }

    function validate(callback){
        usersAdmin.validateLogin(state.user)
            .then((respuesta)=>{
                callback(respuesta);
            })
            .catch(err=>{
                console.log(err);
            })
    }
    function updateState(instructions){
        let newState = Object.assign({}, state);
        instructions(newState);

        setState(newState);
    }
    function setEmailValidity(msg){
        document.getElementById("emailLogin").setCustomValidity(msg)
        updateState((newState)=>{
            newState.errorMessages.emailError = msg;
        })
    }
    function setPassValidity(msg){
        document.getElementById("passLogin").setCustomValidity(msg)
        updateState((newState)=>{
            newState.errorMessages.passError = msg;
        })
    }
    return(
        <div className="login-background">
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row my-5" style={{ width:'500px', maxWidth:'90%', backgroundColor:'white'}}>
                    <div className="col-12 mb-3 mt-3">
                        <h1 className="display-3 login-title text-center">Login</h1>
                    </div>
                    <form className="col-12" onSubmit={onSubmit}>
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-3 form-group has-validation">
                                    <input onChange={onEmailChange} type="email" className="form-control" id="emailLogin" aria-describedby="emailHelp" placeholder="Ingrese Email" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.emailError}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="col-s12 mb-3 form-group has-validation">
                                    <input onChange={onPassChange}  type="password" className="form-control" id="passLogin" placeholder="Contraseña" minLength="6" required></input>
                                    <div className="invalid-feedback">
                                        {state.errorMessages.passError}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-12 mb-3 submit-container">
                                <button type="submit" className="btn btn-primary">Entrar</button>
                            </div>
                            
                        </div>
                        
                    </form>
                    <div className="col-12 d-flex flex-column">
                        <span className="text-center text-secondary">No tienes cuenta?</span>

                        <button onClick={onClickRegister} type="button" className="btn btn-link mb-3">Crear cuenta</button>
                    </div>
                </div>
            </div>
            
        </div>
    )
    
}


export default Login;