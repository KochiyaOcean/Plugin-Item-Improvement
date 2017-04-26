import React, { PropTypes } from 'react'

const Divider = props => (
  <div className="divider">
    <h5>{props.text}</h5>
    <hr />
  </div>
  )

Divider.propTypes = {
  text: PropTypes.string.isRequired,
}

export { Divider }
