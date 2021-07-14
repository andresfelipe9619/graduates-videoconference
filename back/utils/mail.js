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
        <p><strong>Fecha de Inscripción:</strong> ${new Date().toLocaleString(
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

function sendInvitationEmail (person) {
  const subject = 'Bienvenidos a la videoconferencia!'
  const body = `
    <div style="text-align:left">
        <h3>Estimado egresado,</h3>
        <h3 style="margin-bottom:10px"> 
          Le damos la bienvenida a la videoconferencia “Pospandemia y reorientación estratégica empresarial” a cargo del profesor Leonardo Solarte Pazos.
        </h3>
        <p style="margin-bottom:10px"> 
          A continuación encontrará el enlace para ingresar el día de mañana jueves 15 de Julio.
        </p>
        <p style="margin-bottom:10px"> 
          <a href="${person.enlace_inscripcion}">Enlace Videoconferencia</a>
        </p>
        <p style="margin-bottom:10px"> 
          Tenga en cuenta que este enlace es único, y sólo un dispositivo podrá conectarse a la videoconferencia por este medio.
        </p>
        <p style="margin-bottom:10px"> 
          Desde las 6:00pm usted podrá ingresar a la sala de espera y sobre las 6:20pm se permitirá el ingreso a la sala general. La videoconferencia está programada para iniciar a las 6:30pm y terminar a las 7:30pm. 
        </p>
        <p style="margin-bottom:10px"> 
          Cualquier inquietud o dificultad para el proceso de ingreso, favor comunicarse al correo soyegresado@correounivalle.edu.co. estaremos atentos a brindarle el apoyo correspondiente.
        </p>
        <p style="margin-bottom:10px"> 
          Agradecemos su interés y participación en este importante evento.
        </p>
        <p style="margin-bottom:10px">
          <strong>Universidad del Valle</strong>
          Rectoría.
        </p>
    </div>`
  return sendEmail({ person, subject, body })
}

const getFullname = person =>
  `${person.nombres}  ${' '} ${person.apellidos}`.toUpperCase()
