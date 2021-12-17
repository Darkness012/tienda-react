import { useNavigate } from "react-router";
import { usersAdmin } from "../../backend-interactor";
import React from 'react';

const InfoUser = (props)=>{
    const navigate = useNavigate();

    const onClickCerrarSesion =()=>{
        usersAdmin.cerrarSesion()
            .then(result=>{
                if(result.success){
                    console.log("se cerro sesion")
                    navigate('/login');

                }else{
                    throw result;
                }

            })
            .catch(err=>{
                throw err;
            })
    }   

    return (
        <div className="container">

            {
                props.user?
                
                <div style={{
                    display:"flex", 
                    flexDirection:"column", 
                    alignItems:"center", 
                    boxShadow:'2px 2px 5px rgb(197, 197, 197)'}}
                    
                    className="pb-5"
                >
    
                    <i className="fa fa-user account-icon text-info" aria-hidden="true"></i>
                    <h2 className="text-dark">{props.user.nombre+" "+props.user.apellido}</h2>
                    <h5 className="text-info">{props.user.email}</h5>
                    <h6 className="text-secondary">{props.user.telefono}</h6>
                    <button onClick={onClickCerrarSesion} type="button" className="btn btn-danger mt-3">Cerrar Sesión</button>
                </div>
                
                :

                <div>Cargando usuario...</div>
            }

        </div>
    )
    
}

class Account extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: ''
        }
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    render() { 
        return (
            <InfoUser user={this.state.user}/>
        )
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
        this.mounted = true;
        this.getUserInfo();
    }

    getUserInfo(){

        if(this.mounted){
            usersAdmin.getUserInfo()
            .then(user=>{
                this.setState({
                    user: user
                })
    
                console.log("asdsad")
            })
            .catch(err=>{
                throw err;
            })
        }

        
    }

}


 
export default Account;
