import React from 'react';

class Parent extends React.Component {
    state = {
        Child: 'Loading...'
    }
    import('./Child')
        .then(Child=> this.setState({Child.default}))
        .catch((err)=>this.setState({Child:err.message}))

    render(){
        <div>
            <img src={require('./image.png')}/>
            <this.state.Child/>
        </div>
    }
}

export default Parent