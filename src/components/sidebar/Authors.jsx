import React from 'react'
import {connect} from 'react-redux'

import AuthorThumb from './AuthorThumb'
const shortid = require('shortid')

const Authors = props => (
  <div className="authors">
    {props.authors.map(author =>
      <AuthorThumb
        key={shortid.generate()}
        author={author}
        image={props.allImages.get(author)}
      />
    )}
  </div>
)

const mapStateToProps = ({allImages}) => ({allImages})

export default connect(mapStateToProps)(Authors)
