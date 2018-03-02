import React, {Component} from 'react'
import AuthorThumb from './AuthorThumb'
const shortid = require('shortid')

export default class Authors extends Component {

  componentWillReceiveProps(nextProps) {
    const authors = nextProps.authors.join("|")

    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${authors}&prop=pageimages&format=json&pithumbsize=50&origin=*`)
    .then(res => res.json())
    .then(res => console.log(res.query.pages))
  }

  render() {
    const preparedAuthors = [...this.props.authors].sort().map(author =>
      <AuthorThumb key={shortid.generate()} author={author} />
    )
    return (
      <div className="authors">
        {preparedAuthors}
      </div>
    )
  }
}
