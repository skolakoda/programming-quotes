import React, {Component} from 'react'
import Quote from './Quote'
import preloader from '../../assets/images/preloader.gif'

const quotesPerPage = 10

export default class Quotes extends Component {
  constructor(props) {
    super(props)
    this.state = {currentPage: 0}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({currentPage: 0})
  }

  turnThePage = e => {
    this.setState({currentPage: e.target.value})
  }

  render() {
    const { language, loaded, currentQuotes, token } = this.props
    const startPosition = this.state.currentPage * quotesPerPage
    const preparedQuotes = currentQuotes
      .filter((q, i) => i >= startPosition && i < startPosition + quotesPerPage)
      .map(q =>
        <Quote key={q._id} language={language} quote={q} token={token} />
      )
    const pagination = []
    const totalPages = Math.ceil(currentQuotes.length / quotesPerPage)
    for (let i = 0; i < totalPages; i++)
      pagination.push(<button value={i} onClick={this.turnThePage} key={i}>{i}</button>)

    return loaded ?
      (
        <div>
          {preparedQuotes}
          {totalPages > 1 && <p>{pagination}</p>}
        </div>
      )
      : <img src={preloader} alt="loading..." />
  }
}
