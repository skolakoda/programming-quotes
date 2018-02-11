import React, {Component} from 'react'
import Quotes from '../components/main/Quotes'
import Picture from '../components/main/Picture'

const isEqual = function(array1, array2) {
  if (!array1 || !array2) return false
  if (array1.length !== array2.length) return false

  for (let i = 0, l = array1.length; i < l; i++) {
    if (array1[i] !== array2[i]) return false
  }
  return true
}

class ShowAuthor extends Component {
  componentDidMount() {
    this.props.setAuthor(this.props.match.params.name)
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.match.params.name !== this.props.match.params.name) ||
      (nextProps.match.params.name !== this.props.chosenAuthor) ||
      (nextProps.match.params.name !== nextProps.chosenAuthor) ||
      (!isEqual(this.props.currentQuotes, nextProps.currentQuotes))
    )
      this.props.setAuthor(this.props.match.params.name)
  }

  render() {
    const { language, chosenAuthor, mainImage, currentQuotes } = this.props
    return (
      <main>
        <h3>{chosenAuthor}</h3>
        <Picture imgSrc={mainImage} author={chosenAuthor} />
        <Quotes language={language} currentQuotes={currentQuotes} />
      </main>
    )
  }
}

export default ShowAuthor
