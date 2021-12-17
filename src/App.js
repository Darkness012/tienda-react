import React from 'react';
import Home from './component/home';
import Login from './component/login';
import Registro from './component/register';
import Carrito from './component/home-components/cart';
import Productos from './component/home-components/productos';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate

} from 'react-router-dom';
import Account from './component/home-components/account';


class App extends React.Component {

    constructor(props){
        super(props);

        this.state={
            filter:''
        }

        this.updateFilter = this.updateFilter.bind(this);
        this.filterChange = this.filterChange.bind(this);
        this.addProductoClick = this.addProductoClick.bind(this);
        this.setCartCountChangeFunction = this.setCartCountChangeFunction.bind(this);
        this.setCartCountSetter = this.setCartCountSetter.bind(this);
        this.notifyCartCount = this.notifyCartCount.bind(this);
        this.updateCartCount = this.updateCartCount.bind(this);
    }

    updateFilter(filter){
        this.setState({
            filter:filter
        })
        if(this.refresh){
            this.refresh(filter);
        }
        
    }

    filterChange(callback){
        this.refresh = callback;
    }
    addProductoClick(){
        this.updateCartCount()
    }

    setCartCountChangeFunction(cartChange){
        this.cartCountChange = cartChange;
    }
    setCartCountSetter(setter){
        this.cartCountSetter = setter;
    }
    
    notifyCartCount(count){
        this.cartCountSetter(count)
    }

    updateCartCount(){
        this.cartCountChange()
    }

    
    render() { 
        return (
            <Router>
                <Routes>
                    <Route exact path='/' element={<Navigate to="home"/>} />
                    <Route 
                        exact 
                        path='/home' 
                        element={
                            <Home 
                                setCartCount={this.setCartCountSetter} 
                                cartCountChange={this.setCartCountChangeFunction} 
                                updateFilter={this.updateFilter}/>} 
                    >
                        <Route
                            path='' 
                            element={
                            <Productos 
                                setCartCount={this.notifyCartCount}
                                addProducto={this.addProductoClick} 
                                filter={this.state.filter} 
                                filterChange={this.filterChange}/>
                            } 
                        />

                        <Route 
                            path='carrito' 
                            element={<Carrito notifyCartCount={this.notifyCartCount}/>} />

                        <Route 
                            path='account' 
                            element={<Account />} />
                    </Route>
                    
                    <Route exact path='/login' element={<Login/>} />
                    <Route exact path='/register' element={<Registro/>} />
                </Routes>
            </Router>
        );
    }
}
 
export default App;