import React, {Component} from 'react'
import {connect} from 'react-redux'

import Quotes from '../components/main/Quotes'
import AuthorBox from '../components/main/AuthorBox'
import translate from '../shared/translate'

class Author extends Component {
  render() {
    const author = this.props.match.params.name.replace(/_/g, ' ')
    const { language, allQuotes, phrase } = this.props
    const filtered = allQuotes
      .filter(q => q.author === author && q[language] && q[language].toLowerCase().includes(phrase.toLowerCase()))
      .sort(() => 0.5 - Math.random())

    return (
      <main>
        <h1>{author}</h1>
        <AuthorBox author={author} />
        {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
        <Quotes loaded={allQuotes.length} currentQuotes={filtered} />
      </main>
    )
  }
}

const mapStateToProps = ({language, allQuotes, phrase}) => ({language, allQuotes, phrase})

export default connect(mapStateToProps)(Author)
