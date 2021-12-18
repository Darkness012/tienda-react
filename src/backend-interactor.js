import * as request from 'superagent';

class  UsersAdmin{
    constructor(){
        this.urlBase = "http://localhost:8080/users/";
    }

    validateLogin(user){
        return new Promise((resolve, reject)=>{
            request
                .post(this.urlBase+"login")
                .send(user)
                .withCredentials()
                .then(res=>{
                    resolve(res.body);
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }

    validateRegister(user){
        return new Promise((resolve, reject)=>{
            request
                .post(this.urlBase+"register")
                .send(user)
                .withCredentials()
                .then(res=>{
                    resolve(res.body);
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }

    cerrarSesion(){
        return new Promise((resolve, reject)=>{
            request
                .post(this.urlBase+"logout")
                .withCredentials()
                .then(res=>{
                    resolve(res.body);
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }

    getUserInfo(){
        return new Promise((resolve, reject)=>{
            request
                .get(this.urlBase+"info")
                .withCredentials()
                .then(result=>{
                    if(result.body.success){
                        resolve(result.body.user);
                    }else{
                        reject(result)
                    }
                    
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }
}

class ProductsAdmin{
    constructor(){
        this.urlBase = "http://localhost:8080/productos/";
    }

    getAllProducts(filter=""){
        return new Promise((resolve, reject)=>{
            request
                .get(this.urlBase+filter)
                .withCredentials()
                .then(result=>{
                    resolve(result.body);
                })
                .catch(err=>{
                    reject(err);
                })

        })
    }

    getCarrito(){
        return new Promise((resolve, reject)=>{
            request
                .get(this.urlBase+"carrito")
                .withCredentials()
                .then(result=>{
                    resolve(result.body);
                })
                .catch(err=>{
                    reject(err);
                })

        })
    }

    eliminarPedido(producto_id){

        return new Promise((resolve, reject)=>{
            request
            .delete(this.urlBase+"carrito/remove-pedido")
            .send({producto_id:producto_id})
            .withCredentials()
            .then(result=>{
                resolve(result.body);
            })
            .catch(err=>{
                reject(err);
            })
        })

        
    }

    cancelarPedidos(){
        return new Promise((resolve, reject)=>{
            request
                .delete(this.urlBase+"carrito/cancelar")
                .withCredentials()
                .then(respuesta=>{
                    resolve(respuesta.body)
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }

    pagarCarrito(){
        return new Promise((resolve, reject)=>{
            request
                .delete(this.urlBase+"carrito/pagar")
                .withCredentials()
                .then(respuesta=>{
                    resolve(respuesta.body)
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }

    addProducto(producto_id, cantidad){
        return new Promise((resolve, reject)=>{
            request
                .post(this.urlBase+"carrito/nuevo-pedido")
                .send({producto_id: producto_id, cantidad:cantidad})
                .withCredentials()
                .then(res=>{
                    resolve(res.body);
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }

}

var usersAdmin = new UsersAdmin();
var productsAdmin = new ProductsAdmin();

export {usersAdmin, productsAdmin};