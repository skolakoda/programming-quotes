import React, {Component} from 'react'
import AuthorThumb from './AuthorThumb'
const shortid = require('shortid')

export default class Authors extends Component {

  render() {
    const preparedAuthors = this.props.authors.map(author =>
      <AuthorThumb
        key={shortid.generate()}
        author={author}
        image={this.props.allImages.get(author)}
      />
    )
    return (
      <div className="authors">
        {preparedAuthors}
      </div>
    )
  }
}
