import React, {Component} from 'react'
import Quotes from '../components/main/Quotes'
import Picture from '../components/main/Picture'
import {fetchImage} from '../shared/helpers'

class Author extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: ''
    }
  }

  componentDidMount() {
    this.getImage(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.name !== this.props.match.params.name)
      this.getImage(nextProps)
  }

  getImage(props) {
    this.setState({image: ''})
    const author = props.match.params.name
    fetchImage(author, '250', image => this.setState({image}))
  }

  render() {
    const author = this.props.match.params.name
    const { language, allQuotes, password } = this.props
    const currentQuotes = allQuotes.filter(q => q.autor === author)

    return (
      <main>
        <h1>{author}</h1>
        <Picture imgSrc={this.state.image} author={author} />
        <Quotes language={language} currentQuotes={currentQuotes} password={password} />
      </main>
    )
  }
}

export default Author
