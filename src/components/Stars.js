import React, {Component} from 'react'
import ReactStars from 'react-stars'
import { vote } from '../shared/helpers'
import './Stars.css'

class Stars extends Component {
    constructor(props) {
        super()
        this.state = {
            rating: Number(props.rating),
            error: false
        }
    }

    onRating(newRating) {
        let storage = JSON.parse(localStorage.getItem('programerskicitatiocene'))
        if(!storage) {
            vote(this.props.quoteId, newRating)
                .then(res => {
                    if(res === 'OK') {
                        let storageData = [
                            this.props.quoteId
                        ]
                        localStorage.setItem('programerskicitatiocene', JSON.stringify(storageData))
                        this.setState({ rating: newRating})
                    }
                })
        } else if(Array.isArray(storage) && storage.indexOf(this.props.quoteId) < 0) {
            vote(this.props.quoteId, newRating)
            .then(res => {
                if(res === 'OK') {
                    let storageData = [
                        ...storage,
                        this.props.quoteId
                    ]
                    localStorage.setItem('programerskicitatiocene', JSON.stringify(storageData))
                    this.setState({ rating: newRating})
                }
            })
        } else {
            this.setState({
                rating: Number(this.state.rating),
                error: true
            })
        }
            

        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.rating !== this.state.rating) this.setState({ rating: Number(nextProps.rating) })
    }

    render(){
        return(
            <div>
                <ReactStars size={20} value={this.state.rating} onChange={this.onRating.bind(this)}/>
                {this.state.error && <p className="voting-error">You can vote just once</p>}
            </div>
            
        )
    }
}
export default Stars