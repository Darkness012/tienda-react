
import { Link } from "react-router-dom";
import { usersAdmin } from "../../backend-interactor";
import { useNavigate } from 'react-router-dom';
import React from 'react';

function SalirBtn(){
    const navigate = useNavigate();

    const onClickSalir = ()=>{
        console.log("Cerrar session");
        usersAdmin.cerrarSesion()
            .then(respuesta=>{
                if(respuesta.success){
                    console.log("saliendo...")
                    navigate("/login");
                }else{
                    alert("Error al cerrar session");
                }
            })
            .catch(err=>{
                alert("ERROR")
                throw err;
            })
    }

    return (
        <span style={{cursor:'pointer', userSelect:'none'}} onClick={onClickSalir} className="nav-link"><i className="fa fa-sign-out" aria-hidden="true"></i><span className="pl-1">Salir</span></span>
    );

}

function SearchBar(props){

    const navigate = useNavigate();

    const onClickBuscar = (e)=>{
        e.preventDefault();
        props.updateFilter(props.filter);
        navigate("/home");
    }

    return (
        <form onSubmit={onClickBuscar} className="form-inline" style={{flexGrow:"1"}}>
            <input value={props.filter} onChange={props.onChangeFilter} className="form-control mr-sm-2" type="search" placeholder="Buscar producto" aria-label="Search"></input>
            <button className="btn btn-outline-info my-2 my-sm-0" type="submit"><i className="fa fa-search" aria-hidden="true"></i> Buscar</button>
        </form>
    );
}

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            filter: "",
            cartCount: 0,
            active: 0
        }

        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onCartCountChange = this.onCartCountChange.bind(this);
        this.setCartCount = this.setCartCount.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    
    onChangeFilter(e){
        this.setState({
            filter: e.target.value
        })
    }

    onCartCountChange(){
        this.setState({
            cartCount: this.state.cartCount+1
        })
        
    }

    setCartCount(count){

        console.log("SETTING NEW CART COUNT", count)

        this.setState({
            cartCount: count
        })
    }


    onClickLink(linkPosition){
        this.setState({
            active: linkPosition
        })
    }

    componentDidMount(){
        this.props.cartCountChange(this.onCartCountChange);
        this.props.setCartCount(this.setCartCount)
    }

    render() { 
        return (

            <div id="navbar">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
                    <Link className="navbar-brand" to="/"><i className="fa fa-cart-plus" aria-hidden="true"></i> Tienda</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
    
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
    
                        <SearchBar 
                            onChangeFilter={this.onChangeFilter}
                            updateFilter= {this.props.updateFilter}
                            filter={this.state.filter}
                            />
    
                        <ul className="navbar-nav">
                            <li className={this.state.active===0?'nav-item active':'nav-item '} onClick={()=>{this.onClickLink(0)}}>
                                <Link className="nav-link" to="" ><i className="fa fa-home" aria-hidden="true"></i><span className="pl-1">Inicio</span></Link>
                            </li>
                            <li className={this.state.active===1?'nav-item active':'nav-item '} onClick={()=>{this.onClickLink(1)}}>
                                <Link className="nav-link" to="carrito" >
                                    
                                    <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {this.state.cartCount>0?this.state.cartCount:''}
                                    </span>
                                    <span className={this.state.cartCount?'pl-4':'pl-1'}>Carrito</span>
                                    
                                </Link>
                            </li>
                            <li className={this.state.active===2?'nav-item active':'nav-item '} onClick={()=>{this.onClickLink(2)}}>
                                <Link className="nav-link" to="account" ><i className="fa fa-user" aria-hidden="true"></i><span className="pl-1">Cuenta</span></Link>
                            </li>
                            <li className={this.state.active===3?'nav-item active':'nav-item '} onClick={()=>{this.onClickLink(3)}}>
                                <SalirBtn />
                            </li>
                        </ul>
    
                        
                    </div>
                </nav>
            </div>
    
        );
    }
}
 
export default Navbar;
