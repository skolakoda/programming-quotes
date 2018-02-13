import React, { Component } from 'react'
import translate from '../shared/translate'
import MessagePopup from './MessagePopup'

// dodati sugestije za autora

class AddQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      popupMessage: ''
    }
  }

  postQuote(e) {
    e.preventDefault()
    const autor = e.target.elements.author.value
    const en = e.target.elements.en.value
    const sr = e.target.elements.sr.value
    const izvor = e.target.elements.izvor.value
    const condition = autor && (sr || en)
    if (!condition) return this.setState({ error: translate('ARGUMENTS_ERROR') })

    fetch('https://baza-podataka.herokuapp.com/dodaj-citat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, sr, en, izvor })
    })
      .then(response => response.text())
      .catch(e => this.setState({ popupMessage: translate('ERROR_POPUP') }))
      .then(response => {
        this.setState({ error: '', popupMessage: translate('SUCCESS_SAVED') })
        // uzeti u obzir povratnu poruku
        console.log(response)
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.postQuote.bind(this)}>
          <p>
            <label htmlFor="author" >{translate('AUTHOR')} <small>(like on en.wikipedia)</small> </label><br/>
            <input name="author" required />
          </p>

          <p>
            <label htmlFor="sr" >{translate('QUOTE_SERBIAN')}</label><br />
            <textarea name="sr" cols="60" rows="5" onChange={this.handleInput}></textarea>
          </p>

          <p>
            <label htmlFor="en" >{translate('QUOTE_ENGLISH')}</label><br />
            <textarea name="en" cols="60" rows="5" onChange={this.handleInput}></textarea>
          </p>

          <p>
            <label>Source (<small>optional</small>): </label><br/>
            <input name='izvor' />
          </p>

          <p>
            <small>* Author and at least one language is required.</small>
          </p>

          {this.state.error && <p>{this.state.error}</p>}

          <input value={translate('SAVE')} type="submit" />
        </form>

        {this.state.popupMessage && <MessagePopup message={this.state.popupMessage} closePopup={() => this.setState({ popupMessage: '' })} />}
      </div>
    )
  }
}

export default AddQuote
