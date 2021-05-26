function sendEmail ({ subject, body, person }) {
  Logger.log('I like the way you french inhale')
  Logger.log(person)
  if (!person) return
  MailApp.sendEmail({
    to: person.correo,
    subject: subject,
    name: 'VIDEOCONFERENCIA EGRESADOS 2021',
    htmlBody: body
  })
}

const longFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
}

function sendRegistrationEmail ({ person }) {
  const subject = 'Inscripción Exitosa!'
  const body = `
    <div style="text-align:left">
        <h3>Tu inscripción a la videoconferncia Políticas públicas de gestión del riesgo en el manejo del Covid-19 "Una carrera contra el tiempo", fue exitosa.</h3>
        <h3>Te esperamos el proximo jueves 17 de Junio a las 6:00pm. via zoom. Un dia antes del evento, estará llegando al correo registrado, en enlace de acceso a la videoconferencia.</h3>
        <h3>Detalle del registro:</h3>
        <p><strong>Fecha de Inscripcion:</strong> ${new Date().toLocaleString(
          'en-US',
          longFormatOptions
        )} </p>
        <p><strong>Nombre Completo: </strong> ${getFullname(person)} </p>
        <p><strong>CC: </strong>${person.cedula}</p>
        <p><strong>Email: </strong>${person.correo}</p>
        <p><strong>Celular: </strong>${person.celular}</p>
    </div>`
  return sendEmail({ person, subject, body })
}

const getFullname = person =>
  `${person.nombres}  ${' '} ${person.apellidos}`.toUpperCase()
