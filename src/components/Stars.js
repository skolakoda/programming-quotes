import React, {Component} from 'react'
import ReactStars from 'react-stars'


class Stars extends Component{
    constructor(props){
        super(props)

        this.state = { 
            edit: true,
            rating: Number(this.props.rating)
        }
    }
    
    rate = newRating => {
        const http = new XMLHttpRequest()
        http.open('POST', 'https://baza-podataka.herokuapp.com/oceni-citat/')
        http.setRequestHeader('Content-type', 'application/json')
        http.onload = () => console.log(http.responseText)
        http.send(JSON.stringify({'_id': this.props.id, 'novaOcena': newRating}))
        
        this.setState({ 
            edit: false,
            rating: newRating
        })
    }
    render(){
        return(
            <ReactStars size={20} value={this.state.rating} onChange={this.rate} edit={this.state.edit} /> 
        )
    }
}

export default Stars