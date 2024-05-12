import React, {useState} from 'react'
import { uid } from 'uid'


const SelectDropdownMenu = ({ onSaveForm, data, id, options,disableForm,disableText,disableButtons,onHandleNext }) => {

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        options: [
          { id: uid(5), value: '' },
          { id: uid(5), value: '' }
    
        ],
        selectedValue: [{ question: '', answer: '', value: '' }],
        formType: 'DropdownMenu'
      });

  return (
    <div>SelectDropdownMenu</div>
  )
}

export default SelectDropdownMenu