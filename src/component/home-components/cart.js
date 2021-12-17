import React from 'react';
import { productsAdmin } from '../../backend-interactor';

class Pedido extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            deleting: false
        }
        this.onClickEliminar = this.onClickEliminar.bind(this);
    }

    onClickEliminar(){

        this.setState({
            deleting: true
        })
        this.props.clickEliminar(this.props.pedido, ()=>{
            console.log("elimino")
            if(this.mounted){
                this.setState({
                    deleting: false
                })
            }
            
        });
    }

    render() { 
        return (
            <li className="list-group-item d-flex justify-content-between align-items-center">

                <div>
                    <img height="25px" src={this.props.image} className="rounded-circle mr-2" alt="Cinque Terre"></img>

                    {this.props.pedido.nombre}
                    <span className="badge badge-primary badge-pill">{this.props.pedido.count}</span>
                </div>
                
                
                <div>
                    

                {
                    this.state.deleting?
                    <div>
                        <span>Eliminando...</span>
                        <i style={{userSelect:"none"}} className="ml-4 fa fa-trash" aria-hidden="true"></i>
                    </div>
                    :
                    <div>
                        <span className="font-weight-bold">{"$"+this.props.pedido.subtotal+".00"}</span>
                        <i onClick={this.onClickEliminar} style={{cursor:"pointer", userSelect:"none"}} className="ml-4 fa fa-trash text-danger" aria-hidden="true"></i>
                    </div>
                    
                }

                    
                </div>

                
            </li>
        );
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
        this.mounted = true;
    }
}
 
class Pedidos extends React.Component {

    render() { 
        return (
            <div className="mt-4 text-secondary">
                <h3>Productos en la lista</h3>
                <ul className="list-group ">
                    {
                        this.props.pedidos.length>0?
                        this.props.pedidos.map(pedido=>{
                            return <Pedido 
                                    key={pedido.producto_id+"-"+pedido.usuario_id}
                                    clickEliminar={this.props.clickEliminarPedido}
                                    image={"http://localhost:8080/images/"+pedido.nombre}
                                    pedido={pedido}/>

                        }) : <div>No hay pedidos</div>
                    }
                    

                </ul>
            </div>
            
        );
    }
}

class Total extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            doingAction: false,
            msg: 'Doing action...'
        }
        this.onClickPagar = this.onClickPagar.bind(this);
        this.onClickCancelar = this.onClickCancelar.bind(this);
    }

    onClickPagar(){
        this.setState({
            doingAction: true,
            msg: 'Pagando...'
        })
        this.props.pagarClick(()=>{
            console.log("Se pago")

            this.setState({
                doingAction: false,
            })
        })
    }
    onClickCancelar(){
        this.setState({
            doingAction: true,
            msg: 'Cancelando...'
        })
        this.props.cancelarClick(()=>{
            console.log("Se cancelo")
            this.setState({
                doingAction: false
            })
        })
    }
    render() { 
        return (
            <div className="row mt-2">
                <div className="col-12 text-center">
                    <h1 className="text-info">Total ${this.props.total}.00</h1>
                </div>
                <div className="col-12 text-center mb-2">
                    <button disabled={!this.props.total || this.state.doingAction} onClick={this.onClickPagar} type="button" className="btn btn-outline-info btn-block">Pagar</button>
                </div>
                <div className="col-12 text-center">
                    <button disabled={!this.props.total || this.state.doingAction} onClick={this.onClickCancelar} type="button" className="btn btn-outline-danger btn-block">Cancelar</button>
                </div>

                <div hidden={!this.state.doingAction} className="col-12 text-center mt-3">
                    <h4 className="text-secondary">{this.state.msg}</h4>
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }
}
 
class Carrito extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pedidos: [],
            total: 0
        }
        
        this.onClickEliminarPedido = this.onClickEliminarPedido.bind(this);
        this.onClickPagar = this.onClickPagar.bind(this);
        this.onClickCancelar = this.onClickCancelar.bind(this)
        this.restaurar = this.restaurar.bind(this);
    }

    onClickEliminarPedido(pedido, callback){
        
        let delPos = this.state.pedidos.indexOf(pedido);
        let newPedidos = Object.assign([], this.state.pedidos);

        if(delPos !== -1){

            productsAdmin.eliminarPedido(pedido.producto_id)
                .then(respuesta=>{
                    if(respuesta.success){
                        newPedidos.splice(delPos, 1);
                            this.setState({
                                pedidos: newPedidos,
                                total: this.getTotal(newPedidos)
                            })

                            this.props.notifyCartCount(newPedidos.length);
                    }else{
                        throw respuesta;
                    }

                    callback()
                })
                .catch(err=>{
                    throw err;
                })
        }
        console.log(pedido)

    }
    onClickPagar(callback){
        console.log("Se pagara");
        
        productsAdmin.pagarCarrito()
            .then(respuesta=>{
                if(respuesta.success){
                    this.restaurar();
                    console.log("Se pago el carrito")
                    callback();
                }else{
                    throw respuesta;
                }

            })
            .catch(err=>{
                throw err;
            })

        
    }
    onClickCancelar(callback){
        console.log("Se cancelara");
        productsAdmin.cancelarPedidos()
            .then(resultado=>{
                if(resultado.success){
                    console.log("Se cancelo el carrito")
                    this.restaurar();
                    callback();
                }
            })
            .catch(err=>{
                throw err;
            })
    }

    restaurar(){
        this.setState({
            pedidos: [],
            total:0
        })
        this.props.notifyCartCount(0);
    }
    getTotal(pedidos){
        let total = 0;
        pedidos.forEach(pedido=>{
            total += pedido.subtotal;
        })

        return total;
    }

    render() { 
        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-secondary">Carrito de compras</h2>
                    </div>
                    
                    <div className="col-12 col-md-6 order-3 order-md-2">
                        <Pedidos 
                            pedidos={this.state.pedidos} 
                            clickEliminarPedido={this.onClickEliminarPedido}/>
                    </div>
                    
                    <div className="col-12 col-md-6 order-2 order-md-3 total-container">
                        <Total 
                            total={this.state.total}
                            pagarClick={this.onClickPagar}
                            cancelarClick={this.onClickCancelar}/>
                    </div>
                    
                </div>
            </div>
            
        );
    }

    componentDidMount(){
        productsAdmin.getCarrito()
            .then(carrito=>{
                this.setState({
                    pedidos: carrito.pedidos,
                    total: this.getTotal(carrito.pedidos)
                }, ()=>{
                    this.props.notifyCartCount(this.state.pedidos.length)
                })

            })
            .catch(err=>{
                throw err;
            })
    }
}
 
export default Carrito;