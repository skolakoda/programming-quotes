import React, {Component} from 'react'
import Quotes from '../components/main/Quotes'

class Home extends Component {
  componentDidMount() {
    this.props.resetFilters()
  }

  render() {
    const {language, currentQuotes} = this.props
    return (
      <main>
        <Quotes language={language} currentQuotes={currentQuotes} />
      </main>
    )
  }
}

export default Home
