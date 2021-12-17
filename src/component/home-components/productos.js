import React from 'react';
import { productsAdmin } from '../../backend-interactor';

const ModalProducto = (props)=>{
    return (
        
        <div className="modal fade" id="product-modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
            {
                props.producto?
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">{props.producto.nombre}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <img src={"http://localhost:8080/images/"+props.producto.nombre} className="img-fluid" alt="Producto"></img>
                        <h1 className="text-success">${props.producto.precio}.00</h1>
                        <h5 className="text-secondary">Unidades restantes: {props.producto.unidades}</h5>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Salir</button>
                    </div>
                </div>
                :
                <div className="modal-content">
                    Loading...
                </div>
                
            }
                
            </div>
        </div>
    );
}

class Producto extends React.Component {

    constructor(props){
        super(props);

        this.onClickAddProduct = this.onClickAddProduct.bind(this);
        this.onCantidadChange = this.onCantidadChange.bind(this);
        this.capitalize = this.capitalize.bind(this);
        this.state = {
            cantidad: 1,
            adding: false
        }
    }

    onClickAddProduct(producto, cantidad){

        this.setState({
            adding: true
        })

        productsAdmin.addProducto(producto.id, cantidad)
            .then(respuesta=>{
                
                this.setState({
                    adding: false
                })

                if(respuesta.success){
                    //SUCCESS

                    producto.unidades = producto.unidades-cantidad;
                    this.setState({
                        cantidad:1
                    })

                    if(respuesta.success==='INSERTED'){
                        this.props.addProducto()
                    }
                }else{
                    throw respuesta;
                }
            })
            .catch(err=>{
                throw err;
            })


        
    }
    onCantidadChange(e){

        if(e.target.value){
            if(parseInt(e.target.value)>this.props.product.unidades){
                this.setState({cantidad: this.props.product.unidades})
            }else{
    
                if(parseInt(e.target.value)<1){
                    this.setState({cantidad: 1})
                }else{
                    this.setState({cantidad: parseInt(e.target.value)})
                }
            }
        }else{
            this.setState({cantidad:'*/'})
        }
        
        

        console.log(this.state)
        
    }
    capitalize(text){
        let upper = text.charAt(0);
        let last = text.substring(1);

        return upper.toUpperCase()+last.toLocaleLowerCase();
    }

    render() { 
        let hoverable = {cursor:'pointer', userSelect:'none'}
        let producto = this.props.product; 
        return (
            <div className="card mb-3">
                <img onClick={()=>{this.props.setProduct(producto)}} style={hoverable} data-toggle="modal" data-target="#product-modal" src={"http://localhost:8080/images/"+producto.nombre}className="card-img-top" alt="Producto"></img>
                <div className="card-body">
                    <h5 onClick={()=>{this.props.setProduct(producto)}}  style={hoverable} data-toggle="modal" data-target="#product-modal" className="card-title">{this.capitalize(producto.nombre)}</h5>
    
                    <div className="producto-description-container">
                        <h5 className="text-success ">Precio: ${producto.precio}.00</h5>
                    {
                        this.state.adding?
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                            
                        </div>:
                        <span className="text-secondary mb-2">Unidades: {producto.unidades}</span>
                    }
                        
                    </div>
    
                    <div hidden={!producto.unidades} className="form-group add-producto-container">
                        <input max={producto.unidades} min="1" onChange={this.onCantidadChange} value={this.state.cantidad} type="number" className="form-control" ></input>
                        <button disabled={!this.state.cantidad || this.state.adding} onClick={()=>{this.onClickAddProduct(producto, this.state.cantidad)}} type="button" className="btn btn-primary">
                            <i className="fa fa-cart-plus" aria-hidden="true"></i>
                        </button>

    
                    </div>
                    <button disabled hidden={producto.unidades} type="button" className="btn btn-danger btn-block">Agotado</button>
                </div>
            </div>
        )
    }
}
 

class Productos extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            productos: [],
            currentProduct: ''
        }

        this.obtenerProductos = this.obtenerProductos.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.updateCurrentProduct = this.updateCurrentProduct.bind(this);
        this.onClickResetFilter = this.onClickResetFilter.bind(this);
    }

    obtenerProductos(filtro){
        if(this.mounted){
            productsAdmin.getAllProducts(filtro)
            .then(result=>{
                
                this.setState({
                    productos:result.products
                })
                if(result.carrito){
                    this.props.setCartCount(result.carrito.length);
                }
                

            })
            .catch(err=>{
                throw err;
            })
        }
        
    }

    onFilterChange(filtro){
        this.obtenerProductos(filtro);
    }

    updateCurrentProduct(producto){
        this.setState({
            currentProduct: producto
        })
    }

    onClickResetFilter(){
        this.obtenerProductos();
    }

    render() { 
        return (
            <div className="container mt-4">
                
                <div className="d-flex justify-content-between">
                    <h2 className="text-secondary mb-4">Catalogo de productos</h2>
                    <div>
                        <button onClick={this.onClickResetFilter} hidden={this.state.productos} type="button" className="btn btn-primary">Ver todos</button>
                    </div>
                    
                </div>
                

                <ModalProducto producto={this.state.currentProduct} />
                <div className="row">
                    {

                        this.state.productos?
                        
                        this.state.productos.map(producto=>{
                            return <div key={producto.id} className="col-6 col-md-4 col-lg-3">
                                <Producto
                                    setProduct={this.updateCurrentProduct}
                                    addProducto={this.props.addProducto} 
                                    product={producto}/>
                                </div>;
                        }):
                        
                        <div>No hay resultados</div>
                    }
                </div>
            </div>
            
        );
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
        this.mounted = true;

        console.log("did mount")

        this.props.filterChange(this.onFilterChange);

        this.obtenerProductos(this.props.filter);
        

    }


}
 
export default Productos;