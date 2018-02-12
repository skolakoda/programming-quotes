import React from 'react'

class AddQuote extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	handleInput = event => {
    const {name, value} = event.target
		this.setState({
			[name]: value
		})
       
	}

	addQuote = e => {
    e.preventDefault()
    fetch("https://baza-podataka.herokuapp.com/dodaj-citat/", {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(this.state)
		})
    .then(response => response.text())
    .then(response => console.log(response))
  }

	deleteQuote = e => {
		e.preventDefault()
		fetch("https://baza-podataka.herokuapp.com/obrisi-citat/", {
			method: 'delete',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				_id: "kjdjkjawkj"
			})
		})
    .then(response => response.text())
    .then(response => console.log(response))
	}

  render() {
   return (
    <div>
      <h1>Add Quote</h1>
      <form className="center" onSubmit={this.addQuote} >
        <p>
          <label>Author name (<small>like on en.wikipedia</small>) </label><br/>
          <input name='autor' onChange={this.handleInput} required />
        </p>
        <p>
          <label>English version</label><br/>
          <textarea name="en" cols="60" rows="5" onChange={this.handleInput}></textarea>
        </p>
        <p>
          <label>Serbian translation</label><br/>
          <textarea name="sr" cols="60" rows="5" onChange={this.handleInput}></textarea>
        </p>
        <p>
          <label>Source (<small>optional</small>): </label><br/>
          <input name='izvor' onChange={this.handleInput} />
        </p>
        <p>
          <small>* Author and at least one language is required.</small>
        </p>
        <input type="submit" value="Add Quote"></input>
         <button onClick={this.deleteQuote}>Delete quote</button> 
      </form>
    </div>
    )
  }
}

export default AddQuote
