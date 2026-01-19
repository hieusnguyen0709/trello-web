// Một vài biểu thức chính quy - Regular Expression và custom message.
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@trungquandev.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match!'

// Liên quan đến Validate File
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const LIMIT_COMMON_ATTACHMENT_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_ATTACHMENT_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export const singleFileValidator = (file, type) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  
  if (type == 'image') {
    if (file.size > LIMIT_COMMON_FILE_SIZE) {
      return 'Maximum file size exceeded. (10MB)'
    }
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
      return 'File type is invalid. Only accept jpg, jpeg and png'
    }
  } else if (type == 'file') {
    if (file.size > LIMIT_COMMON_ATTACHMENT_FILE_SIZE) {
      return 'Maximum file size exceeded. (10MB)'
    }
    if (!ALLOW_COMMON_ATTACHMENT_FILE_TYPES.includes(file.type)) {
      return 'File type is invalid. Only accept PDF (.pdf), Word (.doc, .docx), Excel (.xls, .xlsx)'
    }
  }

  return null
}

export const multiFilesValidator = (files, type) => {
  if (!files || files.length === 0) {
    return 'Please select at least one file.'
  }

  for (const file of files) {
    const error = singleFileValidator(file, type)
    if (error) return error
  }

  return null
}