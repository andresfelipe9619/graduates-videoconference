const API_URL = 'http://gospelgeek.com.co/scriptsuv/index.php'
const PROGRAMAS =
  'https://docs.google.com/spreadsheets/d/1JBq9HT1yLVKGmpiB6fpOc6Lf0kqoZBziya0M5_dTjbo/edit?usp=sharing'

// https://script.google.com/a/correounivalle.edu.co/macros/s/AKfycbynmAHlQAOKCy9OuebeldHFFFnDtDEOB7mK8IskH735LrhI40vaV4wWeqN4sFG4NPM4ag/exec

const getCurrentUser = () => Session.getActiveUser().getEmail()

function isAdmin () {
  const guessEmail = getCurrentUser()
  const admins = [
    'suarez.andres@correounivalle.edu.co',
    'samuel.ramirez@correounivalle.edu.co'
  ]
  Logger.log('guessEmail')
  Logger.log(guessEmail)
  const isGuessAdmin = admins.indexOf(String(guessEmail)) >= 0
  Logger.log(isGuessAdmin)

  return isGuessAdmin
}

function doGet (request) {
  return HtmlService.createTemplateFromFile('front/index.html')
    .evaluate() // evaluate MUST come before setting the Sandbox mode
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function include (filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

function searchPerson (cedula) {
  let person = validatePerson(cedula)
  logFunctionOutput(searchPerson.name, person)
  return person
}

function registerPerson (person) {
  let { sheet: inscritosSheet, headers } = getPeopleRegisteredSheet()
  person.push({ name: 'hora_registro', value: new Date() })
  person.push({ name: 'pago_comprobado', value: 'SI' })
  person.push({ name: 'pago_generado', value: 'SI' })

  logFunctionOutput('Person: ', person)

  let personValues = objectToSheetValues(person, headers)
  let finalValues = personValues.map(value => String(value))

  inscritosSheet.appendRow(finalValues)
  let result = { data: finalValues, ok: true }
  let [nombres, apellidos, cedula, correo, celular] = finalValues
  let dataObj = { nombres, apellidos, cedula, correo, celular }
  sendRegistrationEmail({ person: dataObj })
  logFunctionOutput(registerPerson.name, result)
  return result
}

function getSRAPerson (cedula) {
  const options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: 'cedula=' + cedula,
    validateHttpsCertificates: false
  }
  const result = UrlFetchApp.fetch(API_URL, options).getContentText()
  logFunctionOutput(getSRAPerson.name, result)

  return result
}

function getFacultiesAndPrograms () {
  let result = {
    faculties: null,
    programs: null
  }
  let programs = getPrograms()
  let lastPrograms = []
  let esta = false

  programs.forEach(program => {
    esta = lastPrograms.find(
      last => String(program.nombre) === String(last.nombre)
    )
    if (!esta) lastPrograms.push(program)
  })
  result.faculties = getFacultiesFromPrograms(programs)
  result.programs = lastPrograms
  //logFunctionOutput(getFacultiesAndPrograms.name, result)
  return result
}

function getFacultiesFromPrograms (programs) {
  let faculties = programs.reduce((acc, program) => {
    if (acc.indexOf(program.facultad) < 0) {
      Logger.log('FACULTAD QUE NO ESTA')
      Logger.log(program.facultad)
      acc.push(program.facultad)
    }
    return acc
  }, [])
  return faculties
}

function sendEmailsToGuests () {
  const { sheet: inscritosSheet, headers } = getPeopleRegisteredSheet()
  const data = getPeopleRegistered()
  const emailIndex = headers.indexOf('CORREO_ENVIADO')
  Logger.log('data')
  Logger.log(data)
  const peopleToSendEmail = data.filter(
    p =>
      normalizeString(p.enlace_inscripcion) &&
      !normalizeString(p.correo_enviado)
  )
  Logger.log('peopleToSendEmail')
  Logger.log(peopleToSendEmail)

  peopleToSendEmail.forEach(sendInvitationEmail)
  peopleToSendEmail.forEach(person => {
    let index = data.findIndex(p => p.cedula === person.cedula)
    if (index === -1) return
    let rowIndex = index + 2;
    inscritosSheet.getRange(rowIndex, emailIndex + 1).setValues([['SI']])
  })
  return { ok: true }
}

function getPeopleRegisteredSheet () {
  const sheet = getSheetFromSpreadSheet('ASISTENTES')
  const headers = getHeadersFromSheet(sheet)
  return { sheet, headers }
}

function validatePerson (cedula) {
  let { sheet, headers } = getPeopleRegisteredSheet()
  let result = {
    isRegistered: false,
    index: -1,
    data: null
  }
  const { index } = findText({ sheet, text: cedula })
  console.log(`Cedula: `, cedula)
  console.log(`Index: `, index)
  result.index = index
  logFunctionOutput(validatePerson.name, result)
  if (result.index === -1) {
    result.isRegistered = false
    return result
  }
  const entityRange = sheet.getSheetValues(+index, 1, 1, sheet.getLastColumn())
  Logger.log(`${cedula} Range: ${entityRange.length}`)
  Logger.log(entityRange)
  const [entityData] = sheetValuesToObject(entityRange, headers)
  Logger.log(`${cedula} Data:`)
  Logger.log(entityData)
  result.isRegistered = true
  result.data = entityData
  return result
}

function getEntityData (entity, url) {
  const rawEntities = getRawDataFromSheet(entity, url)
  const entities = sheetValuesToObject(rawEntities)
  return entities
}

function getPrograms () {
  return getEntityData('PROGRAMAS', PROGRAMAS)
}

function getPeopleRegistered () {
  return getEntityData('ASISTENTES')
}

function generatePayment (index) {
  let { sheet: inscritosSheet, headers } = getPeopleRegisteredSheet()
  let pagoIndex = headers.indexOf('PAGO_GENERADO')
  Logger.log(pagoIndex)
  Logger.log(index)
  logFunctionOutput(
    generatePayment.name,
    inscritosSheet.getRange(index, pagoIndex).getValues()
  )
  inscritosSheet.getRange(index + 1, pagoIndex + 1).setValues([['SI']])
  return true
}

function logFunctionOutput (functionName, returnValue) {
  Logger.log('Function-------->' + functionName)
  Logger.log('Value------------>')
  Logger.log(returnValue)
  Logger.log('----------------------------------')
}
