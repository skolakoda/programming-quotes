import React from 'react'
import './AddQuote.css'

class AddQuote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			autor: '',
			quote: ''
		}
		this.addQuote = this.addQuote.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.deleteQuote = this.deleteQuote.bind(this);
	}

	handleInput(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	addQuote(e) {
		e.preventDefault();
		fetch("https://baza-podataka.herokuapp.com/dodaj-citat/", {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				autor: this.state.autor,
				sr: this.state.quote
			})
		})
  alert(`Quote by: "${this.state.autor}" has been updated to quote base.
          Thank you for updating!`);
  }

	deleteQuote(e) {
		e.preventDefault();
		fetch("https://baza-podataka.herokuapp.com/obrisi-citat/", {
			method: 'delete',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id: "kjdjkjawkj"
			})
		})
		alert(`Deleted`);
	}

  render() {
   return (
    <div>
      <h1>Add Quote</h1>
       <form className="center" onSubmit={this.addQuote} >
        <label>Author Name:</label>
         <input  type="text" placeholder="Author.." name='autor' onChange={this.handleInput}/>
         <textarea name="quote"  cols="35" rows="10" style={{resize:'none'}} onChange={this.handleInput} placeholder="Quote text.."></textarea>
         <input id="submit" type="submit" value="Add Quote"></input>
         <button onClick={this.deleteQuote}>Delete quote</button>
       </form>
      </div>
    );
  }
}

export default AddQuote;
