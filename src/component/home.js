import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './home-components/navbar';

class Home extends React.Component {

    render() { 
        return(
            <div>
                <Navbar 
                    updateFilter={this.props.updateFilter}
                    cartCountChange={this.props.cartCountChange}
                    setCartCount={this.props.setCartCount}/>
                    
                <div >
                    <Outlet />
                </div>
                
            </div>
        );
    }
}
 
export default Home;