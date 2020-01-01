import React from 'react'
import {useSelector} from 'react-redux'

import {useTranslate} from '../store/actions'
import EditForm from '../components/main/EditForm'
import './EditQuote'

const AddQuote = () => {
  const {admin} = useSelector(state => state)
  const translate = useTranslate()

  if (!admin) return <p>{translate('ADMIN_REQUIRED')}</p>

  return <EditForm />
}

export default AddQuote
